from sqlalchemy import JSON, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Capability(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "capabilities"

    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    tagline: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text)
    ui_color: Mapped[str | None] = mapped_column(String(32), nullable=True)
    ui_icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    items: Mapped[list] = mapped_column(JSON, default=list)
    deliverables: Mapped[list] = mapped_column(JSON, default=list)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(32), default="published", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
