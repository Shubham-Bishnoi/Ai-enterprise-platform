from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class PlatformOut(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    ui_color: str | None = None
    ui_icon: str | None = None
    tags: list[Any] = Field(default_factory=list)
    status: str
    sort_order: int
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
