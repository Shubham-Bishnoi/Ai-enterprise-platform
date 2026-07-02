from pydantic import BaseModel, Field


class GovernancePillar(BaseModel):
    name: str
    controls: list[str] = Field(default_factory=list)
    priority: str = "medium"
