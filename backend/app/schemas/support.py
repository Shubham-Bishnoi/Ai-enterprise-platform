from pydantic import BaseModel


class SupportTicketCreate(BaseModel):
    request_type: str
    title: str
    message: str


class SupportTicketCreated(BaseModel):
    ticket_id: str
    status: str
    message: str
