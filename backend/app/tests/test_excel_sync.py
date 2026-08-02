"""Excel sync outbox worker: delivery, retries, dead-lettering, idempotency,
disabled mode and backfill. The webhook is faked at the single network
seam (`_post_event`) — no Microsoft dependency in tests."""

from datetime import timezone

import httpx
import pytest
from sqlalchemy import select

from app.core.config import Settings
from app.db.base import utcnow
from app.db.session import get_session_factory
from app.models.lead_capture import ExcelSyncOutbox
from app.services import excel_sync_service
from app.services.excel_sync_service import ExcelSyncService


def _settings(**overrides) -> Settings:
    values = {
        "excel_sync_enabled": True,
        "excel_sync_webhook_url": "https://prod-flow.example.com/workflows/abc/triggers/manual/paths/invoke",
        "excel_sync_webhook_secret": "test-secret",
        "excel_sync_batch_size": 25,
        "excel_sync_max_attempts": 3,
    }
    values.update(overrides)
    return Settings(**values)


class FakeResponse:
    def __init__(self, status_code: int) -> None:
        self.status_code = status_code


def _seed_outbox(client, count: int = 1) -> None:
    for i in range(count):
        response = client.post(
            "/api/v1/contact",
            json={
                "name": f"Lead {i}",
                "company": "GFF AI",
                "email": f"lead{i}@example.com",
                "intent": "general",
                "message": f"Enquiry number {i}.",
                "source": "contact_page",
                "metadata": {},
            },
        )
        assert response.status_code == 200


def _events(db):
    return list(db.scalars(select(ExcelSyncOutbox)))


def test_successful_delivery_marks_synced_with_headers(client, monkeypatch):
    _seed_outbox(client)
    calls = []

    def fake_post(url, *, json, headers):
        calls.append({"url": url, "json": json, "headers": headers})
        return FakeResponse(200)

    monkeypatch.setattr(excel_sync_service, "_post_event", fake_post)

    with get_session_factory()() as db:
        summary = ExcelSyncService(db, _settings()).process_due()
        assert summary["synced"] == 1

        event = _events(db)[0]
        assert event.status == "synced"
        assert event.synced_at is not None

    call = calls[0]
    assert call["headers"]["X-GFFAI-Webhook-Secret"] == "test-secret"
    assert call["headers"]["X-GFFAI-Event-ID"] == call["json"]["eventId"]
    assert call["json"]["schemaVersion"] == "1.0"
    assert call["json"]["sheetKey"] == "sales_enquiries"
    assert call["json"]["row"]["Email"] == "lead0@example.com"


def test_synced_events_are_never_resent(client, monkeypatch):
    _seed_outbox(client)
    calls = []
    monkeypatch.setattr(
        excel_sync_service, "_post_event", lambda url, *, json, headers: calls.append(1) or FakeResponse(200)
    )
    with get_session_factory()() as db:
        service = ExcelSyncService(db, _settings())
        service.process_due()
        service.process_due()  # duplicate worker pass
    assert len(calls) == 1


def test_server_error_schedules_retry_with_backoff(client, monkeypatch):
    _seed_outbox(client)
    monkeypatch.setattr(excel_sync_service, "_post_event", lambda url, *, json, headers: FakeResponse(500))

    with get_session_factory()() as db:
        summary = ExcelSyncService(db, _settings()).process_due()
        assert summary["retried"] == 1
        event = _events(db)[0]
        assert event.status == "failed"
        assert event.attempt_count == 1
        # SQLite hands back naive datetimes; normalise before comparing.
        next_at = event.next_attempt_at
        if next_at.tzinfo is None:
            next_at = next_at.replace(tzinfo=timezone.utc)
        assert next_at > utcnow()
        assert "http 500" in event.last_error


def test_client_error_is_dead_lettered_immediately(client, monkeypatch):
    _seed_outbox(client)
    monkeypatch.setattr(excel_sync_service, "_post_event", lambda url, *, json, headers: FakeResponse(403))

    with get_session_factory()() as db:
        ExcelSyncService(db, _settings()).process_due()
        event = _events(db)[0]
        assert event.status == "dead"
        assert "http 403" in event.last_error


def test_timeout_retries_then_dead_letters_at_max_attempts(client, monkeypatch):
    _seed_outbox(client)

    def raise_timeout(url, *, json, headers):
        raise httpx.TimeoutException("timed out")

    monkeypatch.setattr(excel_sync_service, "_post_event", raise_timeout)
    settings = _settings(excel_sync_max_attempts=2)

    with get_session_factory()() as db:
        service = ExcelSyncService(db, settings)
        service.process_due()
        event = _events(db)[0]
        assert event.status == "failed"

        # Force the retry due now, then exhaust the final attempt.
        event.next_attempt_at = utcnow()
        db.commit()
        service.process_due()
        event = _events(db)[0]
        assert event.status == "dead"
        assert event.attempt_count == 2


def test_retry_command_requeues_dead_events_and_next_pass_syncs(client, monkeypatch):
    _seed_outbox(client)
    monkeypatch.setattr(excel_sync_service, "_post_event", lambda url, *, json, headers: FakeResponse(400))
    with get_session_factory()() as db:
        service = ExcelSyncService(db, _settings())
        service.process_due()
        assert _events(db)[0].status == "dead"

        requeued = service.retry(include_dead=True, reset_attempts=True)
        assert requeued == 1
        assert _events(db)[0].status == "pending"

    monkeypatch.setattr(excel_sync_service, "_post_event", lambda url, *, json, headers: FakeResponse(200))
    with get_session_factory()() as db:
        summary = ExcelSyncService(db, _settings()).process_due()
        assert summary["synced"] == 1


def test_disabled_sync_never_calls_webhook_and_keeps_events(client, monkeypatch):
    _seed_outbox(client)

    def fail(url, *, json, headers):  # pragma: no cover - must not run
        raise AssertionError("webhook must not be called when sync is disabled")

    monkeypatch.setattr(excel_sync_service, "_post_event", fail)
    with get_session_factory()() as db:
        summary = ExcelSyncService(db, _settings(excel_sync_enabled=False)).process_due()
        assert summary["skipped"] == 1
        assert _events(db)[0].status == "pending"


def test_dry_run_touches_nothing(client, monkeypatch):
    _seed_outbox(client)
    monkeypatch.setattr(
        excel_sync_service,
        "_post_event",
        lambda url, *, json, headers: (_ for _ in ()).throw(AssertionError("no network in dry run")),
    )
    with get_session_factory()() as db:
        summary = ExcelSyncService(db, _settings()).process_due(dry_run=True)
        assert summary == {"selected": 1, "synced": 0, "retried": 0, "dead": 0, "skipped": 1}
        assert _events(db)[0].status == "pending"


def test_backfill_recreates_missing_outbox_without_duplicates(client):
    from app.cli.lead_excel_sync import main as cli_main

    _seed_outbox(client)
    with get_session_factory()() as db:
        for event in _events(db):
            db.delete(event)
        db.commit()

    # Dry run reports but changes nothing.
    assert cli_main(["backfill", "--from", "2026-01-01"]) == 0
    with get_session_factory()() as db:
        assert _events(db) == []

    # Execute recreates exactly one event; a second run adds nothing.
    assert cli_main(["backfill", "--from", "2026-01-01", "--execute"]) == 0
    with get_session_factory()() as db:
        assert len(_events(db)) == 1
    assert cli_main(["backfill", "--from", "2026-01-01", "--execute"]) == 0
    with get_session_factory()() as db:
        assert len(_events(db)) == 1
        assert _events(db)[0].status == "pending"


@pytest.mark.parametrize("field", ["excel_sync_webhook_url"])
def test_unconfigured_sync_is_reported(client, field):
    settings = _settings(**{field: None})
    with get_session_factory()() as db:
        summary = ExcelSyncService(db, settings).process_due()
        assert summary["synced"] == 0
