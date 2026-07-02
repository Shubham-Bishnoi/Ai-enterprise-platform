from typing import Any

from pydantic import BaseModel, Field, field_validator

from app.schemas.leads import _validate_email

KNOWN_CONSULTATION_TYPES = {
    "discovery_call",
    "automation_audit",
    "ai_blueprint_review",
    "executive_workshop",
    "technical_architecture_session",
    "governance_review",
    "partnership_call",
}


class ConsultationBookingCreate(BaseModel):
    name: str | None = None
    email: str
    company: str | None = None
    consultation_type: str
    preferred_date: str | None = None
    preferred_time: str | None = None
    timezone: str | None = None
    notes: str | None = None
    source: str = "unknown"
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return _validate_email(value)

    @field_validator("consultation_type")
    @classmethod
    def validate_consultation_type(cls, value: str) -> str:
        normalized = value.strip().lower().replace(" ", "_")
        if normalized not in KNOWN_CONSULTATION_TYPES:
            raise ValueError("consultation_type is not supported.")
        return normalized


class ConsultationBookingCreatedData(BaseModel):
    booking_id: str
    lead_id: str | None = None
    status: str
    message: str


class ConsultationSlotsData(BaseModel):
    slots: list[dict[str, str]] = Field(default_factory=list)
    message: str
