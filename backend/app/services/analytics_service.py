from sqlalchemy.orm import Session

from app.repositories.analytics import AnalyticsRepository
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventOut


class AnalyticsService:
    def __init__(self, db: Session) -> None:
        self.repository = AnalyticsRepository(db)
        self.db = db

    def capture_event(self, payload: AnalyticsEventCreate) -> AnalyticsEventOut:
        event = self.repository.create(
            session_id=payload.session_id,
            event_name=payload.event_name,
            source=payload.source,
            payload=payload.payload,
        )
        self.db.commit()
        return AnalyticsEventOut.model_validate(event, from_attributes=True)
