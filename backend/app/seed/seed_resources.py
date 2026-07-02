import re

from sqlalchemy.orm import Session

from app.repositories.resources import ResourceRepository


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug[:160] or "resource"


RESOURCES_SEED = [
    {
        "title": "Agentic AI Operating Model",
        "resource_type": "research",
        "description": "How enterprises should organize agents, humans, controls, and AI operations.",
        "published_at": "2024",
        "read_time": "8 min",
        "featured": True,
        "link": "/resources",
        "tags": ["agentic", "operating model", "governance", "ai operations"],
    },
    {
        "title": "AI Governance for Enterprises",
        "resource_type": "whitepapers",
        "description": "Controls, audit trails, risk systems, and responsible AI practices for production AI.",
        "published_at": "2024",
        "read_time": "12 min",
        "featured": False,
        "link": "/resources",
        "tags": ["governance", "controls", "risk", "audit"],
    },
    {
        "title": "Building Enterprise Agent Factories",
        "resource_type": "architecture",
        "description": "A practical model for designing, testing, deploying, and operating AI agents.",
        "published_at": "2024",
        "read_time": "15 min",
        "featured": True,
        "link": "/resources",
        "tags": ["agents", "factory", "platform", "deployment"],
    },
    {
        "title": "Knowledge Graphs for AI Transformation",
        "resource_type": "blog",
        "description": "Why enterprise memory, context, and structured knowledge matter for scalable AI.",
        "published_at": "2024",
        "read_time": "6 min",
        "featured": False,
        "link": "/resources",
        "tags": ["knowledge graph", "context", "retrieval"],
    },
    {
        "title": "Banking AI Transformation Guide",
        "resource_type": "case-studies",
        "description": "Reference patterns for banking AI transformation programs.",
        "published_at": "2024",
        "read_time": "10 min",
        "featured": False,
        "link": "/industries#financial-services",
        "tags": ["banking", "financial services", "transformation"],
    },
    {
        "title": "AI Readiness Assessment Framework",
        "resource_type": "whitepapers",
        "description": "Evaluate enterprise readiness across data, governance, and architecture dimensions.",
        "published_at": "2024",
        "read_time": "14 min",
        "featured": False,
        "link": "/resources",
        "tags": ["readiness", "assessment", "maturity"],
    },
    {
        "title": "University AI Lab Blueprint",
        "resource_type": "architecture",
        "description": "Architecture and operating model for university AI innovation labs.",
        "published_at": "2024",
        "read_time": "11 min",
        "featured": False,
        "link": "/platforms#university-oneverse",
        "tags": ["university", "lab", "blueprint"],
    },
    {
        "title": "Manufacturing Operations Intelligence",
        "resource_type": "case-studies",
        "description": "Plant copilots, predictive maintenance, and quality intelligence reference.",
        "published_at": "2024",
        "read_time": "9 min",
        "featured": False,
        "link": "/industries#manufacturing",
        "tags": ["manufacturing", "operations", "maintenance", "quality"],
    },
    {
        "title": "AI Agent Security Patterns",
        "resource_type": "developer",
        "description": "Security architectures for enterprise AI agent deployments.",
        "published_at": "2024",
        "read_time": "13 min",
        "featured": False,
        "link": "/resources",
        "tags": ["security", "agents", "controls"],
    },
    {
        "title": "ROI Calculator Template",
        "resource_type": "downloads",
        "description": "Structured template for estimating AI transformation ROI.",
        "published_at": "2024",
        "read_time": "5 min",
        "featured": False,
        "link": "/resources",
        "tags": ["roi", "calculator", "template"],
    },
]


def seed_resources(db: Session) -> int:
    repo = ResourceRepository(db)
    created = 0
    for item in RESOURCES_SEED:
        slug = _slugify(item["title"])
        repo.upsert(
            slug=slug,
            defaults={
                "title": item["title"],
                "resource_type": item["resource_type"],
                "description": item["description"],
                "link": item.get("link"),
                "published_at": item.get("published_at"),
                "read_time": item.get("read_time"),
                "featured": bool(item.get("featured")),
                "tags": item.get("tags", []),
                "status": "published",
                "sort_order": 0,
                "metadata_json": {"seed_source": "frontend/pages/Resources.tsx"},
            },
        )
        created += 1
    db.commit()
    return created
