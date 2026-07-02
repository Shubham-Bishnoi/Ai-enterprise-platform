from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import SupportTicket


class SupportRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_tickets(self, workspace_id: str) -> list[SupportTicket]:
        stmt = select(SupportTicket).where(SupportTicket.workspace_id == workspace_id).order_by(SupportTicket.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def create_ticket(self, **kwargs) -> SupportTicket:
        ticket = SupportTicket(**kwargs)
        self.db.add(ticket)
        self.db.flush()
        self.db.refresh(ticket)
        return ticket

    def get_by_id(self, ticket_id: str) -> SupportTicket | None:
        return self.db.scalar(select(SupportTicket).where(SupportTicket.id == ticket_id))
