from pydantic import BaseModel, Field


class BlueprintOpportunity(BaseModel):
    title: str
    description: str
    business_area: str
    impact: str
    complexity: str
    time_to_value: str
    recommended_agent: str
    why_it_matters: str
    suggested_first_step: str
    tags: list[str] = Field(default_factory=list)
