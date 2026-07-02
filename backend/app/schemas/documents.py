from typing import Any

from pydantic import BaseModel, Field


class DocumentGenerateRequest(BaseModel):
    document_type: str
    title: str
    payload: dict[str, Any] = Field(default_factory=dict)


class DocumentGenerateResponse(BaseModel):
    document_id: str
    status: str


class DocumentDownloadResponse(BaseModel):
    document_id: str
    status: str
    download_url: str | None = None
