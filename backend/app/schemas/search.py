from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class SearchResultOut(BaseModel):
    title: str
    category: str
    description: str
    link: str
    tags: list[Any] = Field(default_factory=list)
    source_type: str
    relevance_score: float


class SearchResponse(BaseModel):
    results: list[SearchResultOut] = Field(default_factory=list)
    query: str
    total: int


class SearchSuggestionResponse(BaseModel):
    suggestions: list[str] = Field(default_factory=list)
    query: str


class SearchIndexEntryOut(BaseModel):
    id: str
    title: str
    category: str
    description: str
    link: str
    tags: list[Any] = Field(default_factory=list)
    source_type: str
    featured: bool
    status: str
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SearchIndexData(BaseModel):
    chips: list[str] = Field(default_factory=list)
    featured: list[SearchIndexEntryOut] = Field(default_factory=list)
