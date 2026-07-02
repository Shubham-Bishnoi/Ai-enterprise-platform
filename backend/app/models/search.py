from sqlalchemy import JSON, Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class SearchIndexEntry(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "search_index_entries"

    title: Mapped[str] = mapped_column(String(255), index=True)
    category: Mapped[str] = mapped_column(String(64), index=True)
    description: Mapped[str] = mapped_column(Text)
    link: Mapped[str] = mapped_column(String(512))
    tags: Mapped[list] = mapped_column(JSON, default=list)
    source_type: Mapped[str] = mapped_column(String(64), default="seeded", index=True)
    relevance_base: Mapped[int] = mapped_column(Integer, default=0)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    status: Mapped[str] = mapped_column(String(32), default="published", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
