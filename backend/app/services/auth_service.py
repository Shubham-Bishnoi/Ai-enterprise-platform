from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.core.security import create_access_token, verify_access_token, verify_password
from app.models.user import User
from app.repositories.users import UserRepository
from app.schemas.auth import AuthTokenOut, UserOut


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.users = UserRepository(db)

    def login(self, email: str, password: str) -> AuthTokenOut:
        user = self.users.get_by_email(email)
        if not user or user.status != "active":
            raise ApiException(code="unauthorized", message="Invalid credentials.", status_code=401)
        if not user.password_salt or not user.password_hash:
            raise ApiException(code="unauthorized", message="Password login is not enabled for this user.", status_code=401)
        if not verify_password(password, user.password_salt, user.password_hash):
            raise ApiException(code="unauthorized", message="Invalid credentials.", status_code=401)
        return self._issue_token(user)

    def demo_login(self, client_type: str) -> AuthTokenOut:
        normalized = (client_type or "enterprise").strip().lower()
        candidates = [u for u in self.users.list_demo_users() if u.client_type == normalized]
        user = candidates[0] if candidates else None
        if not user:
            user = self.users.list_demo_users()[0] if self.users.list_demo_users() else None
        if not user:
            raise ApiException(code="not_ready", message="Demo users are not seeded yet.", status_code=503)
        return self._issue_token(user, override_client_type=normalized)

    def me(self, token: str) -> UserOut:
        user = self.authenticate_token(token)
        return UserOut.model_validate(user, from_attributes=True)

    def authenticate_token(self, token: str) -> User:
        verified = verify_access_token(token)
        if not verified:
            raise ApiException(code="unauthorized", message="Invalid access token.", status_code=401)
        user_id = verified.payload.get("sub")
        if not user_id:
            raise ApiException(code="unauthorized", message="Invalid access token.", status_code=401)
        user = self.users.get_by_id(str(user_id))
        if not user or user.status != "active":
            raise ApiException(code="unauthorized", message="User not found.", status_code=401)
        return user

    def _issue_token(self, user: User, *, override_client_type: str | None = None) -> AuthTokenOut:
        payload = {
            "sub": user.id,
            "email": user.email,
            "client_type": override_client_type or user.client_type,
            "demo": bool(user.is_demo),
        }
        token, expires = create_access_token(payload, expires_in_seconds=60 * 60 * 8)
        return AuthTokenOut(
            access_token=token,
            expires_in=expires,
            user=UserOut.model_validate(user, from_attributes=True),
        )
