from sqlalchemy import JSON, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ContentPage(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "content_pages"

    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    content_json: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(32), default="published", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class HomeSection(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "home_sections"

    section_key: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    content_json: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(32), default="published", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
