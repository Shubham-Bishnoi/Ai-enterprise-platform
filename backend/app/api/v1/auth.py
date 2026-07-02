from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_bearer_token, get_current_user
from app.db.session import get_db
from app.schemas.auth import AuthTokenOut, DemoLoginRequest, LoginRequest, UserOut
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=APIResponse[AuthTokenOut])
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> APIResponse[AuthTokenOut]:
    data = AuthService(db).login(payload.email, payload.password)
    return APIResponse(success=True, data=data, error=None)


@router.post("/demo-login", response_model=APIResponse[AuthTokenOut])
def demo_login(payload: DemoLoginRequest, db: Session = Depends(get_db)) -> APIResponse[AuthTokenOut]:
    data = AuthService(db).demo_login(payload.client_type)
    return APIResponse(success=True, data=data, error=None)


@router.get("/me", response_model=APIResponse[UserOut])
def me(user=Depends(get_current_user)) -> APIResponse[UserOut]:
    data = UserOut.model_validate(user, from_attributes=True)
    return APIResponse(success=True, data=data, error=None)


@router.post("/logout", response_model=APIResponse[dict])
def logout(_: str = Depends(get_bearer_token)) -> APIResponse[dict]:
    return APIResponse(success=True, data={"status": "ok"}, error=None)
