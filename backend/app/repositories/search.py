from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.search import SearchIndexEntry


class SearchRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_featured(self, limit: int = 12) -> list[SearchIndexEntry]:
        stmt = (
            select(SearchIndexEntry)
            .where(SearchIndexEntry.status == "published", SearchIndexEntry.featured.is_(True))
            .order_by(SearchIndexEntry.sort_order.asc(), SearchIndexEntry.relevance_base.desc(), SearchIndexEntry.title.asc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def list_all(self, limit: int = 500) -> list[SearchIndexEntry]:
        stmt = (
            select(SearchIndexEntry)
            .where(SearchIndexEntry.status == "published")
            .order_by(SearchIndexEntry.sort_order.asc(), SearchIndexEntry.title.asc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def upsert(self, *, title: str, category: str, link: str, defaults: dict) -> SearchIndexEntry:
        stmt = select(SearchIndexEntry).where(
            SearchIndexEntry.title == title, SearchIndexEntry.category == category, SearchIndexEntry.link == link
        )
        existing = self.db.scalar(stmt)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        entry = SearchIndexEntry(title=title, category=category, link=link, **defaults)
        self.db.add(entry)
        self.db.flush()
        self.db.refresh(entry)
        return entry
