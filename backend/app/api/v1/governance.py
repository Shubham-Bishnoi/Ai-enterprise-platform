from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.governance import (
    GovernanceAssessmentCreate,
    GovernanceAssessmentOut,
    GovernanceControlOut,
    GovernanceFrameworkOut,
)
from app.services.governance_service import GovernanceService
from app.services.portal_service import PortalService

router = APIRouter(prefix="/governance", tags=["governance"])


@router.get("/frameworks", response_model=APIResponse[list[GovernanceFrameworkOut]])
def frameworks(db: Session = Depends(get_db)) -> APIResponse[list[GovernanceFrameworkOut]]:
    data = GovernanceService(db).frameworks()
    return APIResponse(success=True, data=data, error=None)


@router.get("/controls", response_model=APIResponse[list[GovernanceControlOut]])
def controls(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[GovernanceControlOut]]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = GovernanceService(db).controls(workspace.id)
    return APIResponse(success=True, data=data, error=None)


@router.get("/assessments", response_model=APIResponse[list[GovernanceAssessmentOut]])
def assessments(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[GovernanceAssessmentOut]]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = GovernanceService(db).assessments(workspace.id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/assessment", response_model=APIResponse[GovernanceAssessmentOut])
def create_assessment(
    payload: GovernanceAssessmentCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> APIResponse[GovernanceAssessmentOut]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = GovernanceService(db).create_assessment(workspace.id, payload)
    portal.repository.add_activity(
        workspace.id,
        label="Governance assessment completed",
        activity_type="governance_assessment_completed",
        payload={"assessment_id": data.id, "score": data.score},
    )
    db.commit()
    return APIResponse(success=True, data=data, error=None)


@router.get("/assessment/{assessment_id}", response_model=APIResponse[GovernanceAssessmentOut])
def get_assessment(assessment_id: str, user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[GovernanceAssessmentOut]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = GovernanceService(db).get_assessment(workspace.id, assessment_id)
    return APIResponse(success=True, data=data, error=None)
