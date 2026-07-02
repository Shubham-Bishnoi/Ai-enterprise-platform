from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow


class ContactRequest(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "contact_requests"

    lead_id: Mapped[str | None] = mapped_column(ForeignKey("leads.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    intent: Mapped[str] = mapped_column(String(64), default="general")
    message: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(128), default="unknown")
    status: Mapped[str] = mapped_column(String(64), default="new")
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
