from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.content import ContentPage, HomeSection


class ContentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_page_by_slug(self, slug: str) -> ContentPage | None:
        return self.db.scalar(select(ContentPage).where(ContentPage.slug == slug))

    def get_section_by_key(self, section_key: str) -> HomeSection | None:
        return self.db.scalar(select(HomeSection).where(HomeSection.section_key == section_key))

    def list_sections(self) -> list[HomeSection]:
        stmt = select(HomeSection).order_by(HomeSection.sort_order.asc(), HomeSection.section_key.asc())
        return list(self.db.scalars(stmt).all())

    def upsert_page(self, *, slug: str, defaults: dict) -> ContentPage:
        existing = self.get_page_by_slug(slug)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        page = ContentPage(slug=slug, **defaults)
        self.db.add(page)
        self.db.flush()
        self.db.refresh(page)
        return page

    def upsert_section(self, *, section_key: str, defaults: dict) -> HomeSection:
        existing = self.get_section_by_key(section_key)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        section = HomeSection(section_key=section_key, **defaults)
        self.db.add(section)
        self.db.flush()
        self.db.refresh(section)
        return section
