from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.portal import SupportTicketOut
from app.schemas.support import SupportTicketCreate, SupportTicketCreated
from app.services.portal_service import PortalService
from app.services.support_service import SupportService

router = APIRouter(prefix="/support", tags=["support"])


@router.get("", response_model=APIResponse[list[SupportTicketOut]])
def list_tickets(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[SupportTicketOut]]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = SupportService(db).list_tickets(workspace.id)
    return APIResponse(success=True, data=data, error=None)


@router.post("", response_model=APIResponse[SupportTicketCreated])
def create_ticket(payload: SupportTicketCreate, user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[SupportTicketCreated]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = SupportService(db).create_ticket(workspace.id, payload)
    portal.repository.add_activity(
        workspace.id,
        label=f"Support ticket created: {payload.title}",
        activity_type="support_ticket_created",
        payload={"ticket_id": data.ticket_id, "request_type": payload.request_type},
    )
    db.commit()
    return APIResponse(success=True, data=data, error=None)
