from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.schemas.common import APIResponse
from app.schemas.documents import DocumentDownloadResponse, DocumentGenerateRequest, DocumentGenerateResponse
from app.schemas.portal import PortalDocumentOut
from app.services.document_service import DocumentService
from app.services.portal_service import PortalService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("", response_model=APIResponse[list[PortalDocumentOut]])
def list_documents(user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[list[PortalDocumentOut]]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = DocumentService(db).list_documents(workspace.id)
    return APIResponse(success=True, data=data, error=None)


@router.get("/{document_id}", response_model=APIResponse[PortalDocumentOut])
def get_document(document_id: str, user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[PortalDocumentOut]:
    _ = user
    data = DocumentService(db).get_document(document_id)
    return APIResponse(success=True, data=data, error=None)


@router.post("/generate", response_model=APIResponse[DocumentGenerateResponse])
def generate_document(
    payload: DocumentGenerateRequest, user=Depends(get_current_user), db: Session = Depends(get_db)
) -> APIResponse[DocumentGenerateResponse]:
    portal = PortalService(db)
    workspace = portal.repository.get_workspace_by_user(user.id)
    if not workspace:
        workspace_id = portal.ensure_workspace(user_id=user.id, organization_name=user.organization_name, client_type=user.client_type)
        workspace = portal.repository.get_workspace(workspace_id)
    data = DocumentService(db).generate_document(workspace.id, payload)
    portal.repository.add_activity(
        workspace.id,
        label=f"Document generation requested: {payload.title}",
        activity_type="document_generate_requested",
        payload={"document_id": data.document_id, "document_type": payload.document_type},
    )
    db.commit()
    return APIResponse(success=True, data=data, error=None)


@router.get("/{document_id}/download", response_model=APIResponse[DocumentDownloadResponse])
def download_document(document_id: str, user=Depends(get_current_user), db: Session = Depends(get_db)) -> APIResponse[DocumentDownloadResponse]:
    _ = user
    data = DocumentService(db).download(document_id)
    return APIResponse(success=True, data=data, error=None)
