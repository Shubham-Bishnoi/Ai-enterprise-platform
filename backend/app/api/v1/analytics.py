from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import ApiException
from app.db.session import get_db
from app.schemas.analytics import AnalyticsEventAck, AnalyticsEventCreate, AnalyticsSummaryData
from app.schemas.common import APIResponse
from app.services.analytics_service import AnalyticsService
from app.services.rate_limit_service import RateLimitService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/events", response_model=APIResponse[AnalyticsEventAck])
def capture_event(
    payload: AnalyticsEventCreate,
    request: Request,
    db: Session = Depends(get_db),
) -> APIResponse[AnalyticsEventAck]:
    settings = get_settings()
    service = AnalyticsService(db)
    ip_address = None if request.client is None else request.client.host

    decision = RateLimitService().check(
        key=f"analytics:{service.rate_limit_key(ip_address)}",
        limit=settings.analytics_rate_limit_per_minute,
        window_seconds=60,
    )
    if not decision.allowed:
        raise ApiException(
            code="rate_limited",
            message="Too many analytics events; slow down.",
            status_code=429,
        )

    ack = service.capture_event(
        payload,
        user_agent=request.headers.get("user-agent"),
        ip_address=ip_address,
    )
    return APIResponse(success=True, data=ack, error=None)


@router.get("/summary", response_model=APIResponse[AnalyticsSummaryData])
def get_summary(db: Session = Depends(get_db)) -> APIResponse[AnalyticsSummaryData]:
    data = AnalyticsService(db).summary()
    return APIResponse(success=True, data=data, error=None)
