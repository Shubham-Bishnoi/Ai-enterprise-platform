from sqlalchemy.orm import Session

from app.repositories.content import ContentRepository


def seed_homepage(db: Session) -> int:
    repo = ContentRepository(db)
    created = 0

    sections = [
        {
            "section_key": "quick_search",
            "title": "Quick Search",
            "subtitle": "Explore the ecosystem.",
            "sort_order": 10,
            "content_json": {
                "chips": [
                    "Build AI for Banking",
                    "Create University AI Lab",
                    "Insurance AI",
                    "Mining AI",
                    "Retail AI",
                    "Build AI GCC",
                    "Agent Factory",
                    "Blueprint Generator",
                    "AI Governance",
                    "Manufacturing AI",
                    "Knowledge Graph Factory",
                ],
                "default_results": [
                    {
                        "title": "Banking AI Transformation",
                        "category": "Industry",
                        "description": "AI agents, compliance intelligence, customer operations, and risk automation for banks.",
                        "link": "/industries#financial-services",
                        "tags": ["banking", "banks", "risk", "compliance", "customer operations"],
                    },
                    {
                        "title": "University AI Lab",
                        "category": "Platform",
                        "description": "Build an AI lab, curriculum, faculty enablement, and student innovation environment.",
                        "link": "/platforms#university-oneverse",
                        "tags": ["university", "education", "lab", "curriculum"],
                    },
                    {
                        "title": "Blueprint Generator",
                        "category": "Tool",
                        "description": "Generate an enterprise AI roadmap, readiness score, architecture, and governance blueprint.",
                        "link": "/#blueprint-generator",
                        "tags": ["blueprint", "roadmap", "architecture", "governance"],
                    },
                ],
            },
        },
        {
            "section_key": "latest_research",
            "title": "Latest Research",
            "subtitle": "Ecosystem snapshot and platform operating view.",
            "sort_order": 70,
            "content_json": {},
        },
        {
            "section_key": "live_dashboard",
            "title": "Live Dashboard",
            "subtitle": "Ecosystem snapshot and platform operating view.",
            "sort_order": 60,
            "content_json": {},
        },
    ]

    for section in sections:
        repo.upsert_section(
            section_key=section["section_key"],
            defaults={
                "title": section["title"],
                "subtitle": section.get("subtitle"),
                "content_json": section.get("content_json", {}),
                "status": "published",
                "sort_order": section.get("sort_order", 0),
                "metadata_json": {"seed_source": "frontend/siteContent.ts"},
            },
        )
        created += 1

    db.commit()
    return created
