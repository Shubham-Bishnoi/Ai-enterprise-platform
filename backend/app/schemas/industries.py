from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class IndustryOut(BaseModel):
    slug: str
    name: str
    description: str
    common_challenges: list[Any] = Field(default_factory=list)
    business_outcomes: list[Any] = Field(default_factory=list)
    recommended_use_cases: list[Any] = Field(default_factory=list)
    recommended_agents: list[Any] = Field(default_factory=list)
    architecture_hints: list[Any] = Field(default_factory=list)
    governance_priorities: list[Any] = Field(default_factory=list)
    roadmap_bias: dict[str, Any] | None = None
    ui: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime


class IndustryContentOut(BaseModel):
    id: str
    slug: str
    pack_slug: str | None = None
    title: str
    subtitle: str | None = None
    ui_color: str | None = None
    ui_icon: str | None = None
    challenges: list[Any] = Field(default_factory=list)
    outcomes: list[Any] = Field(default_factory=list)
    content: dict[str, Any] = Field(default_factory=dict, validation_alias="content_json")
    status: str
    sort_order: int
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
