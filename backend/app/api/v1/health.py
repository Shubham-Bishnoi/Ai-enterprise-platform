from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import get_settings
from app.schemas.common import APIResponse

router = APIRouter(tags=["health"])


class HealthData(BaseModel):
    status: str
    service: str
    environment: str
    mock_ai_mode: bool


@router.get("/health", response_model=APIResponse[HealthData])
def health_check() -> APIResponse[HealthData]:
    settings = get_settings()
    return APIResponse(
        success=True,
        data=HealthData(
            status="ok",
            service=settings.app_name,
            environment=settings.environment,
            mock_ai_mode=settings.enable_ai_mock_mode,
        ),
        error=None,
        meta={"path": "/api/v1/health"},
    )
