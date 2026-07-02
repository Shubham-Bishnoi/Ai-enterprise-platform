from sqlalchemy.orm import Session

from app.repositories.platforms import PlatformRepository


PLATFORM_SEED = [
    {"group": "Core Platforms", "group_color": "#FF3040", "slug": "garage", "name": "Garage", "description": "Launch experiments, ideation sprints, and rapid concept validation.", "tags": ["Workshops", "PoC", "Discovery"], "ui_icon": "FlaskConical", "sort_order": 10},
    {"group": "Core Platforms", "group_color": "#FF3040", "slug": "foundry", "name": "Foundry", "description": "Industrialize selected opportunities into production-grade solutions.", "tags": ["Engineering", "Productization", "Build"], "ui_icon": "Hammer", "sort_order": 20},
    {"group": "Core Platforms", "group_color": "#FF3040", "slug": "factory", "name": "Factory", "description": "Operate scaled AI portfolios with managed delivery and optimization.", "tags": ["Scale", "Operate", "Govern"], "ui_icon": "Factory", "sort_order": 30},
    {"group": "Intelligence Platforms", "group_color": "#1173BC", "slug": "blueprint", "name": "Blueprint", "description": "Generate architecture, operating model, and roadmap recommendations.", "tags": ["Strategy", "Roadmap", "Design"], "ui_icon": "FileText", "sort_order": 40},
    {"group": "Intelligence Platforms", "group_color": "#1173BC", "slug": "marketplace", "name": "Marketplace", "description": "Discover reusable agents, accelerators, assets, and packaged offerings.", "tags": ["Catalog", "Assets", "Reuse"], "ui_icon": "LayoutGrid", "sort_order": 50},
    {"group": "Intelligence Platforms", "group_color": "#1173BC", "slug": "control-center", "name": "Control Center", "description": "Monitor AI systems, governance status, analytics, and health.", "tags": ["Dashboard", "Monitoring", "Analytics"], "ui_icon": "Monitor", "sort_order": 60},
    {"group": "Industry Platforms", "group_color": "#6B5BFF", "slug": "oremesh", "name": "OREMesh", "description": "Industry platform for resource and operations intelligence.", "tags": ["Mining", "Energy", "Operations"], "ui_icon": "Gem", "sort_order": 70},
    {"group": "Industry Platforms", "group_color": "#6B5BFF", "slug": "retailmesh", "name": "RetailMesh", "description": "Retail-specific data, agents, and operating experiences.", "tags": ["Retail", "Demand", "Store"], "ui_icon": "ShoppingBag", "sort_order": 80},
    {"group": "Industry Platforms", "group_color": "#6B5BFF", "slug": "telecomverse", "name": "TelecomVerse", "description": "Telecom-oriented architectures, agents, and operations accelerators.", "tags": ["Network", "Service", "Automation"], "ui_icon": "TowerControl", "sort_order": 90},
    {"group": "Enablement Platforms", "group_color": "#10B981", "slug": "ai-academy", "name": "AI Academy", "description": "Enable workforce transformation with structured AI learning pathways.", "tags": ["Training", "Upskilling", "Certification"], "ui_icon": "GraduationCap", "sort_order": 100},
    {"group": "Enablement Platforms", "group_color": "#10B981", "slug": "university-oneverse", "name": "University OneVerse", "description": "University-focused AI ecosystems, learning, and collaboration.", "tags": ["Education", "Research", "Collaboration"], "ui_icon": "University", "sort_order": 110},
    {"group": "Enablement Platforms", "group_color": "#10B981", "slug": "assessment-mesh", "name": "Assessment Mesh", "description": "Assess readiness, maturity, controls, and transformation conditions.", "tags": ["Assessment", "Maturity", "Readiness"], "ui_icon": "ClipboardCheck", "sort_order": 120},
]


def seed_platforms(db: Session) -> int:
    repo = PlatformRepository(db)
    created = 0
    for item in PLATFORM_SEED:
        repo.upsert(
            slug=item["slug"],
            defaults={
                "name": item["name"],
                "description": item["description"],
                "ui_color": item.get("group_color"),
                "ui_icon": item.get("ui_icon"),
                "tags": item.get("tags", []),
                "status": "published",
                "sort_order": item.get("sort_order", 0),
                "metadata_json": {"seed_source": "frontend/pages/Platforms.tsx", "group": item.get("group"), "group_color": item.get("group_color")},
            },
        )
        created += 1
    db.commit()
    return created
