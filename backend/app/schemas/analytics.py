from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


class AnalyticsEventCreate(BaseModel):
    session_id: str | None = None
    lead_id: str | None = None
    event_name: str
    source: str
    page_path: str | None = None
    component: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)

    @field_validator("event_name", "source")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("value must not be empty.")
        return cleaned


class AnalyticsEventOut(BaseModel):
    id: str
    session_id: str | None = None
    lead_id: str | None = None
    event_name: str
    source: str
    page_path: str | None = None
    component: str | None = None
    payload: dict[str, Any]
    user_agent: str | None = None
    ip_hash: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalyticsSummaryData(BaseModel):
    total_leads: int
    total_contact_requests: int
    total_consultation_bookings: int
    total_handoff_requests: int
    total_blueprint_generated_events: int
    total_agent_message_events: int
