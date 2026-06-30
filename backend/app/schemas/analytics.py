from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AnalyticsEventCreate(BaseModel):
    session_id: str | None = None
    event_name: str
    source: str
    payload: dict[str, Any] = Field(default_factory=dict)


class AnalyticsEventOut(BaseModel):
    id: str
    session_id: str | None = None
    event_name: str
    source: str
    payload: dict[str, Any]
    created_at: datetime
