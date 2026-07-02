import re
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator


def _validate_email(value: str) -> str:
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value):
        raise ValueError("email must be a valid email address.")
    return value


class LeadUpsertRequest(BaseModel):
    email: str
    name: str | None = None
    company: str | None = None
    phone: str | None = None
    role: str | None = None
    industry: str | None = None
    company_size: str | None = None
    source: str = "unknown"
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return _validate_email(value)


class LeadOut(BaseModel):
    id: str
    email: str | None = None
    name: str | None = None
    company: str | None = None
    phone: str | None = None
    role: str | None = None
    industry: str | None = None
    company_size: str | None = None
    source: str
    status: str
    lifecycle_stage: str
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    first_seen_at: datetime
    last_seen_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LeadCreatedData(BaseModel):
    lead_id: str
    status: str
    lifecycle_stage: str
    message: str
