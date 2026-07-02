from pydantic import BaseModel, Field


class ArchitectureLayer(BaseModel):
    name: str
    description: str
    technologies: list[str] = Field(default_factory=list)
    controls: list[str] = Field(default_factory=list)
