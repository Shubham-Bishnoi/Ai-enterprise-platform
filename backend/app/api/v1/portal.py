from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.errors import ApiException
from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.portal import (
    AIOperationsSummary,
    GovernanceSummary,
    PortalActivityOut,
    PortalDashboardOut,
    PortalDocumentOut,
    PortalProjectOut,
    PortalWorkspaceHeader,
    SupportTicketOut,
)
from app.schemas.support import SupportTicketCreate, SupportTicketCreated
from app.services.analytics_service import AnalyticsService
from app.services.portal_service import PortalService
from app.services.support_service import SupportService

router = APIRouter(prefix="/portal", tags=["portal"])


@router.get("/dashboard", response_model=APIResponse[PortalDashboardOut])
def dashboard(
    client_type: str | None = Query(default=None),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> APIResponse[PortalDashboardOut]:
    data = PortalService(db).dashboard(user=user, client_type_override=client_type)
    return APIResponse(success=True, data=data, error=None)


@router.get("/workspace", response_model=APIResponse[PortalWorkspaceHeader])
def workspace(
    client_type: str | None = Query(default=None),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> APIResponse[PortalWorkspaceHeader]:
    data = PortalService(db).dashboard(user=user, client_type_override=client_type).header
    return APIResponse(success=True, data=data, error=None)


@router.get("/projects", response_model=APIResponse[list[PortalProjectOut]])
def projects(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[PortalProjectOut]]:
    data = PortalService(db).dashboard(user=user).projects
    return APIResponse(success=True, data=data, error=None)


@router.get("/projects/{project_id}", response_model=APIResponse[PortalProjectOut])
def project(project_id: str, user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[PortalProjectOut]:
    dashboard = PortalService(db).dashboard(user=user)
    match = next((p for p in dashboard.projects if p.id == project_id), None)
    if not match:
        match = PortalService(db).repository.get_project(project_id)
        if not match:
            raise ApiException(code="not_found", message="Project not found.", status_code=404)
        data = PortalProjectOut.model_validate(match, from_attributes=True)
        return APIResponse(success=True, data=data, error=None)
    return APIResponse(success=True, data=match, error=None)


@router.get("/activity", response_model=APIResponse[list[PortalActivityOut]])
def activity(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[PortalActivityOut]]:
    data = PortalService(db).dashboard(user=user).activity
    return APIResponse(success=True, data=data, error=None)


@router.get("/analytics", response_model=APIResponse[dict])
def analytics(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[dict]:
    summary = AnalyticsService(db).summary()
    data = summary.model_dump()
    return APIResponse(success=True, data=data, error=None)


@router.get("/ai-operations", response_model=APIResponse[AIOperationsSummary])
def ai_operations(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[AIOperationsSummary]:
    data = PortalService(db).dashboard(user=user).ai_operations
    return APIResponse(success=True, data=data, error=None)


@router.get("/governance", response_model=APIResponse[GovernanceSummary])
def governance(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[GovernanceSummary]:
    data = PortalService(db).dashboard(user=user).governance
    return APIResponse(success=True, data=data, error=None)


@router.get("/documents", response_model=APIResponse[list[PortalDocumentOut]])
def documents(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[PortalDocumentOut]]:
    data = PortalService(db).dashboard(user=user).documents
    return APIResponse(success=True, data=data, error=None)


@router.get("/support", response_model=APIResponse[list[SupportTicketOut]])
def support(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[SupportTicketOut]]:
    workspace = PortalService(db).repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = PortalService(db).ensure_workspace(
            user_id=user.id,
            organization_name=user.organization_name,
            client_type=user.client_type,
        )
        workspace = PortalService(db).repository.get_workspace(workspace_id)
    data = SupportService(db).list_tickets(workspace.id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/support", response_model=APIResponse[SupportTicketCreated])
def create_support(payload: SupportTicketCreate, user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[SupportTicketCreated]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    created = SupportService(db).create_ticket(workspace.id, payload)
    portal.repository.add_activity(
        workspace.id,
        label=f"Support ticket created: {payload.title}",
        activity_type="support_ticket_created",
        payload={"ticket_id": created.ticket_id, "request_type": payload.request_type},
    )
    db.commit()
    return APIResponse(success=True, data=created, error=None)
