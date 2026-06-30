from typing import Any

from pydantic import BaseModel, Field

from gff_ai.schemas.profile import ExtractedProfile
from gff_ai.schemas.recommendation import (
    NextAction,
    RecommendationPath,
    RecommendedSolution,
    SuggestedQuestion,
)


class DiscoveryMessage(BaseModel):
    role: str
    content: str


class DiscoveryState(BaseModel):
    session_id: str
    selected_agent_id: str | None = None
    messages: list[DiscoveryMessage] = Field(default_factory=list)
    latest_user_message: str
    extracted_profile: ExtractedProfile = Field(default_factory=ExtractedProfile)
    missing_fields: list[str] = Field(default_factory=list)
    intent: str | None = None
    confidence_score: float = 0.0
    route: str | None = None
    candidate_routes: list[str] = Field(default_factory=list)
    specialist_response: str = ""
    recommendations: list[RecommendationPath] = Field(default_factory=list)
    recommended_solutions: list[RecommendedSolution] = Field(default_factory=list)
    suggested_questions: list[SuggestedQuestion] = Field(default_factory=list)
    next_actions: list[NextAction] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class DiscoveryResult(BaseModel):
    state: str
    route: str
    confidence_score: float
    extracted_profile: ExtractedProfile
    specialist_response: str
    recommendations: list[RecommendationPath]
    recommended_solutions: list[RecommendedSolution]
    suggested_questions: list[SuggestedQuestion]
    next_actions: list[NextAction]
    missing_fields: list[str] = Field(default_factory=list)
    candidate_routes: list[str] = Field(default_factory=list)
