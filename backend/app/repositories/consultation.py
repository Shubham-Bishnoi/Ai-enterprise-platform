from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.consultation import ConsultationBooking


class ConsultationRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, **kwargs) -> ConsultationBooking:
        booking = ConsultationBooking(**kwargs)
        self.db.add(booking)
        self.db.flush()
        self.db.refresh(booking)
        return booking

    def count(self) -> int:
        return int(self.db.scalar(select(func.count()).select_from(ConsultationBooking)) or 0)
