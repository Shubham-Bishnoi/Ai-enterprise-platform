from typing import Any

from pydantic import BaseModel, Field, field_validator

from app.schemas.leads import _validate_email

KNOWN_CONTACT_INTENTS = {
    "book_workshop",
    "book_consultation",
    "sales",
    "support",
    "partnership",
    "media",
    "university",
    "investors",
    "general",
}


class ContactRequestCreate(BaseModel):
    name: str
    company: str | None = None
    email: str
    intent: str = "general"
    message: str
    source: str = "unknown"
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return _validate_email(value)

    @field_validator("intent")
    @classmethod
    def normalize_intent(cls, value: str) -> str:
        normalized = value.strip().lower().replace(" ", "_") if value else "general"
        return normalized if normalized in KNOWN_CONTACT_INTENTS else "general"

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("message must contain at least 2 characters.")
        return cleaned


class ContactRequestCreatedData(BaseModel):
    contact_request_id: str
    lead_id: str | None = None
    status: str
    message: str
