from sqlalchemy import JSON, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class IndustryContent(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "industry_content"

    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    pack_slug: Mapped[str | None] = mapped_column(String(160), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    ui_color: Mapped[str | None] = mapped_column(String(32), nullable=True)
    ui_icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    challenges: Mapped[list] = mapped_column(JSON, default=list)
    outcomes: Mapped[list] = mapped_column(JSON, default=list)
    content_json: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(32), default="published", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
