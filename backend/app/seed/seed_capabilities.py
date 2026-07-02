from sqlalchemy.orm import Session

from app.repositories.capabilities import CapabilityRepository


CAPABILITIES_SEED = [
    {
        "slug": "ai-strategy",
        "title": "AI Strategy",
        "tagline": "Define the transformation thesis",
        "description": "Executive alignment, use-case prioritization, and value case design for AI transformation programs.",
        "ui_color": "#FF3040",
        "ui_icon": "Target",
        "items": ["Executive alignment", "Use-case prioritization", "Value case design", "Investment sequencing", "Portfolio roadmap"],
        "deliverables": ["Transformation thesis", "AI portfolio roadmap", "Business case"],
        "tags": ["strategy", "portfolio", "roadmap"],
        "sort_order": 10,
    },
    {
        "slug": "ai-engineering",
        "title": "AI Engineering",
        "tagline": "Build enterprise-grade AI systems",
        "description": "Reference architectures, integration patterns, and production delivery of AI systems.",
        "ui_color": "#1173BC",
        "ui_icon": "Wrench",
        "items": ["Reference architectures", "Integration patterns", "Production delivery", "Model pipelines", "Data engineering"],
        "deliverables": ["Architecture blueprint", "Production system", "Integration map"],
        "tags": ["engineering", "architecture", "delivery"],
        "sort_order": 20,
    },
    {
        "slug": "agentic-ai",
        "title": "Agentic AI",
        "tagline": "Design and orchestrate AI agents",
        "description": "Agent design, human-in-loop controls, and task orchestration across enterprise workflows.",
        "ui_color": "#6B5BFF",
        "ui_icon": "BrainCircuit",
        "items": ["Agent design", "Human-in-loop controls", "Task orchestration", "Agent factories", "Multi-agent systems"],
        "deliverables": ["Agent architecture", "Orchestration layer", "Governance controls"],
        "tags": ["agents", "orchestration", "human-in-loop"],
        "sort_order": 30,
    },
    {
        "slug": "ai-governance",
        "title": "AI Governance",
        "tagline": "Establish trust and compliance",
        "description": "Policy controls, responsible AI practices, and operational guardrails for scaled deployment.",
        "ui_color": "#C03C85",
        "ui_icon": "Gavel",
        "items": ["Policy controls", "Responsible AI", "Operational guardrails", "Audit readiness", "Risk management"],
        "deliverables": ["Governance framework", "Policy library", "Compliance dashboard"],
        "tags": ["governance", "risk", "compliance"],
        "sort_order": 40,
    },
    {
        "slug": "ai-operations",
        "title": "AI Operations",
        "tagline": "Run AI systems reliably",
        "description": "Model operations, prompt and agent monitoring, and service management for production AI.",
        "ui_color": "#00A3FF",
        "ui_icon": "Settings2",
        "items": ["Model operations", "Prompt monitoring", "Agent monitoring", "Service management", "Cost optimization"],
        "deliverables": ["Ops dashboard", "Monitoring stack", "Runbook library"],
        "tags": ["operations", "monitoring", "reliability"],
        "sort_order": 50,
    },
    {
        "slug": "ai-labs",
        "title": "AI Labs",
        "tagline": "Accelerate experimentation",
        "description": "Rapid pilots, concept validation, and innovation transfer programs.",
        "ui_color": "#FF9F1A",
        "ui_icon": "FlaskConical",
        "items": ["Rapid pilots", "Concept validation", "Innovation transfer", "PoC development", "Benchmarking"],
        "deliverables": ["Pilot report", "Validated concept", "Transfer plan"],
        "tags": ["labs", "pilots", "innovation"],
        "sort_order": 60,
    },
    {
        "slug": "knowledge-graph",
        "title": "Knowledge Graph",
        "tagline": "Connect enterprise knowledge",
        "description": "Semantic layers, knowledge assets, and reasoning context for reliable AI outcomes.",
        "ui_color": "#A855F7",
        "ui_icon": "Network",
        "items": ["Semantic layers", "Knowledge assets", "Reasoning context", "Graph engineering", "Ontology design"],
        "deliverables": ["Knowledge graph", "Semantic model", "Query interface"],
        "tags": ["knowledge", "graph", "semantic"],
        "sort_order": 70,
    },
    {
        "slug": "managed-services",
        "title": "Managed Services",
        "tagline": "Sustain enterprise AI",
        "description": "Run and support, platform reliability, and continuous optimization of AI systems.",
        "ui_color": "#10B981",
        "ui_icon": "ShieldCheck",
        "items": ["Run and support", "Platform reliability", "Continuous optimization", "SLA management", "Incident response"],
        "deliverables": ["Service agreement", "Support model", "Optimization plan"],
        "tags": ["managed services", "support", "sla"],
        "sort_order": 80,
    },
]


def seed_capabilities(db: Session) -> int:
    repo = CapabilityRepository(db)
    created = 0
    for item in CAPABILITIES_SEED:
        repo.upsert(
            slug=item["slug"],
            defaults={
                "title": item["title"],
                "tagline": item.get("tagline"),
                "description": item["description"],
                "ui_color": item.get("ui_color"),
                "ui_icon": item.get("ui_icon"),
                "items": item.get("items", []),
                "deliverables": item.get("deliverables", []),
                "tags": item.get("tags", []),
                "status": "published",
                "sort_order": item.get("sort_order", 0),
                "metadata_json": {"seed_source": "frontend/pages/Capabilities.tsx"},
            },
        )
        created += 1
    db.commit()
    return created
