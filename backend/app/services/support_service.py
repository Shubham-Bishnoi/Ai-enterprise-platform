from sqlalchemy.orm import Session

from app.repositories.support import SupportRepository
from app.schemas.portal import SupportTicketOut
from app.schemas.support import SupportTicketCreate, SupportTicketCreated


class SupportService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = SupportRepository(db)

    def list_tickets(self, workspace_id: str) -> list[SupportTicketOut]:
        tickets = self.repository.list_tickets(workspace_id)
        return [SupportTicketOut.model_validate(ticket, from_attributes=True) for ticket in tickets]

    def create_ticket(self, workspace_id: str, payload: SupportTicketCreate) -> SupportTicketCreated:
        ticket = self.repository.create_ticket(
            workspace_id=workspace_id,
            request_type=payload.request_type,
            title=payload.title,
            message=payload.message,
            status="open",
            priority="normal",
            metadata_json={"demo_placeholder": True},
        )
        self.db.commit()
        return SupportTicketCreated(ticket_id=ticket.id, status=ticket.status, message="Support ticket created.")
