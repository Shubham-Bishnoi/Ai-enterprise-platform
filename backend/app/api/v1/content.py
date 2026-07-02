from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.content import ContentPageOut, HomeContentData, HomeSectionOut, SiteFooterData, SiteNavigationData
from app.services.content_service import ContentService

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/navigation", response_model=APIResponse[SiteNavigationData])
def get_navigation(db: Session = Depends(get_db)) -> APIResponse[SiteNavigationData]:
    data = ContentService(db).navigation()
    return APIResponse(success=True, data=data, error=None)


@router.get("/footer", response_model=APIResponse[SiteFooterData])
def get_footer(db: Session = Depends(get_db)) -> APIResponse[SiteFooterData]:
    data = ContentService(db).footer()
    return APIResponse(success=True, data=data, error=None)


@router.get("/home", response_model=APIResponse[HomeContentData])
def get_home(db: Session = Depends(get_db)) -> APIResponse[HomeContentData]:
    data = HomeContentData(content=ContentService(db).home())
    return APIResponse(success=True, data=data, error=None)


@router.get("/home/sections", response_model=APIResponse[list[HomeSectionOut]])
def list_home_sections(db: Session = Depends(get_db)) -> APIResponse[list[HomeSectionOut]]:
    data = ContentService(db).list_home_sections()
    return APIResponse(success=True, data=data, error=None)


@router.get("/home/sections/{section_key}", response_model=APIResponse[HomeSectionOut])
def get_home_section(section_key: str, db: Session = Depends(get_db)) -> APIResponse[HomeSectionOut]:
    data = ContentService(db).get_home_section(section_key)
    return APIResponse(success=True, data=data, error=None)


@router.get("/pages/{slug}", response_model=APIResponse[ContentPageOut])
def get_page(slug: str, db: Session = Depends(get_db)) -> APIResponse[ContentPageOut]:
    data = ContentService(db).get_page(slug)
    return APIResponse(success=True, data=data, error=None)
