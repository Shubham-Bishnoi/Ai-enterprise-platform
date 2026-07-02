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


class BlueprintProfile(BaseModel):
    industry: str
    company_size: str
    top_priorities: list[str] = Field(default_factory=list, min_length=1, max_length=3)
    ai_journey_stage: str
    biggest_challenge: str
    email: str
    data_readiness: str | None = None
    existing_systems: list[str] = Field(default_factory=list)
    leadership_commitment: str | None = None
    risk_appetite: str | None = None
    source: str = "homepage_blueprint"
    chat_session_id: str | None = None
    lead_id: str | None = None


class BlueprintProfileSummary(BaseModel):
    summary: str
    industry_pack_used: str
    key_drivers: list[str] = Field(default_factory=list)
