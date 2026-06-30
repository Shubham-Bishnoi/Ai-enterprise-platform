from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


SessionState = Literal[
    "welcome",
    "profiling",
    "clarifying",
    "routing",
    "recommendation_ready",
    "handoff_ready",
    "error",
]

MessageRole = Literal["user", "assistant", "system"]


class ExtractedProfile(BaseModel):
    industry: str | None = None
    role: str | None = None
    objective: str | None = None
    geography: str | None = None
    ai_maturity: str | None = None
    constraints: list[str] = Field(default_factory=list)


class RecommendationPath(BaseModel):
    id: str
    title: str
    description: str
    agent_id: str


class RecommendedSolution(BaseModel):
    id: str
    name: str
    description: str
    category: str


class SuggestedQuestion(BaseModel):
    id: str
    question: str


class NextAction(BaseModel):
    type: str
    label: str
    payload: dict[str, Any] = Field(default_factory=dict)


class ChatMessageOut(BaseModel):
    id: str
    role: MessageRole
    content: str
    structured_payload: dict[str, Any] | None = None
    created_at: datetime


class SessionSnapshot(BaseModel):
    session_id: str
    state: SessionState
    selected_agent_id: str | None = None
    messages: list[ChatMessageOut]
    profile: ExtractedProfile | None = None
    recommendation: dict[str, Any] | None = None
    confidence_score: float | None = None


class ChatRequest(BaseModel):
    session_id: str
    message: str
    selected_agent_id: str | None = None
    source_surface: str = "homepage_inline_chat"


class ChatResponseData(BaseModel):
    session_id: str
    state: SessionState
    assistant_message: str
    extracted_profile: ExtractedProfile
    confidence_score: float
    recommended_paths: list[RecommendationPath]
    recommended_solutions: list[RecommendedSolution]
    suggested_questions: list[SuggestedQuestion]
    next_actions: list[NextAction]


class HandoffRequest(BaseModel):
    session_id: str
    selected_agent_id: str | None = None
    target: str = "human_expert"
    notes: str | None = None


class HandoffResponseData(BaseModel):
    session_id: str
    state: Literal["handoff_ready"]
    handoff_summary: str
    payload: dict[str, Any]
