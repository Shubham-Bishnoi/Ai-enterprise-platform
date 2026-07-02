from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, user_id: str) -> User | None:
        return self.db.scalar(select(User).where(User.id == user_id))

    def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(func.lower(User.email) == email.lower())
        return self.db.scalar(stmt)

    def list_demo_users(self) -> list[User]:
        stmt = select(User).where(User.is_demo.is_(True)).order_by(User.client_type.asc(), User.email.asc())
        return list(self.db.scalars(stmt).all())

    def upsert(self, *, email: str, defaults: dict) -> User:
        existing = self.get_by_email(email)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        user = User(email=email, **defaults)
        self.db.add(user)
        self.db.flush()
        self.db.refresh(user)
        return user
