from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin, utcnow


class AnalyticsEvent(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "analytics_events"

    # Client-generated idempotency key: a duplicate delivery (retry, beacon
    # replay, React strict-mode double effect) never creates a second row.
    event_id: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True, index=True)

    # `session_id` predates visitor tracking and points at the *chat* session.
    session_id: Mapped[str | None] = mapped_column(ForeignKey("chat_sessions.id"), nullable=True, index=True)
    # First-party visitor identifiers (anonymous, browser-generated UUIDs).
    anonymous_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    visitor_session_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)

    lead_id: Mapped[str | None] = mapped_column(ForeignKey("leads.id"), nullable=True, index=True)
    event_name: Mapped[str] = mapped_column(String(128), index=True)
    source: Mapped[str] = mapped_column(String(128))
    page_path: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    component: Mapped[str | None] = mapped_column(String(128), nullable=True)

    # Optional reference to an operational record (blueprint_request, contact
    # request, …) so analytics rows point at the authoritative table instead of
    # duplicating its content.
    entity_type: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    entity_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)

    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    ip_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    # Client-reported time (clamped server-side); created_at is the server time.
    occurred_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class AnalyticsSession(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """One privacy-safe anonymous visitor session.

    `anonymous_id` persists across visits in the browser; `session_key` rotates
    after the configured inactivity window, so returning visitors are countable
    without any personal identification. No IPs, no fingerprints.
    """

    __tablename__ = "analytics_sessions"

    session_key: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    anonymous_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    authenticated_user_id: Mapped[str | None] = mapped_column(String(64), nullable=True)

    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)

    landing_page: Mapped[str | None] = mapped_column(String(512), nullable=True)
    referrer: Mapped[str | None] = mapped_column(String(512), nullable=True)
    utm_source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(255), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(255), nullable=True)
    utm_term: Mapped[str | None] = mapped_column(String(255), nullable=True)
    utm_content: Mapped[str | None] = mapped_column(String(255), nullable=True)

    device_category: Mapped[str | None] = mapped_column(String(32), nullable=True)
    browser_category: Mapped[str | None] = mapped_column(String(32), nullable=True)
    # Only ever populated from data already legally available (e.g. a CDN
    # country header) — never from IP lookups done by us.
    country_code: Mapped[str | None] = mapped_column(String(8), nullable=True)

    consent_status: Mapped[str] = mapped_column(String(64), default="essential_analytics")
    page_view_count: Mapped[int] = mapped_column(Integer, default=0)
