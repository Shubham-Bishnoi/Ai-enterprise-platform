from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.lead import Lead


class LeadRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, lead_id: str) -> Lead | None:
        stmt = select(Lead).where(Lead.id == lead_id)
        return self.db.scalar(stmt)

    def get_by_email(self, email: str) -> Lead | None:
        stmt = select(Lead).where(func.lower(Lead.email) == email.lower())
        return self.db.scalar(stmt)

    def create(self, **kwargs) -> Lead:
        lead = Lead(**kwargs)
        self.db.add(lead)
        self.db.flush()
        self.db.refresh(lead)
        return lead

    def save(self, lead: Lead) -> Lead:
        self.db.add(lead)
        self.db.flush()
        self.db.refresh(lead)
        return lead

    def count(self) -> int:
        return int(self.db.scalar(select(func.count()).select_from(Lead)) or 0)

    @staticmethod
    def merge_metadata(current: dict | None, incoming: dict | None) -> dict:
        merged = dict(current or {})
        merged.update(incoming or {})
        return merged

    @staticmethod
    def touch_last_seen(lead: Lead, seen_at: datetime) -> None:
        lead.last_seen_at = seen_at
