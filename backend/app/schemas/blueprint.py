from datetime import datetime
import re
from typing import Any

from pydantic import BaseModel, Field, field_validator

from gff_ai.schemas.blueprint import BlueprintOutput


class BlueprintOptionItem(BaseModel):
    label: str
    value: str
    description: str | None = None
    metadata: dict[str, Any] | None = None


class BlueprintAdvancedOptions(BaseModel):
    data_readiness: list[BlueprintOptionItem] = Field(default_factory=list)
    existing_systems: list[BlueprintOptionItem] = Field(default_factory=list)
    leadership_commitment: list[BlueprintOptionItem] = Field(default_factory=list)
    risk_appetite: list[BlueprintOptionItem] = Field(default_factory=list)


class BlueprintOptionsData(BaseModel):
    industries: list[BlueprintOptionItem] = Field(default_factory=list)
    company_sizes: list[BlueprintOptionItem] = Field(default_factory=list)
    top_priorities: list[BlueprintOptionItem] = Field(default_factory=list)
    ai_journey_stages: list[BlueprintOptionItem] = Field(default_factory=list)
    biggest_challenges: list[BlueprintOptionItem] = Field(default_factory=list)
    advanced_options: BlueprintAdvancedOptions


class BlueprintGenerateRequest(BaseModel):
    industry: str
    company_size: str
    top_priorities: list[str]
    ai_journey_stage: str
    biggest_challenge: str
    email: str
    data_readiness: str | None = None
    existing_systems: list[str] = Field(default_factory=list)
    leadership_commitment: str | None = None
    risk_appetite: str | None = None
    source: str = "homepage_blueprint"
    chat_session_id: str | None = None
    # Optional attribution/consent bag (source_page, utm_*, referrer,
    # consent_status, marketing_consent). Additive — older clients omit it.
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("top_priorities")
    @classmethod
    def validate_top_priorities(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item.strip()]
        if not cleaned:
            raise ValueError("top_priorities must not be empty.")
        if len(cleaned) > 3:
            raise ValueError("top_priorities supports a maximum of 3 priorities.")
        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value):
            raise ValueError("email must be a valid email address.")
        return value


class BlueprintRegenerateRequest(BaseModel):
    overrides: dict[str, Any] = Field(default_factory=dict)


class BlueprintResultEnvelope(BlueprintOutput):
    created_at: datetime | None = None
    version: str = "v1"
    ai_model: str | None = None
    provider: str | None = None


class BlueprintActionResponse(BaseModel):
    blueprint_id: str
    action: str
    status: str
    message: str
    document_id: str | None = None


class BlueprintHandoffResponse(BaseModel):
    blueprint_id: str
    handoff_summary: dict[str, Any]
