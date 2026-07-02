from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dashboard import DashboardMetric


class DashboardRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_metrics(self) -> list[DashboardMetric]:
        stmt = (
            select(DashboardMetric)
            .where(DashboardMetric.status == "published")
            .order_by(DashboardMetric.sort_order.asc(), DashboardMetric.metric_key.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_metric_by_key(self, metric_key: str) -> DashboardMetric | None:
        return self.db.scalar(select(DashboardMetric).where(DashboardMetric.metric_key == metric_key))

    def upsert_metric(self, *, metric_key: str, defaults: dict) -> DashboardMetric:
        existing = self.get_metric_by_key(metric_key)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        metric = DashboardMetric(metric_key=metric_key, **defaults)
        self.db.add(metric)
        self.db.flush()
        self.db.refresh(metric)
        return metric
