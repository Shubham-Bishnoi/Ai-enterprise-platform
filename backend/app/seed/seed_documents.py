from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import ClientWorkspace, PortalDocument


DOCUMENT_SEED = [
    {"title": "Blueprint Report", "document_type": "blueprint_report", "status": "ready"},
    {"title": "Architecture Pack", "document_type": "architecture_pack", "status": "ready"},
    {"title": "Governance Checklist", "document_type": "governance_checklist", "status": "requires_review"},
    {"title": "Workshop Notes", "document_type": "workshop_notes", "status": "draft"},
    {"title": "Roadmap PDF", "document_type": "roadmap_pdf", "status": "generating"},
]


def seed_documents(db: Session) -> int:
    workspaces = list(db.scalars(select(ClientWorkspace)).all())
    created = 0
    for ws in workspaces:
        for item in DOCUMENT_SEED:
            stmt = select(PortalDocument).where(PortalDocument.workspace_id == ws.id, PortalDocument.title == item["title"])
            existing = db.scalar(stmt)
            if existing:
                existing.document_type = item["document_type"]
                existing.status = item["status"]
                db.add(existing)
                continue
            db.add(
                PortalDocument(
                    workspace_id=ws.id,
                    title=item["title"],
                    document_type=item["document_type"],
                    status=item["status"],
                    source="seed",
                    source_id=None,
                    download_url=None,
                    content_json={"note": "demo vault item"},
                    metadata_json={"seeded_demo": True},
                )
            )
            created += 1
    db.commit()
    return created
