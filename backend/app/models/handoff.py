from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow


class HandoffRequest(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "handoff_requests"

    lead_id: Mapped[str | None] = mapped_column(ForeignKey("leads.id"), nullable=True, index=True)
    chat_session_id: Mapped[str | None] = mapped_column(ForeignKey("chat_sessions.id"), nullable=True, index=True)
    blueprint_result_id: Mapped[str | None] = mapped_column(
        ForeignKey("blueprint_results.id"),
        nullable=True,
        index=True,
    )
    handoff_type: Mapped[str] = mapped_column(String(64))
    source: Mapped[str] = mapped_column(String(128), default="unknown")
    recommended_specialist: Mapped[str | None] = mapped_column(String(255), nullable=True)
    summary: Mapped[str] = mapped_column(Text)
    context_json: Mapped[dict] = mapped_column("context", JSON, default=dict)
    status: Mapped[str] = mapped_column(String(64), default="requested")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
