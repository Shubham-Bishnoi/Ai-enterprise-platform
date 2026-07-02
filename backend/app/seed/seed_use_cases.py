from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.use_case import UseCase

USE_CASE_SEED_DATA = [
    {"slug": "compliance-copilot", "title": "Compliance Copilot", "description": "Assist policy review, evidence gathering, and approval preparation.", "industry_slug": "banking-financial-services", "capability_slug": "risk-and-compliance", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Compliance Copilot", "tags": ["compliance", "audit"]},
    {"slug": "aml-investigation-assistant", "title": "AML Investigation Assistant", "description": "Accelerate research and case assembly for financial crime workflows.", "industry_slug": "banking-financial-services", "capability_slug": "investigations", "impact_level": "High", "complexity": "High", "time_to_value": "60-90 days", "recommended_agent": "Compliance Agent", "tags": ["aml", "investigation"]},
    {"slug": "claims-triage-agent", "title": "Claims Triage Agent", "description": "Automate first-pass claims intake, routing, and knowledge support.", "industry_slug": "insurance", "capability_slug": "claims", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Claims Agent", "tags": ["claims", "service"]},
    {"slug": "clinical-knowledge-copilot", "title": "Clinical Knowledge Copilot", "description": "Retrieve governed answers from clinical policies, protocols, and documents.", "industry_slug": "healthcare", "capability_slug": "clinical-operations", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Clinical Copilot", "tags": ["clinical", "knowledge"]},
    {"slug": "maintenance-copilot", "title": "Maintenance Copilot", "description": "Guide troubleshooting, maintenance planning, and technician support.", "industry_slug": "manufacturing", "capability_slug": "operations", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Maintenance Agent", "tags": ["maintenance", "operations"]},
    {"slug": "quality-intelligence-assistant", "title": "Quality Intelligence Assistant", "description": "Surface quality signals, recurring defects, and resolution guidance.", "industry_slug": "manufacturing", "capability_slug": "quality", "impact_level": "High", "complexity": "Medium", "time_to_value": "60-90 days", "recommended_agent": "Operations Agent", "tags": ["quality", "analytics"]},
    {"slug": "customer-service-agent", "title": "Customer Service Agent", "description": "Assist customer support teams with fast, context-rich responses.", "industry_slug": "retail", "capability_slug": "customer-service", "impact_level": "High", "complexity": "Low", "time_to_value": "30-45 days", "recommended_agent": "Customer Operations Agent", "tags": ["customer", "service"]},
    {"slug": "student-support-copilot", "title": "Student Support Copilot", "description": "Support student queries, guidance, and document navigation.", "industry_slug": "education", "capability_slug": "student-success", "impact_level": "Medium", "complexity": "Low", "time_to_value": "30-45 days", "recommended_agent": "Student Success Agent", "tags": ["student", "support"]},
    {"slug": "citizen-service-agent", "title": "Citizen Service Agent", "description": "Automate citizen request triage and policy-based service guidance.", "industry_slug": "government", "capability_slug": "service-delivery", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Citizen Service Agent", "tags": ["government", "service"]},
    {"slug": "safety-copilot", "title": "Safety Copilot", "description": "Assist frontline teams with incident response and safety knowledge.", "industry_slug": "mining", "capability_slug": "safety", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Safety Agent", "tags": ["safety", "field"]},
    {"slug": "reliability-copilot", "title": "Reliability Copilot", "description": "Support field reliability, maintenance planning, and operational risk reviews.", "industry_slug": "energy", "capability_slug": "reliability", "impact_level": "High", "complexity": "Medium", "time_to_value": "60-90 days", "recommended_agent": "Reliability Agent", "tags": ["energy", "reliability"]},
    {"slug": "network-operations-copilot", "title": "Network Operations Copilot", "description": "Support troubleshooting, ticket enrichment, and service restoration workflows.", "industry_slug": "telecom", "capability_slug": "network-operations", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Network Operations Agent", "tags": ["telecom", "network"]},
    {"slug": "audit-evidence-copilot", "title": "Audit Evidence Copilot", "description": "Accelerate evidence retrieval and control testing preparation.", "industry_slug": "audit", "capability_slug": "audit", "impact_level": "High", "complexity": "Low", "time_to_value": "30-45 days", "recommended_agent": "Audit Agent", "tags": ["audit", "evidence"]},
    {"slug": "tax-research-copilot", "title": "Tax Research Copilot", "description": "Support policy lookup, research synthesis, and advisory drafting.", "industry_slug": "tax", "capability_slug": "research", "impact_level": "Medium", "complexity": "Low", "time_to_value": "30-45 days", "recommended_agent": "Tax Copilot", "tags": ["tax", "research"]},
    {"slug": "contract-review-copilot", "title": "Contract Review Copilot", "description": "Assist clause review, risk spotting, and contract drafting workflows.", "industry_slug": "legal", "capability_slug": "contract-review", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Legal Copilot", "tags": ["legal", "contracts"]},
    {"slug": "knowledge-search-copilot", "title": "Knowledge Search Copilot", "description": "Provide trusted retrieval over policies, SOPs, and internal knowledge.", "industry_slug": None, "capability_slug": "knowledge", "impact_level": "High", "complexity": "Low", "time_to_value": "30-45 days", "recommended_agent": "Knowledge Search Agent", "tags": ["knowledge", "search"]},
    {"slug": "process-automation-agent", "title": "Process Automation Agent", "description": "Automate repetitive workflow steps with human review on exceptions.", "industry_slug": None, "capability_slug": "operations", "impact_level": "High", "complexity": "Medium", "time_to_value": "30-60 days", "recommended_agent": "Process Automation Agent", "tags": ["automation", "operations"]},
]


def seed_use_cases(db: Session) -> int:
    created = 0
    for use_case_data in USE_CASE_SEED_DATA:
        stmt = select(UseCase).where(UseCase.slug == use_case_data["slug"])
        existing = db.scalar(stmt)
        if existing:
            for key, value in use_case_data.items():
                setattr(existing, key, value)
            existing.status = "active"
            db.add(existing)
            continue
        db.add(UseCase(**use_case_data, status="active"))
        created += 1
    db.commit()
    return created
