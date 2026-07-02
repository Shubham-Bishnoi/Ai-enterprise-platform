from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import ClientWorkspace, PortalProject


PROJECT_SEED = [
    {
        "name": "Enterprise AI Blueprint Program",
        "phase": "Foundry",
        "status": "active",
        "owner": "GFF Delivery Lead",
        "progress": 62,
        "risk_level": "medium",
        "next_milestone": "Blueprint Review Workshop",
    },
    {
        "name": "Agent Factory Pilot",
        "phase": "Factory",
        "status": "active",
        "owner": "AI Ops Lead",
        "progress": 38,
        "risk_level": "high",
        "next_milestone": "Human Review Queue Setup",
    },
    {
        "name": "Governance Control Framework",
        "phase": "Governance Review",
        "status": "active",
        "owner": "Governance PM",
        "progress": 71,
        "risk_level": "low",
        "next_milestone": "Control Evidence Mapping",
    },
    {
        "name": "Knowledge Graph Foundation",
        "phase": "Foundry",
        "status": "planning",
        "owner": "Data Architect",
        "progress": 24,
        "risk_level": "medium",
        "next_milestone": "Ontology Draft",
    },
    {
        "name": "AI Academy Enablement",
        "phase": "Garage",
        "status": "planning",
        "owner": "Enablement Lead",
        "progress": 18,
        "risk_level": "low",
        "next_milestone": "Curriculum Workshop",
    },
]


def seed_portal_projects(db: Session) -> int:
    workspaces = list(db.scalars(select(ClientWorkspace)).all())
    created = 0
    for ws in workspaces:
        for item in PROJECT_SEED:
            stmt = select(PortalProject).where(PortalProject.workspace_id == ws.id, PortalProject.name == item["name"])
            existing = db.scalar(stmt)
            if existing:
                existing.phase = item["phase"]
                existing.status = item["status"]
                existing.owner = item["owner"]
                existing.progress = item["progress"]
                existing.risk_level = item["risk_level"]
                existing.next_milestone = item["next_milestone"]
                db.add(existing)
                continue
            db.add(
                PortalProject(
                    workspace_id=ws.id,
                    name=item["name"],
                    phase=item["phase"],
                    status=item["status"],
                    owner=item["owner"],
                    progress=item["progress"],
                    risk_level=item["risk_level"],
                    next_milestone=item["next_milestone"],
                    related_blueprint_id=None,
                    metadata_json={"seeded_demo": True},
                )
            )
            created += 1

    db.commit()
    return created
