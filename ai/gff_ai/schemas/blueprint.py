from datetime import datetime

from pydantic import BaseModel, Field

from gff_ai.schemas.architecture import ArchitectureLayer
from gff_ai.schemas.governance import GovernancePillar
from gff_ai.schemas.opportunity import BlueprintOpportunity
from gff_ai.schemas.profile import BlueprintProfile
from gff_ai.schemas.roadmap import RoadmapPhase


class ReadinessBreakdown(BaseModel):
    ai_maturity: int = Field(ge=0, le=100)
    business_need: int = Field(ge=0, le=100)
    data_readiness: int = Field(ge=0, le=100)
    process_complexity: int = Field(ge=0, le=100)
    transformation_readiness: int = Field(ge=0, le=100)
    weighted_score: int = Field(ge=0, le=100)


class RecommendedSolution(BaseModel):
    name: str
    category: str
    description: str
    rationale: str


class OperatingModelRecommendation(BaseModel):
    name: str
    description: str
    capabilities: list[str] = Field(default_factory=list)


class RecommendedAgent(BaseModel):
    name: str
    purpose: str
    trigger: str


class BusinessImpactEstimate(BaseModel):
    metric: str
    expected_range: str
    description: str


class NextAction(BaseModel):
    action_key: str
    label: str
    description: str


class HandoffSummary(BaseModel):
    workshop_type: str
    executive_summary: str
    recommended_scope: list[str] = Field(default_factory=list)
    suggested_attendees: list[str] = Field(default_factory=list)


class BlueprintOutput(BaseModel):
    id: str | None = None
    request_id: str | None = None
    generated_at: datetime
    input_profile: BlueprintProfile
    profile_summary: str
    readiness_score: int = Field(ge=0, le=100)
    readiness_category: str
    readiness_breakdown: ReadinessBreakdown
    top_opportunities: list[BlueprintOpportunity] = Field(default_factory=list)
    recommended_solutions: list[RecommendedSolution] = Field(default_factory=list)
    operating_model: list[OperatingModelRecommendation] = Field(default_factory=list)
    recommended_agents: list[RecommendedAgent] = Field(default_factory=list)
    architecture_layers: list[ArchitectureLayer] = Field(default_factory=list)
    governance_framework: list[GovernancePillar] = Field(default_factory=list)
    roadmap_phases: list[RoadmapPhase] = Field(default_factory=list)
    business_impact: list[BusinessImpactEstimate] = Field(default_factory=list)
    next_actions: list[NextAction] = Field(default_factory=list)
    confidence_score: float = Field(ge=0, le=1)
    assumptions: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    handoff_summary: HandoffSummary


class BlueprintState(BaseModel):
    request_id: str | None = None
    blueprint_id: str | None = None
    profile: BlueprintProfile
    generated_at: datetime
    normalized_profile: BlueprintProfile | None = None
    readiness_score: int | None = None
    readiness_category: str | None = None
    readiness_breakdown: ReadinessBreakdown | None = None
    industry_pack: dict = Field(default_factory=dict)
    industry_pack_name: str | None = None
    use_cases: list[dict] = Field(default_factory=list)
    top_opportunities: list[BlueprintOpportunity] = Field(default_factory=list)
    recommended_solutions: list[RecommendedSolution] = Field(default_factory=list)
    operating_model: list[OperatingModelRecommendation] = Field(default_factory=list)
    recommended_agents: list[RecommendedAgent] = Field(default_factory=list)
    architecture_layers: list[ArchitectureLayer] = Field(default_factory=list)
    governance_framework: list[GovernancePillar] = Field(default_factory=list)
    roadmap_phases: list[RoadmapPhase] = Field(default_factory=list)
    business_impact: list[BusinessImpactEstimate] = Field(default_factory=list)
    next_actions: list[NextAction] = Field(default_factory=list)
    profile_summary: str = ""
    assumptions: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    confidence_score: float = 0.82
    handoff_summary: HandoffSummary | None = None
