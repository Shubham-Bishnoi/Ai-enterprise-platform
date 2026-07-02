from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.handoff import HandoffRequestCreate, HandoffRequestCreatedData
from app.services.handoff_service import HandoffService

router = APIRouter(prefix="/handoff", tags=["handoff"])


@router.post("", response_model=APIResponse[HandoffRequestCreatedData])
def create_handoff(payload: HandoffRequestCreate, db: Session = Depends(get_db)) -> APIResponse[HandoffRequestCreatedData]:
    data = HandoffService(db).create_request(payload)
    return APIResponse(success=True, data=data, error=None)
