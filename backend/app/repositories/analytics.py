from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analytics import AnalyticsEvent


class AnalyticsRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        *,
        event_name: str,
        source: str,
        payload: dict,
        session_id: str | None = None,
    ) -> AnalyticsEvent:
        event = AnalyticsEvent(
            session_id=session_id,
            event_name=event_name,
            source=source,
            payload=payload,
        )
        self.db.add(event)
        self.db.flush()
        self.db.refresh(event)
        return event

    def list_events(self) -> list[AnalyticsEvent]:
        stmt = select(AnalyticsEvent).order_by(AnalyticsEvent.created_at.asc())
        return list(self.db.scalars(stmt).all())
