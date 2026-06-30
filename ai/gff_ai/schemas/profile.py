from pydantic import BaseModel, Field


class ExtractedProfile(BaseModel):
    industry: str | None = None
    role: str | None = None
    objective: str | None = None
    geography: str | None = None
    ai_maturity: str | None = None
    constraints: list[str] = Field(default_factory=list)


class ProfileExtractionResult(BaseModel):
    profile: ExtractedProfile
    missing_fields: list[str] = Field(default_factory=list)
