from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.platforms import PlatformRepository
from app.schemas.platforms import PlatformOut


class PlatformService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = PlatformRepository(db)

    def list_platforms(self) -> list[PlatformOut]:
        return [PlatformOut.model_validate(platform, from_attributes=True) for platform in self.repository.list_published()]

    def get_platform(self, slug: str) -> PlatformOut:
        platform = self.repository.get_by_slug(slug)
        if not platform or platform.status != "published":
            raise ApiException(code="not_found", message="Platform not found.", status_code=404)
        return PlatformOut.model_validate(platform, from_attributes=True)
