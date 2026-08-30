"""Ingestion hardening: idempotency, sessions, allowlist, limits, bot filtering."""

import uuid

from app.core.config import get_settings


def _event(name: str = "page_viewed", **overrides) -> dict:
    body = {
        "event_id": str(uuid.uuid4()),
        "event_name": name,
        "source": "website",
        "page_path": "/",
        "anonymous_id": "anon-1",
        "visitor_session_id": "sess-1",
        "payload": {},
    }
    body.update(overrides)
    return body


def test_duplicate_event_id_is_stored_once(client):
    event = _event("page_viewed")

    first = client.post("/api/v1/analytics/events", json=event)
    second = client.post("/api/v1/analytics/events", json=event)

    assert first.status_code == 200
    assert first.json()["data"]["duplicate"] is False
    assert second.status_code == 200
    assert second.json()["data"]["duplicate"] is True
    assert second.json()["data"]["id"] == first.json()["data"]["id"]


def test_anonymous_session_is_created_and_updated(client):
    context = {
        "landing_page": "/pricing",
        "referrer": "https://www.linkedin.com/feed",
        "utm_source": "linkedin",
        "utm_campaign": "q3-launch",
        "device_category": "mobile",
    }
    client.post(
        "/api/v1/analytics/events",
        json=_event("session_started", visitor_session_id="sess-a", session_context=context),
    )
    client.post("/api/v1/analytics/events", json=_event("page_viewed", visitor_session_id="sess-a"))
    client.post("/api/v1/analytics/events", json=_event("page_viewed", visitor_session_id="sess-a"))

    from app.db.session import get_session_factory
    from app.models.analytics import AnalyticsSession
    from sqlalchemy import select

    with get_session_factory()() as db:
        sessions = list(db.scalars(select(AnalyticsSession)))
        assert len(sessions) == 1
        session = sessions[0]
        assert session.session_key == "sess-a"
        assert session.anonymous_id == "anon-1"
        assert session.landing_page == "/pricing"
        assert session.utm_source == "linkedin"
        assert session.device_category == "mobile"
        assert session.page_view_count == 2


def test_oversized_payload_is_rejected(client):
    response = client.post(
        "/api/v1/analytics/events",
        json=_event(payload={"blob": "x" * 10_000}),
    )

    assert response.status_code == 413
    assert response.json()["error"]["code"] == "payload_too_large"


def test_bot_user_agent_is_not_stored(client):
    response = client.post(
        "/api/v1/analytics/events",
        json=_event(),
        headers={"user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)"},
    )

    assert response.status_code == 200
    assert response.json()["data"]["stored"] is False

    from app.db.session import get_session_factory
    from app.models.analytics import AnalyticsEvent
    from sqlalchemy import select

    with get_session_factory()() as db:
        assert list(db.scalars(select(AnalyticsEvent))) == []


def test_raw_ip_is_never_stored(client):
    client.post("/api/v1/analytics/events", json=_event())

    from app.db.session import get_session_factory
    from app.models.analytics import AnalyticsEvent
    from sqlalchemy import select

    with get_session_factory()() as db:
        event = db.scalars(select(AnalyticsEvent)).one()
        assert event.ip_hash is not None
        assert "testclient" not in event.ip_hash  # salted hash, not the address


def test_rate_limit_returns_429(client):
    settings = get_settings()
    original = settings.analytics_rate_limit_per_minute
    settings.analytics_rate_limit_per_minute = 3
    try:
        statuses = [
            client.post("/api/v1/analytics/events", json=_event()).status_code for _ in range(5)
        ]
    finally:
        settings.analytics_rate_limit_per_minute = original

    assert statuses[:3] == [200, 200, 200]
    assert 429 in statuses[3:]
    body = client.get("/api/v1/analytics/summary")
    assert body.status_code == 200  # limit applies to ingestion only


def test_page_view_dedupe_via_shared_event_id(client):
    """Strict-mode double effects reuse one event_id -> one stored row."""
    event = _event("page_viewed", event_id=str(uuid.uuid4()))
    client.post("/api/v1/analytics/events", json=event)
    client.post("/api/v1/analytics/events", json=event)

    from app.db.session import get_session_factory
    from app.models.analytics import AnalyticsEvent
    from sqlalchemy import select

    with get_session_factory()() as db:
        assert len(list(db.scalars(select(AnalyticsEvent)))) == 1
