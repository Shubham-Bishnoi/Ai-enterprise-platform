from datetime import datetime

from sqlalchemy import JSON, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow


class UseCase(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "use_cases"

    slug: Mapped[str] = mapped_column(String(128), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    industry_slug: Mapped[str | None] = mapped_column(String(128), nullable=True)
    capability_slug: Mapped[str | None] = mapped_column(String(128), nullable=True)
    impact_level: Mapped[str] = mapped_column(String(32), default="Medium")
    complexity: Mapped[str] = mapped_column(String(32), default="Medium")
    time_to_value: Mapped[str] = mapped_column(String(64), default="60-90 days")
    recommended_agent: Mapped[str | None] = mapped_column(String(128), nullable=True)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(32), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
