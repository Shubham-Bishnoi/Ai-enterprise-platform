from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.industry import IndustryPack
from app.models.industry_content import IndustryContent


class IndustryRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_packs(self) -> list[IndustryPack]:
        stmt = select(IndustryPack).where(IndustryPack.status == "active").order_by(IndustryPack.name.asc())
        return list(self.db.scalars(stmt).all())

    def get_pack_by_slug(self, slug: str) -> IndustryPack | None:
        return self.db.scalar(select(IndustryPack).where(IndustryPack.slug == slug))

    def get_content_by_slug(self, slug: str) -> IndustryContent | None:
        return self.db.scalar(select(IndustryContent).where(IndustryContent.slug == slug))

    def get_content_for_pack(self, pack_slug: str) -> IndustryContent | None:
        stmt = select(IndustryContent).where(IndustryContent.pack_slug == pack_slug)
        return self.db.scalar(stmt)

    def upsert_content(self, *, slug: str, defaults: dict) -> IndustryContent:
        existing = self.get_content_by_slug(slug)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        content = IndustryContent(slug=slug, **defaults)
        self.db.add(content)
        self.db.flush()
        self.db.refresh(content)
        return content


class IndustryPackRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_active(self) -> list[IndustryPack]:
        stmt = select(IndustryPack).where(IndustryPack.status == "active").order_by(IndustryPack.name.asc())
        return list(self.db.scalars(stmt).all())

    def get_by_slug(self, slug: str) -> IndustryPack | None:
        return self.db.scalar(select(IndustryPack).where(IndustryPack.slug == slug))
