from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventOut
from app.schemas.common import APIResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/events", response_model=APIResponse[AnalyticsEventOut])
def capture_event(payload: AnalyticsEventCreate, db: Session = Depends(get_db)) -> APIResponse[AnalyticsEventOut]:
    event = AnalyticsService(db).capture_event(payload)
    return APIResponse(success=True, data=event, error=None)
