from pydantic import BaseModel, Field


class RoadmapPhase(BaseModel):
    phase_number: int
    name: str
    objective: str
    timeline: str
    activities: list[str] = Field(default_factory=list)
    deliverables: list[str] = Field(default_factory=list)
