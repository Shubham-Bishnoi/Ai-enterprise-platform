from sqlalchemy import func, select
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
        lead_id: str | None = None,
        page_path: str | None = None,
        component: str | None = None,
        user_agent: str | None = None,
        ip_hash: str | None = None,
    ) -> AnalyticsEvent:
        event = AnalyticsEvent(
            session_id=session_id,
            lead_id=lead_id,
            event_name=event_name,
            source=source,
            page_path=page_path,
            component=component,
            payload=payload,
            user_agent=user_agent,
            ip_hash=ip_hash,
        )
        self.db.add(event)
        self.db.flush()
        self.db.refresh(event)
        return event

    def list_events(self) -> list[AnalyticsEvent]:
        stmt = select(AnalyticsEvent).order_by(AnalyticsEvent.created_at.asc())
        return list(self.db.scalars(stmt).all())

    def count(self) -> int:
        return int(self.db.scalar(select(func.count()).select_from(AnalyticsEvent)) or 0)

    def count_by_event_name(self, event_name: str) -> int:
        stmt = select(func.count()).select_from(AnalyticsEvent).where(AnalyticsEvent.event_name == event_name)
        return int(self.db.scalar(stmt) or 0)
