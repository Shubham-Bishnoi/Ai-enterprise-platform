from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.platform import Platform


class PlatformRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_published(self) -> list[Platform]:
        stmt = (
            select(Platform)
            .where(Platform.status == "published")
            .order_by(Platform.sort_order.asc(), Platform.name.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_by_slug(self, slug: str) -> Platform | None:
        return self.db.scalar(select(Platform).where(Platform.slug == slug))

    def upsert(self, *, slug: str, defaults: dict) -> Platform:
        existing = self.get_by_slug(slug)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        platform = Platform(slug=slug, **defaults)
        self.db.add(platform)
        self.db.flush()
        self.db.refresh(platform)
        return platform
