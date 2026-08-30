from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow

# running -> sent | failed (retryable) -> dead (attempts exhausted)
REPORT_STATUS_RUNNING = "running"
REPORT_STATUS_SENT = "sent"
REPORT_STATUS_FAILED = "failed"
REPORT_STATUS_DEAD = "dead"


class DailyReportRun(Base, UUIDPrimaryKeyMixin):
    """One row per attempted daily activity report.

    The unique (report_date, timezone) constraint is what makes duplicate
    daily emails impossible: a second run for the same day updates this row
    instead of creating a parallel one, and a `sent` row is never re-sent.
    """

    __tablename__ = "daily_report_runs"
    __table_args__ = (UniqueConstraint("report_date", "timezone", name="uq_daily_report_date_tz"),)

    report_date: Mapped[date] = mapped_column(Date, index=True)
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata")
    status: Mapped[str] = mapped_column(String(16), default=REPORT_STATUS_RUNNING, index=True)

    recipients: Mapped[dict] = mapped_column(JSON, default=dict)
    totals: Mapped[dict] = mapped_column(JSON, default=dict)

    provider_message_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    attempt_count: Mapped[int] = mapped_column(Integer, default=0)
    next_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
