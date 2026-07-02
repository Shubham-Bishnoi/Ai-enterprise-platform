from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ContentPageOut(BaseModel):
    id: str
    slug: str
    title: str
    description: str | None = None
    content: dict[str, Any] = Field(default_factory=dict, validation_alias="content_json")
    status: str
    sort_order: int
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class HomeSectionOut(BaseModel):
    id: str
    section_key: str
    title: str
    subtitle: str | None = None
    content: dict[str, Any] = Field(default_factory=dict, validation_alias="content_json")
    status: str
    sort_order: int
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SiteNavigationData(BaseModel):
    items: list[dict[str, Any]] = Field(default_factory=list)


class SiteFooterData(BaseModel):
    columns: list[dict[str, Any]] = Field(default_factory=list)


class HomeSectionsData(BaseModel):
    sections: list[HomeSectionOut]


class HomeContentData(BaseModel):
    content: dict[str, Any] = Field(default_factory=dict)
