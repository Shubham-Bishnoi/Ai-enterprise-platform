from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.industry import IndustryPack

INDUSTRY_PACK_SEED_DATA = [
    {
        "slug": "banking-financial-services",
        "name": "Banking / Financial Services",
        "description": "Regulated financial operations with heavy controls and high document intensity.",
        "common_challenges": ["legacy core systems", "compliance-heavy workflows", "fraud and AML pressure", "customer service load", "fragmented knowledge"],
        "recommended_use_cases": ["Compliance Copilot", "AML Investigation Assistant", "Customer Service Agent", "Policy Intelligence Search", "Executive Risk Dashboard"],
        "architecture_hints": ["secure data and intelligence layer", "knowledge graph over policy/process documents", "agent orchestration with approval gates", "audit log and governance controls", "API integration with core systems"],
        "governance_priorities": ["model risk management", "explainability", "auditability", "access controls", "human-in-the-loop approval"],
        "recommended_agents": ["Governance Agent", "Compliance Agent", "Knowledge Search Agent", "Customer Operations Agent", "Executive Insight Agent"],
        "business_outcomes": ["faster compliance review", "reduced manual investigation time", "improved customer response", "better audit readiness"],
        "roadmap_bias": {"emphasis": "governance-first"},
    },
    {
        "slug": "insurance",
        "name": "Insurance",
        "description": "Claims, underwriting, and policy operations with strong oversight needs.",
        "common_challenges": ["claims delays", "policy complexity", "knowledge silos", "fraud review pressure"],
        "recommended_use_cases": ["Claims Triage Agent", "Underwriting Copilot", "Policy Search Assistant", "Fraud Review Copilot"],
        "architecture_hints": ["document intelligence layer", "claims system integration", "approval checkpoints"],
        "governance_priorities": ["traceability", "approval workflows", "evidence retention"],
        "recommended_agents": ["Claims Agent", "Governance Agent", "Knowledge Search Agent", "Customer Operations Agent"],
        "business_outcomes": ["faster claims cycle", "improved underwriting consistency", "better service responsiveness"],
        "roadmap_bias": {"emphasis": "claims-first"},
    },
    {
        "slug": "healthcare",
        "name": "Healthcare",
        "description": "Clinical and administrative workflows requiring privacy, safety, and interoperability.",
        "common_challenges": ["care coordination", "documentation burden", "clinical knowledge access", "privacy constraints"],
        "recommended_use_cases": ["Clinical Knowledge Copilot", "Care Navigation Assistant", "Revenue Cycle Copilot", "Patient Service Agent"],
        "architecture_hints": ["privacy-aware data access", "EMR integration", "consent-aware retrieval"],
        "governance_priorities": ["privacy", "safety review", "role-based access", "human oversight"],
        "recommended_agents": ["Clinical Copilot", "Data Governance Agent", "Patient Service Agent", "Executive Insight Agent"],
        "business_outcomes": ["reduced admin burden", "faster knowledge access", "better patient communication"],
        "roadmap_bias": {"emphasis": "privacy-and-oversight"},
    },
    {
        "slug": "manufacturing",
        "name": "Manufacturing",
        "description": "Operational efficiency, quality, and field intelligence across plants and supply chains.",
        "common_challenges": ["manual plant reporting", "maintenance downtime", "quality drift", "knowledge loss"],
        "recommended_use_cases": ["Maintenance Copilot", "Quality Intelligence Assistant", "Shift Handover Agent", "Supply Chain Risk Dashboard"],
        "architecture_hints": ["MES and ERP integration", "event streaming", "plant knowledge retrieval"],
        "governance_priorities": ["safety controls", "workflow approvals", "production traceability"],
        "recommended_agents": ["Operations Agent", "Maintenance Agent", "Knowledge Search Agent", "Executive Insight Agent"],
        "business_outcomes": ["reduced downtime", "better first-pass quality", "faster operator decisions"],
        "roadmap_bias": {"emphasis": "operations-and-maintenance"},
    },
    {
        "slug": "retail",
        "name": "Retail",
        "description": "High-volume customer, merchandising, and operations workflows.",
        "common_challenges": ["customer churn", "inventory visibility", "store operations load", "content production"],
        "recommended_use_cases": ["Customer Service Agent", "Merchandising Copilot", "Demand Insight Assistant", "Store Operations Agent"],
        "architecture_hints": ["omnichannel integration", "catalog intelligence", "real-time analytics"],
        "governance_priorities": ["brand safety", "customer data controls", "promotion approvals"],
        "recommended_agents": ["Customer Operations Agent", "Revenue Agent", "Store Operations Agent", "Executive Insight Agent"],
        "business_outcomes": ["better customer experience", "improved conversion", "lower service effort"],
        "roadmap_bias": {"emphasis": "customer-and-demand"},
    },
    {
        "slug": "education",
        "name": "Education",
        "description": "Learner support, faculty productivity, and institutional operations.",
        "common_challenges": ["student support load", "content creation burden", "knowledge fragmentation", "administrative inefficiency"],
        "recommended_use_cases": ["Student Support Copilot", "Faculty Content Assistant", "Admissions Agent", "Knowledge Search Assistant"],
        "architecture_hints": ["LMS integration", "document retrieval", "privacy-aware identity controls"],
        "governance_priorities": ["student privacy", "content review", "human-in-the-loop responses"],
        "recommended_agents": ["Student Success Agent", "Knowledge Search Agent", "Governance Agent", "Operations Agent"],
        "business_outcomes": ["faster learner support", "reduced admin workload", "better knowledge access"],
        "roadmap_bias": {"emphasis": "support-and-enable"},
    },
    {
        "slug": "government",
        "name": "Government",
        "description": "Citizen services and internal workflows with strong oversight and audit requirements.",
        "common_challenges": ["service backlog", "policy complexity", "manual case handling", "legacy systems"],
        "recommended_use_cases": ["Citizen Service Agent", "Policy Search Copilot", "Case Triage Assistant", "Executive Service Dashboard"],
        "architecture_hints": ["secure integration layer", "policy knowledge graph", "approval-based orchestration"],
        "governance_priorities": ["auditability", "access control", "policy compliance", "public trust"],
        "recommended_agents": ["Citizen Service Agent", "Governance Agent", "Knowledge Search Agent", "Executive Insight Agent"],
        "business_outcomes": ["faster service delivery", "better audit posture", "reduced manual effort"],
        "roadmap_bias": {"emphasis": "controls-and-service"},
    },
    {
        "slug": "mining",
        "name": "Mining",
        "description": "Field operations, safety, and asset visibility across remote environments.",
        "common_challenges": ["site reporting delays", "safety compliance", "maintenance visibility", "workforce knowledge gaps"],
        "recommended_use_cases": ["Safety Copilot", "Maintenance Assistant", "Field Operations Agent", "Incident Review Dashboard"],
        "architecture_hints": ["SCADA integration", "offline-capable workflows", "asset telemetry"],
        "governance_priorities": ["safety controls", "incident audit trails", "human override"],
        "recommended_agents": ["Safety Agent", "Maintenance Agent", "Operations Agent", "Governance Agent"],
        "business_outcomes": ["better safety readiness", "faster incident response", "reduced downtime"],
        "roadmap_bias": {"emphasis": "safety-first"},
    },
    {
        "slug": "energy",
        "name": "Energy",
        "description": "Asset-heavy operations balancing risk, reliability, and regulatory pressure.",
        "common_challenges": ["asset reliability", "field service complexity", "regulatory reporting", "data silos"],
        "recommended_use_cases": ["Reliability Copilot", "Field Service Agent", "Regulatory Reporting Assistant", "Executive Operations Dashboard"],
        "architecture_hints": ["OT/IT integration", "asset telemetry ingestion", "governed orchestration"],
        "governance_priorities": ["security", "auditability", "operational resilience"],
        "recommended_agents": ["Reliability Agent", "Governance Agent", "Operations Agent", "Executive Insight Agent"],
        "business_outcomes": ["improved uptime", "reduced service delays", "better compliance readiness"],
        "roadmap_bias": {"emphasis": "reliability-and-risk"},
    },
    {
        "slug": "telecom",
        "name": "Telecom",
        "description": "Network, service, and customer operations at scale.",
        "common_challenges": ["network issue resolution", "support volume", "sales complexity", "knowledge fragmentation"],
        "recommended_use_cases": ["Network Operations Copilot", "Service Desk Agent", "Sales Enablement Assistant", "Knowledge Search Agent"],
        "architecture_hints": ["ticketing integration", "network telemetry", "knowledge retrieval"],
        "governance_priorities": ["service quality", "security", "access controls"],
        "recommended_agents": ["Network Operations Agent", "Customer Operations Agent", "Revenue Agent", "Knowledge Search Agent"],
        "business_outcomes": ["faster resolution times", "improved support quality", "better productivity"],
        "roadmap_bias": {"emphasis": "service-operations"},
    },
    {
        "slug": "audit",
        "name": "Audit",
        "description": "Evidence-heavy workflows with strict traceability requirements.",
        "common_challenges": ["manual evidence collection", "testing workload", "documentation review", "quality consistency"],
        "recommended_use_cases": ["Audit Evidence Copilot", "Control Testing Assistant", "Working Paper Search", "Review Dashboard"],
        "architecture_hints": ["document intelligence", "control evidence traceability", "approval workflow"],
        "governance_priorities": ["audit trails", "evidence retention", "review sign-off"],
        "recommended_agents": ["Audit Agent", "Governance Agent", "Knowledge Search Agent", "Executive Insight Agent"],
        "business_outcomes": ["reduced review effort", "faster evidence access", "improved quality consistency"],
        "roadmap_bias": {"emphasis": "evidence-and-controls"},
    },
    {
        "slug": "tax",
        "name": "Tax",
        "description": "Research, filing, and advisory workflows under frequent policy change.",
        "common_challenges": ["policy interpretation", "document research", "workflow pressure", "review bottlenecks"],
        "recommended_use_cases": ["Tax Research Copilot", "Filing Review Assistant", "Client Query Assistant", "Policy Change Monitor"],
        "architecture_hints": ["knowledge retrieval", "document workflow integration", "review checkpoints"],
        "governance_priorities": ["compliance controls", "versioning", "human sign-off"],
        "recommended_agents": ["Tax Copilot", "Governance Agent", "Knowledge Search Agent", "Operations Agent"],
        "business_outcomes": ["faster research", "improved consistency", "reduced manual effort"],
        "roadmap_bias": {"emphasis": "research-and-review"},
    },
    {
        "slug": "legal",
        "name": "Legal",
        "description": "Matter support, contract review, and knowledge workflows.",
        "common_challenges": ["contract turnaround", "matter research", "knowledge fragmentation", "review bottlenecks"],
        "recommended_use_cases": ["Contract Review Copilot", "Matter Research Assistant", "Clause Search Agent", "Legal Intake Agent"],
        "architecture_hints": ["document retrieval", "matter system integration", "approval logging"],
        "governance_priorities": ["privilege protection", "access control", "audit trails"],
        "recommended_agents": ["Legal Copilot", "Knowledge Search Agent", "Governance Agent", "Operations Agent"],
        "business_outcomes": ["faster review cycles", "better knowledge reuse", "higher service consistency"],
        "roadmap_bias": {"emphasis": "knowledge-and-review"},
    },
    {
        "slug": "generic-enterprise",
        "name": "Generic Enterprise",
        "description": "Cross-industry baseline for organizations needing a safe fallback blueprint.",
        "common_challenges": ["manual processes", "knowledge silos", "data fragmentation", "slow decision making"],
        "recommended_use_cases": ["Knowledge Search Copilot", "Process Automation Agent", "Executive Insight Dashboard", "Employee Experience Assistant"],
        "architecture_hints": ["data and intelligence layer", "agent orchestration", "API integrations", "governance controls"],
        "governance_priorities": ["trust", "security", "compliance", "auditability"],
        "recommended_agents": ["Strategy Agent", "Governance Agent", "Knowledge Search Agent", "Process Automation Agent"],
        "business_outcomes": ["better productivity", "faster decisions", "improved operating consistency"],
        "roadmap_bias": {"emphasis": "balanced"},
    },
]


def seed_industries(db: Session) -> int:
    created = 0
    for pack_data in INDUSTRY_PACK_SEED_DATA:
        stmt = select(IndustryPack).where(IndustryPack.slug == pack_data["slug"])
        existing = db.scalar(stmt)
        if existing:
            for key, value in pack_data.items():
                setattr(existing, "roadmap_bias_json" if key == "roadmap_bias" else key, value)
            existing.status = "active"
            db.add(existing)
            continue
        db.add(
            IndustryPack(
                slug=pack_data["slug"],
                name=pack_data["name"],
                description=pack_data["description"],
                common_challenges=pack_data["common_challenges"],
                recommended_use_cases=pack_data["recommended_use_cases"],
                architecture_hints=pack_data["architecture_hints"],
                governance_priorities=pack_data["governance_priorities"],
                recommended_agents=pack_data["recommended_agents"],
                business_outcomes=pack_data["business_outcomes"],
                roadmap_bias_json=pack_data["roadmap_bias"],
                status="active",
            )
        )
        created += 1
    db.commit()
    return created
