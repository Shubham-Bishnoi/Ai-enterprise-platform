from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contact import ContactRequest


class ContactRequestRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, **kwargs) -> ContactRequest:
        request = ContactRequest(**kwargs)
        self.db.add(request)
        self.db.flush()
        self.db.refresh(request)
        return request

    def count(self) -> int:
        return int(self.db.scalar(select(func.count()).select_from(ContactRequest)) or 0)
