from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.documents import DocumentRepository
from app.schemas.documents import DocumentDownloadResponse, DocumentGenerateRequest, DocumentGenerateResponse
from app.schemas.portal import PortalDocumentOut


class DocumentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = DocumentRepository(db)

    def list_documents(self, workspace_id: str) -> list[PortalDocumentOut]:
        docs = self.repository.list_by_workspace(workspace_id)
        return [PortalDocumentOut.model_validate(doc, from_attributes=True) for doc in docs]

    def get_document(self, document_id: str) -> PortalDocumentOut:
        doc = self.repository.get_by_id(document_id)
        if not doc:
            raise ApiException(code="not_found", message="Document not found.", status_code=404)
        return PortalDocumentOut.model_validate(doc, from_attributes=True)

    def generate_document(self, workspace_id: str, payload: DocumentGenerateRequest) -> DocumentGenerateResponse:
        doc = self.repository.create(
            workspace_id=workspace_id,
            title=payload.title,
            document_type=payload.document_type,
            status="generating",
            source="generate",
            source_id=None,
            download_url=None,
            content_json={"payload": payload.payload, "note": "generation placeholder"},
            metadata_json={"demo_placeholder": True},
        )
        self.db.commit()
        return DocumentGenerateResponse(document_id=doc.id, status=doc.status)

    def download(self, document_id: str) -> DocumentDownloadResponse:
        doc = self.repository.get_by_id(document_id)
        if not doc:
            raise ApiException(code="not_found", message="Document not found.", status_code=404)
        return DocumentDownloadResponse(document_id=doc.id, status=doc.status, download_url=doc.download_url)

    def create_blueprint_export_placeholder(
        self,
        *,
        workspace_id: str,
        blueprint_id: str,
        title: str,
        content: dict,
    ) -> str:
        doc = self.repository.create(
            workspace_id=workspace_id,
            title=title,
            document_type="blueprint_report",
            status="ready",
            source="blueprint_export",
            source_id=blueprint_id,
            download_url=None,
            content_json={"report_html": content.get("report_html"), "report_json": content.get("report_json")},
            metadata_json={"demo_placeholder": True, "pdf_generation": "todo"},
        )
        self.db.commit()
        return doc.id
