from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blueprint import BlueprintOptionSet

BLUEPRINT_OPTION_SEED_DATA = {
    "industries": [
        "Banking",
        "Financial Services",
        "Insurance",
        "Healthcare",
        "Life Sciences",
        "Manufacturing",
        "Retail",
        "Education",
        "Government",
        "Mining",
        "Energy",
        "Telecom",
        "Audit",
        "Tax",
        "Legal",
        "Other",
    ],
    "company_sizes": [
        "Startup",
        "SMB",
        "Enterprise",
        "Large Enterprise",
        "<100",
        "100–1000",
        "1000–10000",
        "10000+",
    ],
    "top_priorities": [
        "Cost Reduction",
        "Productivity",
        "Customer Experience",
        "Revenue Growth",
        "Compliance",
        "AI Transformation",
        "Automate Processes",
        "Faster Decision Making",
        "Employee Experience",
    ],
    "ai_journey_stages": [
        "No AI",
        "Just Starting",
        "Exploring AI",
        "Running Pilots",
        "Piloting",
        "Scaling AI",
        "AI-Driven Enterprise",
        "AI-Native",
    ],
    "biggest_challenges": [
        "Data Quality",
        "Manual Processes",
        "Knowledge Silos",
        "Compliance Risk",
        "Customer Experience",
        "Legacy Systems",
        "Workforce Readiness",
        "High Operating Cost",
        "Slow Decision Making",
        "Other",
    ],
    "data_readiness": [
        "Highly fragmented",
        "Partially connected",
        "Mostly integrated",
        "Fully integrated",
    ],
    "existing_systems": [
        "CRM",
        "ERP",
        "HRMS",
        "Data Warehouse",
        "Data Lake",
        "BI Tools",
        "Ticketing System",
        "Document Management",
        "Core Banking",
        "Claims System",
        "LMS",
        "MES",
        "SCADA",
        "Other",
    ],
    "leadership_commitment": [
        "Not Discussed",
        "Exploring",
        "Budget Approved",
        "Executive Mandate",
    ],
    "risk_appetite": [
        "Conservative",
        "Balanced",
        "Aggressive",
        "Highly Regulated",
    ],
}


def seed_blueprint_taxonomy(db: Session) -> int:
    created = 0
    for option_group, values in BLUEPRINT_OPTION_SEED_DATA.items():
        for sort_order, value in enumerate(values, start=1):
            stmt = select(BlueprintOptionSet).where(
                BlueprintOptionSet.option_group == option_group,
                BlueprintOptionSet.value == value,
            )
            existing = db.scalar(stmt)
            if existing:
                existing.label = value
                existing.description = None
                existing.sort_order = sort_order
                existing.is_active = True
                db.add(existing)
                continue
            db.add(
                BlueprintOptionSet(
                    option_group=option_group,
                    label=value,
                    value=value,
                    sort_order=sort_order,
                    is_active=True,
                )
            )
            created += 1
    db.commit()
    return created
