from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import PortalDocument


class DocumentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, document_id: str) -> PortalDocument | None:
        return self.db.scalar(select(PortalDocument).where(PortalDocument.id == document_id))

    def list_by_workspace(self, workspace_id: str) -> list[PortalDocument]:
        stmt = select(PortalDocument).where(PortalDocument.workspace_id == workspace_id).order_by(PortalDocument.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def create(self, **kwargs) -> PortalDocument:
        doc = PortalDocument(**kwargs)
        self.db.add(doc)
        self.db.flush()
        self.db.refresh(doc)
        return doc

    def save(self, doc: PortalDocument) -> PortalDocument:
        self.db.add(doc)
        self.db.flush()
        self.db.refresh(doc)
        return doc
