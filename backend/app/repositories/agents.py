from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.agent import Agent


class AgentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_agents(self) -> list[Agent]:
        stmt = select(Agent).order_by(Agent.name.asc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, agent_id: str) -> Agent | None:
        return self.db.get(Agent, agent_id)
