import sqlalchemy as sa
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import ClientWorkspace, PortalActivity


ACTIVITY_SEED = [
    {"label": "Blueprint generated", "activity_type": "blueprint_generated", "payload": {"demo": True}},
    {"label": "Workshop requested", "activity_type": "workshop_requested", "payload": {"demo": True}},
    {"label": "Governance item completed", "activity_type": "governance_completed", "payload": {"demo": True}},
    {"label": "Document uploaded", "activity_type": "document_uploaded", "payload": {"demo": True}},
    {"label": "Agent run completed", "activity_type": "agent_run_completed", "payload": {"demo": True}},
]


def seed_portal_activity(db: Session) -> int:
    created = 0
    workspaces = list(db.scalars(select(ClientWorkspace)).all())
    for ws in workspaces:
        existing_count = int(db.scalar(select(sa.func.count()).select_from(PortalActivity).where(PortalActivity.workspace_id == ws.id)) or 0)
        if existing_count > 0:
            continue
        for item in ACTIVITY_SEED:
            db.add(PortalActivity(workspace_id=ws.id, label=item["label"], activity_type=item["activity_type"], payload=item["payload"]))
            created += 1
    db.commit()
    return created
