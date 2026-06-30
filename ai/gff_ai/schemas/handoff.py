from pydantic import BaseModel, Field


class HandoffPayload(BaseModel):
    summary: str
    recommended_contact: str
    artifacts: list[str] = Field(default_factory=list)
    notes: str | None = None
