from typing import Any

from pydantic import BaseModel, Field, field_validator

from app.schemas.leads import _validate_email

KNOWN_HANDOFF_TYPES = {
    "human_expert",
    "proposal",
    "workshop",
    "blueprint_review",
    "architecture_review",
    "governance_review",
    "pilot_program",
}


class HandoffRequestCreate(BaseModel):
    handoff_type: str
    email: str | None = None
    name: str | None = None
    company: str | None = None
    chat_session_id: str | None = None
    blueprint_result_id: str | None = None
    source: str = "unknown"
    recommended_specialist: str | None = None
    summary: str
    context: dict[str, Any] = Field(default_factory=dict)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return _validate_email(value)

    @field_validator("handoff_type")
    @classmethod
    def validate_handoff_type(cls, value: str) -> str:
        normalized = value.strip().lower().replace(" ", "_")
        if normalized not in KNOWN_HANDOFF_TYPES:
            raise ValueError("handoff_type is not supported.")
        return normalized

    @field_validator("summary")
    @classmethod
    def validate_summary(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("summary must contain at least 2 characters.")
        return cleaned


class HandoffRequestCreatedData(BaseModel):
    handoff_id: str
    lead_id: str | None = None
    status: str
    next_step_message: str
