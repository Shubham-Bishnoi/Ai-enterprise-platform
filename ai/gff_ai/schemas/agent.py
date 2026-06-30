from pydantic import BaseModel


class AgentRoute(BaseModel):
    agent_id: str
    confidence_score: float
    reason: str
