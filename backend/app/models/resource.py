from sqlalchemy import JSON, Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Resource(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "resources"

    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    resource_type: Mapped[str] = mapped_column(String(64), index=True)
    description: Mapped[str] = mapped_column(Text)
    link: Mapped[str | None] = mapped_column(String(512), nullable=True)
    published_at: Mapped[str | None] = mapped_column(String(32), nullable=True)
    read_time: Mapped[str | None] = mapped_column(String(32), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(32), default="published", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
