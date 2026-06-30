from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorResponse(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    error: ErrorResponse | None = None


class SuccessEnvelope(BaseModel):
    success: bool = True
    error: None = None


class PaginationMeta(BaseModel):
    total: int = Field(ge=0)
