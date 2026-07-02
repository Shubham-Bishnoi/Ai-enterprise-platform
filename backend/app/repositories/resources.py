from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resource import Resource


class ResourceRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_published(self) -> list[Resource]:
        stmt = (
            select(Resource)
            .where(Resource.status == "published")
            .order_by(Resource.featured.desc(), Resource.sort_order.asc(), Resource.created_at.desc())
        )
        return list(self.db.scalars(stmt).all())

    def list_featured(self, limit: int = 6) -> list[Resource]:
        stmt = (
            select(Resource)
            .where(Resource.status == "published", Resource.featured.is_(True))
            .order_by(Resource.sort_order.asc(), Resource.created_at.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def get_by_slug(self, slug: str) -> Resource | None:
        return self.db.scalar(select(Resource).where(Resource.slug == slug))

    def list_types(self) -> list[str]:
        stmt = select(Resource.resource_type).where(Resource.status == "published").distinct()
        return [row for row in self.db.scalars(stmt).all() if row]

    def upsert(self, *, slug: str, defaults: dict) -> Resource:
        existing = self.get_by_slug(slug)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        resource = Resource(slug=slug, **defaults)
        self.db.add(resource)
        self.db.flush()
        self.db.refresh(resource)
        return resource
