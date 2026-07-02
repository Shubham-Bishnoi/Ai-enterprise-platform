from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import AuthService


def get_bearer_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization:
        raise ApiException(code="unauthorized", message="Missing Authorization header.", status_code=401)
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise ApiException(code="unauthorized", message="Invalid Authorization header.", status_code=401)
    return parts[1].strip()


def get_current_user(token: str = Depends(get_bearer_token), db: Session = Depends(get_db)) -> User:
    return AuthService(db).authenticate_token(token)
