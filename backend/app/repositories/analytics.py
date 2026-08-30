from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import AnalyticsEvent, AnalyticsSession


class AnalyticsRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        *,
        event_name: str,
        source: str,
        payload: dict,
        event_id: str | None = None,
        session_id: str | None = None,
        anonymous_id: str | None = None,
        visitor_session_id: str | None = None,
        lead_id: str | None = None,
        page_path: str | None = None,
        component: str | None = None,
        entity_type: str | None = None,
        entity_id: str | None = None,
        user_agent: str | None = None,
        ip_hash: str | None = None,
        occurred_at: datetime | None = None,
    ) -> AnalyticsEvent:
        event = AnalyticsEvent(
            event_id=event_id,
            session_id=session_id,
            anonymous_id=anonymous_id,
            visitor_session_id=visitor_session_id,
            lead_id=lead_id,
            event_name=event_name,
            source=source,
            page_path=page_path,
            component=component,
            entity_type=entity_type,
            entity_id=entity_id,
            payload=payload,
            user_agent=user_agent,
            ip_hash=ip_hash,
            occurred_at=occurred_at,
        )
        self.db.add(event)
        self.db.flush()
        self.db.refresh(event)
        return event

    def get_by_event_id(self, event_id: str) -> AnalyticsEvent | None:
        return self.db.scalar(select(AnalyticsEvent).where(AnalyticsEvent.event_id == event_id))

    def session_by_key(self, session_key: str):
        return select(AnalyticsSession).where(AnalyticsSession.session_key == session_key)

    def events_between(self, start: datetime, end: datetime) -> list[AnalyticsEvent]:
        stmt = (
            select(AnalyticsEvent)
            .where(AnalyticsEvent.created_at >= start)
            .where(AnalyticsEvent.created_at < end)
            .order_by(AnalyticsEvent.created_at.asc())
        )
        return list(self.db.scalars(stmt).all())

    def sessions_between(self, start: datetime, end: datetime) -> list[AnalyticsSession]:
        stmt = (
            select(AnalyticsSession)
            .where(AnalyticsSession.last_seen_at >= start)
            .where(AnalyticsSession.first_seen_at < end)
            .order_by(AnalyticsSession.first_seen_at.asc())
        )
        return list(self.db.scalars(stmt).all())

    def list_events(self) -> list[AnalyticsEvent]:
        stmt = select(AnalyticsEvent).order_by(AnalyticsEvent.created_at.asc())
        return list(self.db.scalars(stmt).all())

    def count(self) -> int:
        return int(self.db.scalar(select(func.count()).select_from(AnalyticsEvent)) or 0)

    def count_by_event_name(self, event_name: str) -> int:
        stmt = select(func.count()).select_from(AnalyticsEvent).where(AnalyticsEvent.event_name == event_name)
        return int(self.db.scalar(stmt) or 0)
