from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.leads import LeadCreatedData, LeadOut, LeadUpsertRequest
from app.services.lead_service import LeadService

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=APIResponse[LeadCreatedData])
def upsert_lead(payload: LeadUpsertRequest, db: Session = Depends(get_db)) -> APIResponse[LeadCreatedData]:
    data = LeadService(db).create_or_update(payload)
    return APIResponse(success=True, data=data, error=None)


@router.get("/{lead_id}", response_model=APIResponse[LeadOut])
def get_lead(lead_id: str, db: Session = Depends(get_db)) -> APIResponse[LeadOut]:
    data = LeadService(db).get_lead(lead_id)
    return APIResponse(success=True, data=data, error=None)
