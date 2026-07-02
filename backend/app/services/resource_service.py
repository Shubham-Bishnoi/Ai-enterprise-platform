from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.resources import ResourceRepository
from app.schemas.resources import ResourceOut


class ResourceService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = ResourceRepository(db)

    def list_resources(self) -> list[ResourceOut]:
        return [ResourceOut.model_validate(resource, from_attributes=True) for resource in self.repository.list_published()]

    def list_featured(self) -> list[ResourceOut]:
        return [ResourceOut.model_validate(resource, from_attributes=True) for resource in self.repository.list_featured()]

    def list_types(self) -> list[str]:
        return self.repository.list_types()

    def get_resource(self, slug: str) -> ResourceOut:
        resource = self.repository.get_by_slug(slug)
        if not resource or resource.status != "published":
            raise ApiException(code="not_found", message="Resource not found.", status_code=404)
        return ResourceOut.model_validate(resource, from_attributes=True)
