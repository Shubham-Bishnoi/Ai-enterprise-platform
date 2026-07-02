from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.contact import ContactRequestCreate, ContactRequestCreatedData
from app.services.contact_service import ContactService

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=APIResponse[ContactRequestCreatedData])
def submit_contact(payload: ContactRequestCreate, db: Session = Depends(get_db)) -> APIResponse[ContactRequestCreatedData]:
    data = ContactService(db).submit(payload)
    return APIResponse(success=True, data=data, error=None)
