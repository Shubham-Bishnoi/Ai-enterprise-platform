from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.dashboard import DashboardActivityResponse, DashboardMetricOut
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=APIResponse[list[DashboardMetricOut]])
def metrics(db: Session = Depends(get_db)) -> APIResponse[list[DashboardMetricOut]]:
    data = DashboardService(db).metrics()
    return APIResponse(success=True, data=data, error=None)


@router.get("/activity", response_model=APIResponse[DashboardActivityResponse])
def activity(db: Session = Depends(get_db)) -> APIResponse[DashboardActivityResponse]:
    data = DashboardService(db).activity()
    return APIResponse(success=True, data=data, error=None)
