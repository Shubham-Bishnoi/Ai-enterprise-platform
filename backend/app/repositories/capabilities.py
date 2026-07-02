from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.capability import Capability


class CapabilityRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_published(self) -> list[Capability]:
        stmt = (
            select(Capability)
            .where(Capability.status == "published")
            .order_by(Capability.sort_order.asc(), Capability.title.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_by_slug(self, slug: str) -> Capability | None:
        return self.db.scalar(select(Capability).where(Capability.slug == slug))

    def upsert(self, *, slug: str, defaults: dict) -> Capability:
        existing = self.get_by_slug(slug)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        cap = Capability(slug=slug, **defaults)
        self.db.add(cap)
        self.db.flush()
        self.db.refresh(cap)
        return cap
