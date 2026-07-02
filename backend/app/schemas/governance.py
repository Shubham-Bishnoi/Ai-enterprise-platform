from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class GovernanceFrameworkOut(BaseModel):
    key: str
    label: str
    description: str


class GovernanceControlOut(BaseModel):
    id: str
    control_key: str
    title: str
    category: str
    description: str | None = None
    implemented: bool
    status: str
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GovernanceAssessmentCreate(BaseModel):
    framework: str = "gff_ai"
    notes: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)


class GovernanceAssessmentOut(BaseModel):
    id: str
    framework: str
    score: int
    risk_level: str
    notes: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime

    model_config = {"from_attributes": True}
