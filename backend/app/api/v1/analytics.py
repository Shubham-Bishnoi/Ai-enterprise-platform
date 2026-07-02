from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventOut, AnalyticsSummaryData
from app.schemas.common import APIResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/events", response_model=APIResponse[AnalyticsEventOut])
def capture_event(
    payload: AnalyticsEventCreate,
    request: Request,
    db: Session = Depends(get_db),
) -> APIResponse[AnalyticsEventOut]:
    event = AnalyticsService(db).capture_event(
        payload,
        user_agent=request.headers.get("user-agent"),
        ip_address=None if request.client is None else request.client.host,
    )
    return APIResponse(success=True, data=event, error=None)


@router.get("/summary", response_model=APIResponse[AnalyticsSummaryData])
def get_summary(db: Session = Depends(get_db)) -> APIResponse[AnalyticsSummaryData]:
    data = AnalyticsService(db).summary()
    return APIResponse(success=True, data=data, error=None)
