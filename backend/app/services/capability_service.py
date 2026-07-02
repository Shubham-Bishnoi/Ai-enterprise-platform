from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.capabilities import CapabilityRepository
from app.schemas.capabilities import CapabilityOut


class CapabilityService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = CapabilityRepository(db)

    def list_capabilities(self) -> list[CapabilityOut]:
        return [
            CapabilityOut.model_validate(capability, from_attributes=True)
            for capability in self.repository.list_published()
        ]

    def get_capability(self, slug: str) -> CapabilityOut:
        capability = self.repository.get_by_slug(slug)
        if not capability or capability.status != "published":
            raise ApiException(code="not_found", message="Capability not found.", status_code=404)
        return CapabilityOut.model_validate(capability, from_attributes=True)
