from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class ConsultationBooking(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "consultation_bookings"

    lead_id: Mapped[str | None] = mapped_column(ForeignKey("leads.id"), nullable=True, index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    consultation_type: Mapped[str] = mapped_column(String(64))
    preferred_date: Mapped[str | None] = mapped_column(String(64), nullable=True)
    preferred_time: Mapped[str | None] = mapped_column(String(64), nullable=True)
    timezone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    source: Mapped[str] = mapped_column(String(128), default="unknown")
    status: Mapped[str] = mapped_column(String(64), default="requested")
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
