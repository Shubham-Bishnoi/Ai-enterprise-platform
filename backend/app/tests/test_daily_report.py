"""Daily report: IST day boundary, zero activity, idempotency, retry, auth."""

import uuid
from datetime import date, datetime, timezone

import pytest

from app.core.config import get_settings


class FakeProvider:
    def __init__(self, *, fail_times: int = 0, retryable: bool = True):
        self.sent: list[dict] = []
        self.fail_times = fail_times
        self.retryable = retryable

    def send_email(self, *, from_email, to_emails, subject, html, text=None):
        from app.services.notification_providers import EmailDeliveryError

        if self.fail_times > 0:
            self.fail_times -= 1
            raise EmailDeliveryError("simulated failure", retryable=self.retryable)
        self.sent.append(
            {"from": from_email, "to": to_emails, "subject": subject, "html": html, "text": text}
        )
        return f"msg_{len(self.sent)}"


@pytest.fixture
def report_env(client, monkeypatch):
    """Configured reporting settings + a fake provider, on top of the app DB."""
    settings = get_settings()
    settings.report_recipients = "one@example.test,two@example.test"
    settings.report_test_recipient = "qa@example.test"
    settings.daily_report_secret = "test-report-secret"

    provider = FakeProvider()
    monkeypatch.setattr(
        "app.services.daily_report_service.build_email_provider", lambda _settings: provider
    )
    yield client, settings, provider
    settings.report_recipients = ""
    settings.report_test_recipient = None
    settings.daily_report_secret = None


def _db():
    from app.db.session import get_session_factory

    return get_session_factory()()


def _add_event(db, name: str, created_at: datetime, **kwargs) -> None:
    from app.models.analytics import AnalyticsEvent

    db.add(
        AnalyticsEvent(
            event_id=str(uuid.uuid4()),
            event_name=name,
            source="test",
            created_at=created_at,
            payload=kwargs.pop("payload", {}),
            **kwargs,
        )
    )


def test_ist_day_boundary_is_respected(report_env):
    _client, _settings, _provider = report_env
    with _db() as db:
        # 18:35 UTC on Aug 29 is already 00:05 IST on Aug 30.
        _add_event(db, "page_viewed", datetime(2026, 8, 29, 18, 35, tzinfo=timezone.utc), page_path="/late")
        # 18:20 UTC on Aug 29 is 23:50 IST on Aug 29.
        _add_event(db, "page_viewed", datetime(2026, 8, 29, 18, 20, tzinfo=timezone.utc), page_path="/early")
        db.commit()

        from app.services.report_metrics import compute_report_metrics

        aug29 = compute_report_metrics(db, date(2026, 8, 29), "Asia/Kolkata")
        aug30 = compute_report_metrics(db, date(2026, 8, 30), "Asia/Kolkata")

    assert aug29["summary"]["page_views"] == 1
    assert aug29["top"]["pages"][0]["label"] == "/early"
    assert aug30["summary"]["page_views"] == 1
    assert aug30["top"]["pages"][0]["label"] == "/late"


def test_zero_activity_report_is_sent_with_explicit_sentence(report_env):
    _client, settings, provider = report_env
    from app.services.daily_report_service import DailyReportService
    from app.services.report_email import ZERO_ACTIVITY_SENTENCE

    with _db() as db:
        run = DailyReportService(db, settings).run_for_date(date(2026, 1, 5))

    assert run.status == "sent"
    assert len(provider.sent) == 1
    message = provider.sent[0]
    assert ZERO_ACTIVITY_SENTENCE in message["html"]
    assert ZERO_ACTIVITY_SENTENCE in message["text"]
    assert message["to"] == ["one@example.test", "two@example.test"]
    assert "GFF AI Daily Website Report — 05 Jan 2026" == message["subject"]


def test_funnel_percentages_survive_zero_sessions(report_env):
    _client, _settings, _provider = report_env
    from app.services.report_metrics import compute_report_metrics

    with _db() as db:
        metrics = compute_report_metrics(db, date(2026, 1, 5), "Asia/Kolkata")

    for stage in metrics["funnel"]:
        assert stage["pct_of_sessions"] == 0.0


def test_duplicate_daily_report_is_prevented(report_env):
    _client, settings, provider = report_env
    from app.services.daily_report_service import DailyReportService

    with _db() as db:
        service = DailyReportService(db, settings)
        first = service.run_for_date(date(2026, 1, 6))
        second = service.run_for_date(date(2026, 1, 6))

    assert first.status == "sent"
    assert second.id == first.id
    assert len(provider.sent) == 1  # no second email


def test_temporary_email_failure_retries_then_sends(report_env):
    _client, settings, provider = report_env
    provider.fail_times = 1
    from app.services.daily_report_service import DailyReportService

    with _db() as db:
        service = DailyReportService(db, settings)
        failed = service.run_for_date(date(2026, 1, 7))
        assert failed.status == "failed"
        assert failed.error_message == "simulated failure"
        assert failed.next_attempt_at is not None

        retried = service.run_for_date(date(2026, 1, 7))

    assert retried.status == "sent"
    assert retried.attempt_count == 2
    assert len(provider.sent) == 1


def test_exhausted_attempts_park_report_as_dead(report_env):
    _client, settings, provider = report_env
    provider.fail_times = 99
    settings.report_max_attempts = 2
    from app.services.daily_report_service import DailyReportService

    with _db() as db:
        service = DailyReportService(db, settings)
        service.run_for_date(date(2026, 1, 8))
        run = service.run_for_date(date(2026, 1, 8))
        dead_again = service.run_for_date(date(2026, 1, 8))

    settings.report_max_attempts = 5
    assert run.status == "dead"
    assert dead_again.attempt_count == run.attempt_count  # dead runs are not retried
    assert provider.sent == []


def test_lead_details_and_subject_with_leads(report_env):
    _client, settings, provider = report_env
    from app.models.lead import Lead
    from app.services.daily_report_service import DailyReportService
    from app.services.lead_capture_service import LeadCaptureService

    with _db() as db:
        lead = Lead(email="Jane@Example.com", name="Jane Doe", company="Acme", source="contact_page")
        db.add(lead)
        db.flush()
        LeadCaptureService(db).record_submission(
            lead=lead,
            source_type="contact",
            metadata={"source_page": "/contact", "utm_source": "linkedin"},
            objective_summary="Wants an AI roadmap workshop.",
            submitted_at=datetime(2026, 1, 9, 6, 30, tzinfo=timezone.utc),  # 12:00 IST
        )
        db.commit()

        run = DailyReportService(db, settings).run_for_date(date(2026, 1, 9))

    assert run.status == "sent"
    message = provider.sent[0]
    assert "1 New Lead" in message["subject"]
    assert "jane@example.com" in message["html"]
    assert "Jane Doe" in message["html"]
    assert "Wants an AI roadmap workshop." in message["text"]
    assert run.totals["identified_leads"] == 1


def test_reports_api_requires_secret(report_env):
    client, _settings, _provider = report_env

    no_secret = client.post("/api/v1/reports/daily/trigger", json={})
    wrong = client.post(
        "/api/v1/reports/daily/trigger", json={}, headers={"X-Report-Secret": "nope"}
    )
    status_no_secret = client.get("/api/v1/reports/daily/status")

    assert no_secret.status_code == 401
    assert wrong.status_code == 401
    assert status_no_secret.status_code == 401


def test_reports_api_trigger_and_status_with_secret(report_env):
    client, _settings, _provider = report_env
    headers = {"X-Report-Secret": "test-report-secret"}

    triggered = client.post(
        "/api/v1/reports/daily/trigger", json={"report_date": "2026-01-10"}, headers=headers
    )
    status = client.get("/api/v1/reports/daily/status", headers=headers)

    assert triggered.status_code == 200
    assert triggered.json()["data"]["status"] == "sent"
    assert status.status_code == 200
    assert any(run["report_date"] == "2026-01-10" for run in status.json()["data"])


def test_reports_api_test_recipient_must_match_configuration(report_env):
    client, _settings, provider = report_env
    headers = {"X-Report-Secret": "test-report-secret"}

    rejected = client.post(
        "/api/v1/reports/daily/trigger",
        json={"report_date": "2026-01-11", "test_recipient": "attacker@evil.test"},
        headers=headers,
    )
    accepted = client.post(
        "/api/v1/reports/daily/trigger",
        json={"report_date": "2026-01-11", "test_recipient": "qa@example.test"},
        headers=headers,
    )

    assert rejected.status_code == 422
    assert accepted.status_code == 200
    assert provider.sent[-1]["to"] == ["qa@example.test"]
