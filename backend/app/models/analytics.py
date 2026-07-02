from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow


class AnalyticsEvent(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "analytics_events"

    session_id: Mapped[str | None] = mapped_column(ForeignKey("chat_sessions.id"), nullable=True, index=True)
    lead_id: Mapped[str | None] = mapped_column(ForeignKey("leads.id"), nullable=True, index=True)
    event_name: Mapped[str] = mapped_column(String(128), index=True)
    source: Mapped[str] = mapped_column(String(128))
    page_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    component: Mapped[str | None] = mapped_column(String(128), nullable=True)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    ip_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
