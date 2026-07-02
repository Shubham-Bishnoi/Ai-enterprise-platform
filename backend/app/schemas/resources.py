from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ResourceOut(BaseModel):
    id: str
    slug: str
    title: str
    resource_type: str
    description: str
    link: str | None = None
    published_at: str | None = None
    read_time: str | None = None
    featured: bool
    tags: list[Any] = Field(default_factory=list)
    status: str
    sort_order: int
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResourceTypeOut(BaseModel):
    id: str
    label: str
