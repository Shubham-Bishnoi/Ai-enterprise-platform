from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import ClientWorkspace
from app.repositories.governance import GovernanceRepository


CONTROL_SEED = [
    {"control_key": "model_oversight", "title": "Model Oversight", "category": "model", "description": "Model registry, review cadence, and approval controls."},
    {"control_key": "data_access_controls", "title": "Data Access Controls", "category": "data", "description": "Role-based access, least privilege, and secure connectors."},
    {"control_key": "human_approval", "title": "Human Approval Gates", "category": "workflow", "description": "Human-in-the-loop for high-risk actions and decisions."},
    {"control_key": "logging_audit", "title": "Logging and Audit Trail", "category": "audit", "description": "Centralized logs, traceability, and evidence retention."},
    {"control_key": "responsible_ai_policy", "title": "Responsible AI Policy", "category": "policy", "description": "Policy, training, and acceptable-use enforcement."},
    {"control_key": "bias_risk_review", "title": "Bias / Risk Review", "category": "risk", "description": "Bias checks, safety evaluation, and risk sign-off."},
    {"control_key": "vendor_registry", "title": "Vendor / Model Registry", "category": "vendor", "description": "Vendor/model inventory with approvals and SLAs."},
    {"control_key": "incident_response", "title": "Incident Response", "category": "ops", "description": "Runbooks, escalation paths, and incident handling."},
]


def seed_governance(db: Session) -> int:
    repo = GovernanceRepository(db)
    workspaces = list(db.scalars(select(ClientWorkspace)).all())
    created = 0
    for ws in workspaces:
        for idx, item in enumerate(CONTROL_SEED):
            implemented = idx % 3 != 0
            status = "implemented" if implemented else "pending"
            repo.upsert_control(
                workspace_id=ws.id,
                control_key=item["control_key"],
                defaults={
                    "title": item["title"],
                    "category": item["category"],
                    "description": item.get("description"),
                    "implemented": implemented,
                    "status": status,
                    "metadata_json": {"seeded_demo": True},
                },
            )
            created += 1
    db.commit()
    return created
