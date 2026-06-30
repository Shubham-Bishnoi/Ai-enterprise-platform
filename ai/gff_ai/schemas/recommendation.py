from pydantic import BaseModel, Field


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
    payload: dict = Field(default_factory=dict)


class RecommendationBundle(BaseModel):
    recommended_paths: list[RecommendationPath] = Field(default_factory=list)
    recommended_solutions: list[RecommendedSolution] = Field(default_factory=list)
    suggested_questions: list[SuggestedQuestion] = Field(default_factory=list)
    next_actions: list[NextAction] = Field(default_factory=list)
