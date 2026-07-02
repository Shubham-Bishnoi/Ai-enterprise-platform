from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.consultation import (
    ConsultationBookingCreate,
    ConsultationBookingCreatedData,
    ConsultationSlotsData,
)
from app.services.consultation_service import ConsultationService

router = APIRouter(prefix="/consultation", tags=["consultation"])


@router.post("/book", response_model=APIResponse[ConsultationBookingCreatedData])
def book_consultation(
    payload: ConsultationBookingCreate,
    db: Session = Depends(get_db),
) -> APIResponse[ConsultationBookingCreatedData]:
    data = ConsultationService(db).book(payload)
    return APIResponse(success=True, data=data, error=None)


@router.get("/slots", response_model=APIResponse[ConsultationSlotsData])
def get_slots(db: Session = Depends(get_db)) -> APIResponse[ConsultationSlotsData]:
    data = ConsultationService(db).list_placeholder_slots()
    return APIResponse(success=True, data=data, error=None)
