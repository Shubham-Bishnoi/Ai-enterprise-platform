from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.agents import AgentRepository
from app.schemas.agents import AgentOut


class AgentService:
    def __init__(self, db: Session) -> None:
        self.repository = AgentRepository(db)

    def list_agents(self) -> list[AgentOut]:
        return [
            AgentOut.model_validate(agent, from_attributes=True)
            for agent in self.repository.list_agents()
        ]

    def get_agent(self, agent_id: str) -> AgentOut:
        agent = self.repository.get_by_id(agent_id)
        if not agent:
            raise ApiException(status_code=404, code="agent_not_found", message="Agent not found.")
        return AgentOut.model_validate(agent, from_attributes=True)
