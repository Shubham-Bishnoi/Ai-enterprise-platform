from sqlalchemy import JSON, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class DashboardMetric(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "dashboard_metrics"

    metric_key: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    label: Mapped[str] = mapped_column(String(255))
    value: Mapped[str] = mapped_column(String(255))
    unit: Mapped[str | None] = mapped_column(String(64), nullable=True)
    trend: Mapped[str | None] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="published", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
