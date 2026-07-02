from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.platforms import PlatformOut
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platforms", tags=["platforms"])


@router.get("", response_model=APIResponse[list[PlatformOut]])
def list_platforms(db: Session = Depends(get_db)) -> APIResponse[list[PlatformOut]]:
    data = PlatformService(db).list_platforms()
    return APIResponse(success=True, data=data, error=None)


@router.get("/{slug}", response_model=APIResponse[PlatformOut])
def get_platform(slug: str, db: Session = Depends(get_db)) -> APIResponse[PlatformOut]:
    data = PlatformService(db).get_platform(slug)
    return APIResponse(success=True, data=data, error=None)
