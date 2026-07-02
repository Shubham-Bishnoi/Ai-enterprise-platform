from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str
    password: str


class DemoLoginRequest(BaseModel):
    client_type: str = "enterprise"


class UserOut(BaseModel):
    id: str
    email: str
    display_name: str
    client_type: str
    organization_name: str
    status: str
    is_demo: bool
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AuthTokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut
