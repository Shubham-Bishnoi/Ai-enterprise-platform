import os

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.repositories.portal import PortalRepository
from app.repositories.users import UserRepository


DEMO_USERS = [
    {"email": "demo.enterprise@gff.ai", "display_name": "Enterprise Demo", "client_type": "enterprise", "organization_name": "Acme Global Enterprise"},
    {"email": "demo.university@gff.ai", "display_name": "University Demo", "client_type": "university", "organization_name": "GFF University"},
    {"email": "demo.government@gff.ai", "display_name": "Government Demo", "client_type": "government", "organization_name": "Public Sector Agency"},
    {"email": "demo.manufacturing@gff.ai", "display_name": "Manufacturing Demo", "client_type": "manufacturing", "organization_name": "FactoryWorks Manufacturing"},
    {"email": "demo.banking@gff.ai", "display_name": "Banking Demo", "client_type": "banking", "organization_name": "MetroBank Financial"},
    {"email": "demo.startup@gff.ai", "display_name": "Startup Demo", "client_type": "startup", "organization_name": "LaunchStack AI"},
]


def seed_portal_demo(db: Session) -> int:
    users = UserRepository(db)
    portal = PortalRepository(db)
    created = 0

    demo_password = os.getenv("GFF_PORTAL_DEMO_PASSWORD", "demo-access")
    salt, hashed = hash_password(demo_password)

    for item in DEMO_USERS:
        user = users.upsert(
            email=item["email"],
            defaults={
                "display_name": item["display_name"],
                "client_type": item["client_type"],
                "organization_name": item["organization_name"],
                "password_salt": salt,
                "password_hash": hashed,
                "status": "active",
                "is_demo": True,
                "metadata_json": {"seeded_demo": True},
            },
        )

        portal.upsert_workspace(
            user_id=user.id,
            defaults={
                "client_type": user.client_type,
                "organization_name": user.organization_name,
                "workspace_name": "GFF AI Client Workspace",
                "status": "active",
                "stage": "foundry_pilot",
                "current_program": "Enterprise AI Blueprint Program",
                "metadata_json": {
                    "demo_workspace": True,
                    "blueprint_score": 82,
                    "agent_sessions": 19,
                    "automation_runs": 42,
                    "human_review_queue": 6,
                    "audit_trail_status": "enabled",
                    "hil_coverage": "partial",
                    "risk_level": "medium",
                    "model_health": "stable",
                },
            },
        )
        created += 1

    db.commit()
    return created
