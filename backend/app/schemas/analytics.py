from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


class SessionContext(BaseModel):
    """Privacy-safe session attributes the browser may send with any event.

    Only ever used to create/refresh the anonymous `analytics_sessions` row —
    nothing here identifies a person.
    """

    landing_page: str | None = Field(default=None, max_length=512)
    referrer: str | None = Field(default=None, max_length=512)
    utm_source: str | None = Field(default=None, max_length=255)
    utm_medium: str | None = Field(default=None, max_length=255)
    utm_campaign: str | None = Field(default=None, max_length=255)
    utm_term: str | None = Field(default=None, max_length=255)
    utm_content: str | None = Field(default=None, max_length=255)
    device_category: str | None = Field(default=None, max_length=32)
    browser_category: str | None = Field(default=None, max_length=32)
    consent_status: str | None = Field(default=None, max_length=64)


class AnalyticsEventCreate(BaseModel):
    # Client-generated UUID for idempotency; optional for legacy bundles.
    event_id: str | None = Field(default=None, max_length=64)
    session_id: str | None = Field(default=None, max_length=64)  # chat session
    anonymous_id: str | None = Field(default=None, max_length=64)
    visitor_session_id: str | None = Field(default=None, max_length=64)
    lead_id: str | None = Field(default=None, max_length=64)
    event_name: str = Field(max_length=128)
    source: str = Field(max_length=128)
    page_path: str | None = Field(default=None, max_length=255)
    component: str | None = Field(default=None, max_length=128)
    entity_type: str | None = Field(default=None, max_length=64)
    entity_id: str | None = Field(default=None, max_length=64)
    occurred_at: datetime | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    session_context: SessionContext | None = None

    @field_validator("event_name", "source")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("value must not be empty.")
        return cleaned


class AnalyticsEventAck(BaseModel):
    """Ingestion acknowledgement. Deliberately does not echo the payload."""

    id: str | None = None
    event_id: str | None = None
    stored: bool
    duplicate: bool = False


class AnalyticsSummaryData(BaseModel):
    total_leads: int
    total_contact_requests: int
    total_consultation_bookings: int
    total_handoff_requests: int
    total_blueprint_generated_events: int
    total_agent_message_events: int
