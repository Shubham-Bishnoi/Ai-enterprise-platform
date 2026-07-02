from gff_ai.schemas.architecture import ArchitectureLayer


ARCHITECTURE_LAYER_NAMES = [
    "Data & Intelligence Layer",
    "AI & Agent Layer",
    "Orchestration Layer",
    "Integration Layer",
    "Governance & Observability Layer",
]


def build_architecture_layers(*, profile: dict, industry_pack: dict) -> list[ArchitectureLayer]:
    hints = industry_pack.get("architecture_hints", [])
    existing_systems = profile.get("existing_systems", [])
    return [
        ArchitectureLayer(
            name=ARCHITECTURE_LAYER_NAMES[0],
            description="Unifies enterprise data, documents, and telemetry into governed intelligence products.",
            technologies=["Data warehouse", "Knowledge graph", "Vector search"] + hints[:1],
            controls=["Data quality rules", "Metadata lineage"],
        ),
        ArchitectureLayer(
            name=ARCHITECTURE_LAYER_NAMES[1],
            description="Hosts domain copilots and agents aligned to the highest-value business workflows.",
            technologies=["Agent runtime", "Policy-aware prompting", "Retrieval augmentation"],
            controls=["Prompt templates", "Tool permissions"],
        ),
        ArchitectureLayer(
            name=ARCHITECTURE_LAYER_NAMES[2],
            description="Coordinates workflows, approvals, and human checkpoints across multi-agent use cases.",
            technologies=["Workflow orchestration", "Approval gates", "Task queues"],
            controls=["Escalation rules", "SLA monitoring"],
        ),
        ArchitectureLayer(
            name=ARCHITECTURE_LAYER_NAMES[3],
            description="Connects AI workflows to systems of record and operational applications already in place.",
            technologies=(existing_systems[:3] or ["CRM", "ERP", "Document Management"]),
            controls=["API contracts", "Change management"],
        ),
        ArchitectureLayer(
            name=ARCHITECTURE_LAYER_NAMES[4],
            description="Applies governance, logging, analytics, and safety controls across the end-to-end stack.",
            technologies=["Audit logs", "Observability dashboards", "Policy engine"],
            controls=["Access control", "Incident response", "Continuous evaluation"],
        ),
    ]
