from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.resources import ResourceOut
from app.services.resource_service import ResourceService

router = APIRouter(prefix="/resources", tags=["resources"])


@router.get("", response_model=APIResponse[list[ResourceOut]])
def list_resources(db: Session = Depends(get_db)) -> APIResponse[list[ResourceOut]]:
    data = ResourceService(db).list_resources()
    return APIResponse(success=True, data=data, error=None)


@router.get("/featured", response_model=APIResponse[list[ResourceOut]])
def list_featured(db: Session = Depends(get_db)) -> APIResponse[list[ResourceOut]]:
    data = ResourceService(db).list_featured()
    return APIResponse(success=True, data=data, error=None)


@router.get("/types", response_model=APIResponse[list[str]])
def list_types(db: Session = Depends(get_db)) -> APIResponse[list[str]]:
    data = ResourceService(db).list_types()
    return APIResponse(success=True, data=data, error=None)


@router.get("/{slug}", response_model=APIResponse[ResourceOut])
def get_resource(slug: str, db: Session = Depends(get_db)) -> APIResponse[ResourceOut]:
    data = ResourceService(db).get_resource(slug)
    return APIResponse(success=True, data=data, error=None)
