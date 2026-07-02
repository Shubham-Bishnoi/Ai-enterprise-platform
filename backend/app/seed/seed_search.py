from sqlalchemy.orm import Session

from app.repositories.capabilities import CapabilityRepository
from app.repositories.industries import IndustryRepository
from app.repositories.platforms import PlatformRepository
from app.repositories.resources import ResourceRepository
from app.repositories.search import SearchRepository


QUICK_SEARCH_ENTRIES = [
    {
        "title": "Banking AI Transformation",
        "category": "Industry",
        "description": "AI agents, compliance intelligence, customer operations, and risk automation for banks.",
        "link": "/industries#financial-services",
        "tags": ["banking", "banks", "financial services", "risk", "compliance", "customer operations"],
        "featured": True,
        "relevance_base": 50,
    },
    {
        "title": "University AI Lab",
        "category": "Platform",
        "description": "Build an AI lab, curriculum, faculty enablement, and student innovation environment.",
        "link": "/platforms#university-oneverse",
        "tags": ["university", "education", "lab", "curriculum", "faculty", "students"],
        "featured": True,
        "relevance_base": 45,
    },
    {
        "title": "Insurance AI",
        "category": "Industry",
        "description": "Claims intelligence, underwriting copilots, risk analytics, and governance workflows.",
        "link": "/industries#insurance",
        "tags": ["insurance", "claims", "underwriting", "risk analytics", "governance"],
        "featured": True,
        "relevance_base": 42,
    },
    {
        "title": "Mining AI",
        "category": "Industry",
        "description": "Safety intelligence, operations optimization, predictive maintenance, and remote monitoring.",
        "link": "/industries#mining",
        "tags": ["mining", "safety", "operations", "predictive maintenance", "remote monitoring"],
        "featured": True,
        "relevance_base": 40,
    },
    {
        "title": "Retail AI",
        "category": "Industry",
        "description": "Demand intelligence, store operations copilots, personalization, and inventory automation.",
        "link": "/industries#retail",
        "tags": ["retail", "demand", "store operations", "personalization", "inventory"],
        "featured": True,
        "relevance_base": 40,
    },
    {
        "title": "AI GCC",
        "category": "Operating Model",
        "description": "Design an AI global capability center with agents, governance, and managed operations.",
        "link": "/why-gff-ai",
        "tags": ["gcc", "global capability center", "operating model", "managed operations", "governance"],
        "featured": False,
        "relevance_base": 30,
    },
    {
        "title": "Agent Factory",
        "category": "Platform",
        "description": "Create, test, deploy, and govern enterprise AI agents.",
        "link": "/platforms#factory",
        "tags": ["agent factory", "agents", "platform", "deploy", "govern"],
        "featured": True,
        "relevance_base": 45,
    },
    {
        "title": "Blueprint Generator",
        "category": "Tool",
        "description": "Generate an enterprise AI roadmap, readiness score, architecture, and governance blueprint.",
        "link": "/#blueprint-generator",
        "tags": ["blueprint", "roadmap", "architecture", "governance", "readiness"],
        "featured": True,
        "relevance_base": 55,
    },
]


def seed_search(db: Session) -> int:
    search_repo = SearchRepository(db)
    created = 0

    for entry in QUICK_SEARCH_ENTRIES:
        search_repo.upsert(
            title=entry["title"],
            category=entry["category"],
            link=entry["link"],
            defaults={
                "description": entry["description"],
                "tags": entry.get("tags", []),
                "source_type": "quick_search_seed",
                "relevance_base": entry.get("relevance_base", 0),
                "featured": bool(entry.get("featured")),
                "status": "published",
                "sort_order": 0,
                "metadata_json": {"seed_source": "frontend/siteContent.ts"},
            },
        )
        created += 1

    for cap in CapabilityRepository(db).list_published():
        search_repo.upsert(
            title=cap.title,
            category="Capability",
            link=f"/capabilities?cap={cap.slug}",
            defaults={
                "description": cap.description,
                "tags": list(set((cap.tags or []) + [cap.slug])),
                "source_type": "capability",
                "relevance_base": 20,
                "featured": False,
                "status": "published",
                "sort_order": cap.sort_order,
                "metadata_json": {"source_id": cap.id},
            },
        )

    for platform in PlatformRepository(db).list_published():
        search_repo.upsert(
            title=platform.name,
            category="Platform",
            link=f"/platforms#{platform.slug}",
            defaults={
                "description": platform.description,
                "tags": list(set((platform.tags or []) + [platform.slug])),
                "source_type": "platform",
                "relevance_base": 18,
                "featured": False,
                "status": "published",
                "sort_order": platform.sort_order,
                "metadata_json": {"source_id": platform.id},
            },
        )

    for industry in IndustryRepository(db).list_packs():
        search_repo.upsert(
            title=industry.name,
            category="Industry",
            link="/industries",
            defaults={
                "description": industry.description,
                "tags": [industry.slug, industry.name],
                "source_type": "industry_pack",
                "relevance_base": 12,
                "featured": False,
                "status": "published",
                "sort_order": 0,
                "metadata_json": {"source_id": industry.id},
            },
        )

    for resource in ResourceRepository(db).list_published():
        search_repo.upsert(
            title=resource.title,
            category="Resource",
            link=resource.link or "/resources",
            defaults={
                "description": resource.description,
                "tags": list(set((resource.tags or []) + [resource.resource_type])),
                "source_type": "resource",
                "relevance_base": 10,
                "featured": bool(resource.featured),
                "status": "published",
                "sort_order": resource.sort_order,
                "metadata_json": {"source_id": resource.id},
            },
        )

    db.commit()
    return created
