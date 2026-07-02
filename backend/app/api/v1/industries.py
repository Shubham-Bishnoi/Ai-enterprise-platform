from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.industries import IndustryOut
from app.services.industry_service import IndustryService

router = APIRouter(prefix="/industries", tags=["industries"])


@router.get("", response_model=APIResponse[list[IndustryOut]])
def list_industries(db: Session = Depends(get_db)) -> APIResponse[list[IndustryOut]]:
    data = IndustryService(db).list_industries()
    return APIResponse(success=True, data=data, error=None)


@router.get("/{slug}", response_model=APIResponse[IndustryOut])
def get_industry(slug: str, db: Session = Depends(get_db)) -> APIResponse[IndustryOut]:
    data = IndustryService(db).get_industry(slug)
    return APIResponse(success=True, data=data, error=None)


@router.get("/{slug}/use-cases", response_model=APIResponse[list])
def get_use_cases(slug: str, db: Session = Depends(get_db)) -> APIResponse[list]:
    data = IndustryService(db).industry_use_cases(slug)
    return APIResponse(success=True, data=data, error=None)


@router.get("/{slug}/agents", response_model=APIResponse[list])
def get_agents(slug: str, db: Session = Depends(get_db)) -> APIResponse[list]:
    data = IndustryService(db).industry_agents(slug)
    return APIResponse(success=True, data=data, error=None)


@router.get("/{slug}/reference-architecture", response_model=APIResponse[dict])
def get_reference_architecture(slug: str, db: Session = Depends(get_db)) -> APIResponse[dict]:
    data = IndustryService(db).industry_reference_architecture(slug)
    return APIResponse(success=True, data=data, error=None)
