from datetime import datetime

from sqlalchemy import JSON, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow


class IndustryPack(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "industry_packs"

    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    common_challenges: Mapped[list] = mapped_column(JSON, default=list)
    recommended_use_cases: Mapped[list] = mapped_column(JSON, default=list)
    architecture_hints: Mapped[list] = mapped_column(JSON, default=list)
    governance_priorities: Mapped[list] = mapped_column(JSON, default=list)
    recommended_agents: Mapped[list] = mapped_column(JSON, default=list)
    business_outcomes: Mapped[list] = mapped_column(JSON, default=list)
    roadmap_bias_json: Mapped[dict | None] = mapped_column("roadmap_bias", JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
