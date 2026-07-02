from datetime import datetime

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin, utcnow


class BlueprintRequest(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "blueprint_requests"

    lead_id: Mapped[str | None] = mapped_column(ForeignKey("leads.id"), nullable=True)
    chat_session_id: Mapped[str | None] = mapped_column(ForeignKey("chat_sessions.id"), nullable=True)
    industry: Mapped[str] = mapped_column(String(128))
    company_size: Mapped[str] = mapped_column(String(64))
    top_priorities: Mapped[list] = mapped_column(JSON, default=list)
    ai_journey_stage: Mapped[str] = mapped_column(String(64))
    biggest_challenge: Mapped[str] = mapped_column(String(128))
    email: Mapped[str] = mapped_column(String(255))
    data_readiness: Mapped[str | None] = mapped_column(String(64), nullable=True)
    existing_systems: Mapped[list] = mapped_column(JSON, default=list)
    leadership_commitment: Mapped[str | None] = mapped_column(String(64), nullable=True)
    risk_appetite: Mapped[str | None] = mapped_column(String(64), nullable=True)
    source: Mapped[str] = mapped_column(String(128), default="homepage_blueprint")
    raw_payload_json: Mapped[dict] = mapped_column("raw_payload", JSON, default=dict)


class BlueprintResult(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "blueprint_results"

    request_id: Mapped[str] = mapped_column(ForeignKey("blueprint_requests.id"), index=True)
    readiness_score: Mapped[int] = mapped_column(Integer)
    readiness_category: Mapped[str] = mapped_column(String(64))
    readiness_breakdown_json: Mapped[dict] = mapped_column("readiness_breakdown", JSON, default=dict)
    result_json: Mapped[dict] = mapped_column(JSON, default=dict)
    version: Mapped[str] = mapped_column(String(32), default="v1")
    ai_model: Mapped[str | None] = mapped_column(String(128), nullable=True)
    provider: Mapped[str | None] = mapped_column(String(64), nullable=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.8)
    assumptions: Mapped[list] = mapped_column(JSON, default=list)
    warnings: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class BlueprintOptionSet(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "blueprint_option_sets"

    option_group: Mapped[str] = mapped_column(String(128), index=True)
    label: Mapped[str] = mapped_column(String(128))
    value: Mapped[str] = mapped_column(String(128))
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    metadata_json: Mapped[dict | None] = mapped_column("metadata", JSON, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
