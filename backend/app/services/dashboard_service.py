from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analytics import AnalyticsEvent
from app.repositories.dashboard import DashboardRepository
from app.schemas.dashboard import DashboardActivityItem, DashboardActivityResponse, DashboardMetricOut


class DashboardService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = DashboardRepository(db)

    def metrics(self) -> list[DashboardMetricOut]:
        return [DashboardMetricOut.model_validate(metric, from_attributes=True) for metric in self.repository.list_metrics()]

    def activity(self, limit: int = 12) -> DashboardActivityResponse:
        stmt = select(AnalyticsEvent).order_by(AnalyticsEvent.created_at.desc()).limit(limit)
        events = list(self.db.scalars(stmt).all())
        if not events:
            return DashboardActivityResponse(activity=[])

        items: list[DashboardActivityItem] = []
        now_aware = datetime.now(timezone.utc)
        now_naive = datetime.utcnow()
        for event in events:
            if not event.created_at:
                age_minutes = 0
            elif event.created_at.tzinfo is None:
                age_minutes = int((now_naive - event.created_at).total_seconds() / 60)
            else:
                age_minutes = int((now_aware - event.created_at).total_seconds() / 60)
            if age_minutes < 60:
                time_str = f"{max(age_minutes, 1)}m ago"
            elif age_minutes < 60 * 24:
                time_str = f"{int(age_minutes / 60)}h ago"
            else:
                time_str = f"{int(age_minutes / (60 * 24))}d ago"

            items.append(
                DashboardActivityItem(
                    label=event.event_name.replace("_", " ").title(),
                    time=time_str,
                    activity_type=event.event_name,
                    payload=dict(event.payload or {}),
                )
            )
        return DashboardActivityResponse(activity=items)
