from sqlalchemy.orm import Session

from app.models.agent import Agent

AGENT_SEED_DATA = [
    {
        "id": "strategy",
        "slug": "strategy-agent",
        "name": "Strategy Agent",
        "title": "AI transformation strategy and roadmap advisor",
        "subtitle": "Roadmap, prioritization, operating model, and business impact.",
        "description": "Guides enterprise AI transformation planning, 90-day pilots, and prioritization.",
        "greeting": "I can help define your AI roadmap, 90-day pilot, and operating model.",
        "icon": "route",
        "image_url": None,
        "status": "active",
        "quick_actions": [
            {"id": "create-ai-transformation-roadmap", "label": "Create AI Transformation Roadmap", "prompt": "Help me create an AI transformation roadmap."},
            {"id": "prioritize-ai-use-cases", "label": "Prioritize AI Use Cases", "prompt": "Help me prioritize AI use cases for business impact."},
            {"id": "define-90-day-ai-pilot", "label": "Define 90-Day AI Pilot", "prompt": "Help me define a 90-day AI pilot."},
            {"id": "build-ai-operating-model", "label": "Build AI Operating Model", "prompt": "Help me build an AI operating model."},
            {"id": "estimate-business-impact", "label": "Estimate Business Impact", "prompt": "Help me estimate business impact from AI."},
            {"id": "generate-strategy-blueprint", "label": "Generate Strategy Blueprint", "prompt": "Prepare inputs for a strategy blueprint."},
        ],
    },
    {
        "id": "architect",
        "slug": "ai-architect-agent",
        "name": "AI Architect Agent",
        "title": "Enterprise AI architecture and solution designer",
        "subtitle": "Architecture, data, integrations, orchestration, and security.",
        "description": "Designs enterprise AI architecture, data layers, and integration patterns.",
        "greeting": "I can help shape your data layer, integrations, and agent orchestration design.",
        "icon": "blocks",
        "image_url": None,
        "status": "active",
        "quick_actions": [
            {"id": "design-ai-architecture", "label": "Design AI Architecture", "prompt": "Help me design an enterprise AI architecture."},
            {"id": "map-data-intelligence-layer", "label": "Map Data & Intelligence Layer", "prompt": "Help me map the data and intelligence layer."},
            {"id": "plan-agent-orchestration", "label": "Plan Agent Orchestration", "prompt": "Help me plan agent orchestration."},
            {"id": "choose-integration-approach", "label": "Choose Integration Approach", "prompt": "Help me choose an integration approach."},
            {"id": "define-security-architecture", "label": "Define Security Architecture", "prompt": "Help me define security architecture for AI systems."},
            {"id": "generate-architecture-blueprint", "label": "Generate Architecture Blueprint", "prompt": "Prepare inputs for an architecture blueprint."},
        ],
    },
    {
        "id": "governance",
        "slug": "governance-agent",
        "name": "Governance Agent",
        "title": "AI governance, risk and compliance expert",
        "subtitle": "Controls, compliance, auditability, and responsible AI.",
        "description": "Advises on governance frameworks, controls, and compliance workflows.",
        "greeting": "I can help define risk controls, policy flows, and responsible AI guardrails.",
        "icon": "shield",
        "image_url": None,
        "status": "active",
        "quick_actions": [
            {"id": "assess-ai-governance-readiness", "label": "Assess AI Governance Readiness", "prompt": "Help me assess AI governance readiness."},
            {"id": "define-risk-controls", "label": "Define Risk Controls", "prompt": "Help me define AI risk controls."},
            {"id": "build-compliance-framework", "label": "Build Compliance Framework", "prompt": "Help me build an AI compliance framework."},
            {"id": "create-responsible-ai-policy", "label": "Create Responsible AI Policy", "prompt": "Help me create a responsible AI policy."},
            {"id": "map-audit-approval-flow", "label": "Map Audit & Approval Flow", "prompt": "Help me map AI audit and approval flow."},
            {"id": "generate-governance-blueprint", "label": "Generate Governance Blueprint", "prompt": "Prepare inputs for a governance blueprint."},
        ],
    },
    {
        "id": "industry",
        "slug": "industry-agent",
        "name": "Industry Agent",
        "title": "Industry-specific AI use cases and transformation guide",
        "subtitle": "Sector use cases, ROI, references, and business outcomes.",
        "description": "Maps sector opportunities, use cases, and transformation outcomes.",
        "greeting": "I can help benchmark your industry and identify high-ROI AI opportunities.",
        "icon": "briefcase",
        "image_url": None,
        "status": "active",
        "quick_actions": [
            {"id": "find-industry-ai-use-cases", "label": "Find Industry AI Use Cases", "prompt": "Help me find industry AI use cases."},
            {"id": "benchmark-my-industry", "label": "Benchmark My Industry", "prompt": "Help me benchmark AI adoption in my industry."},
            {"id": "identify-high-roi-opportunities", "label": "Identify High-ROI Opportunities", "prompt": "Help me identify high-ROI AI opportunities."},
            {"id": "explore-sector-ai-agents", "label": "Explore Sector AI Agents", "prompt": "Help me explore sector-specific AI agents."},
            {"id": "map-industry-challenges", "label": "Map Industry Challenges", "prompt": "Help me map industry challenges suitable for AI."},
            {"id": "generate-industry-blueprint", "label": "Generate Industry Blueprint", "prompt": "Prepare inputs for an industry blueprint."},
        ],
    },
    {
        "id": "training",
        "slug": "training-advisor",
        "name": "Training Advisor",
        "title": "AI talent, training and capability advisor",
        "subtitle": "Workforce readiness, academy programs, and enablement.",
        "description": "Supports AI academy design, role-based learning, and capability building.",
        "greeting": "I can help assess workforce readiness and design role-based training journeys.",
        "icon": "graduation-cap",
        "image_url": None,
        "status": "active",
        "quick_actions": [
            {"id": "build-ai-training-plan", "label": "Build AI Training Plan", "prompt": "Help me build an AI training plan."},
            {"id": "assess-workforce-readiness", "label": "Assess Workforce Readiness", "prompt": "Help me assess workforce readiness for AI."},
            {"id": "design-ai-academy-program", "label": "Design AI Academy Program", "prompt": "Help me design an AI academy program."},
            {"id": "plan-team-enablement", "label": "Plan Team Enablement", "prompt": "Help me plan team enablement for AI adoption."},
            {"id": "create-role-based-learning-paths", "label": "Create Role-Based Learning Paths", "prompt": "Help me create role-based learning paths."},
            {"id": "generate-capability-blueprint", "label": "Generate Capability Blueprint", "prompt": "Prepare inputs for a capability blueprint."},
        ],
    },
]


def seed_agents(db: Session) -> int:
    created = 0
    for agent_data in AGENT_SEED_DATA:
        existing = db.get(Agent, agent_data["id"])
        if existing:
            for key, value in agent_data.items():
                setattr(existing, key, value)
            db.add(existing)
            continue
        db.add(Agent(**agent_data))
        created += 1
    db.commit()
    return created
