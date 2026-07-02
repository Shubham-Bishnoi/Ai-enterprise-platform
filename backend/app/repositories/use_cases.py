from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.use_case import UseCase


class UseCaseRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_active(self, industry_slug: str | None = None) -> list[UseCase]:
        filters = [UseCase.status == "active"]
        if industry_slug:
            filters.append(or_(UseCase.industry_slug == industry_slug, UseCase.industry_slug.is_(None)))
        stmt = select(UseCase).where(*filters).order_by(UseCase.title.asc())
        return list(self.db.scalars(stmt).all())
