from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.industry import IndustryPack


class IndustryPackRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_active(self) -> list[IndustryPack]:
        stmt = (
            select(IndustryPack)
            .where(IndustryPack.status == "active")
            .order_by(IndustryPack.name.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_by_slug(self, slug: str) -> IndustryPack | None:
        stmt = select(IndustryPack).where(IndustryPack.slug == slug)
        return self.db.scalar(stmt)
