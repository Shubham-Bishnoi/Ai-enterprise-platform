from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class DashboardMetricOut(BaseModel):
    id: str
    metric_key: str
    label: str
    value: str
    unit: str | None = None
    trend: str | None = None
    status: str
    sort_order: int
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DashboardActivityItem(BaseModel):
    label: str
    time: str
    activity_type: str
    payload: dict[str, Any] = Field(default_factory=dict)


class DashboardActivityResponse(BaseModel):
    activity: list[DashboardActivityItem] = Field(default_factory=list)
