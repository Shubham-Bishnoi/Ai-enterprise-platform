from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.capabilities import CapabilityOut
from app.schemas.common import APIResponse
from app.services.capability_service import CapabilityService

router = APIRouter(prefix="/capabilities", tags=["capabilities"])


@router.get("", response_model=APIResponse[list[CapabilityOut]])
def list_capabilities(db: Session = Depends(get_db)) -> APIResponse[list[CapabilityOut]]:
    data = CapabilityService(db).list_capabilities()
    return APIResponse(success=True, data=data, error=None)


@router.get("/{slug}", response_model=APIResponse[CapabilityOut])
def get_capability(slug: str, db: Session = Depends(get_db)) -> APIResponse[CapabilityOut]:
    data = CapabilityService(db).get_capability(slug)
    return APIResponse(success=True, data=data, error=None)
