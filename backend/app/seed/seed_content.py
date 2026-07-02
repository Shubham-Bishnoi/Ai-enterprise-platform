from sqlalchemy.orm import Session

from app.repositories.content import ContentRepository


def seed_content(db: Session) -> int:
    repo = ContentRepository(db)
    created = 0

    navigation_items = [
        {"label": "Home", "to": "/", "end": True, "mobileOnly": True},
        {"label": "Why GFF AI", "to": "/why-gff-ai"},
        {"label": "Capabilities", "to": "/capabilities"},
        {"label": "Industries", "to": "/industries"},
        {"label": "Platforms", "to": "/platforms"},
        {"label": "Build With GFF", "to": "/build"},
        {"label": "Resources", "to": "/resources"},
        {"label": "Company", "to": "/company"},
        {"label": "Contact", "to": "/contact"},
    ]

    footer_columns = [
        {
            "title": "Solutions",
            "links": [
                {"label": "AI Strategy", "to": "/capabilities#ai-strategy"},
                {"label": "Agentic AI", "to": "/capabilities#agentic-ai"},
                {"label": "AI Engineering", "to": "/capabilities#ai-engineering"},
                {"label": "Governance", "to": "/capabilities#ai-governance"},
                {"label": "Data Platforms", "to": "/platforms#control-center"},
            ],
        },
        {
            "title": "Industries",
            "links": [
                {"label": "Banking", "to": "/industries#financial-services"},
                {"label": "Insurance", "to": "/industries#insurance"},
                {"label": "Healthcare", "to": "/industries#healthcare"},
                {"label": "Education", "to": "/industries#education"},
                {"label": "Energy", "to": "/industries#energy"},
            ],
        },
        {
            "title": "Company",
            "links": [
                {"label": "Mission", "to": "/why-gff-ai#mission"},
                {"label": "Leadership", "to": "/company#leadership"},
                {"label": "Careers", "to": "/company#careers"},
                {"label": "Partners", "to": "/company#partners"},
                {"label": "Investors", "to": "/company#investors"},
            ],
        },
        {
            "title": "Legal",
            "links": [
                {"label": "Privacy", "to": "/portal#governance"},
                {"label": "NDA", "to": "/contact"},
                {"label": "Terms", "to": "/portal#documents"},
                {"label": "Investor Relations", "to": "/company#investors"},
                {"label": "Client Portal", "to": "/portal"},
            ],
        },
        {
            "title": "Contact",
            "links": [
                {"label": "Book Workshop", "to": "/contact#book-workshop"},
                {"label": "Book Consultation", "to": "/contact#book-consultation"},
                {"label": "Sales", "to": "/contact#sales"},
                {"label": "Support", "to": "/contact#support"},
                {"label": "Partnership", "to": "/contact#partnership"},
            ],
        },
    ]

    for slug, title, payload in [
        ("navigation", "Navigation", {"items": navigation_items}),
        ("footer", "Footer", {"columns": footer_columns}),
    ]:
        page = repo.upsert_page(
            slug=slug,
            defaults={
                "title": title,
                "description": None,
                "content_json": payload,
                "status": "published",
                "sort_order": 0,
                "metadata_json": {"seed_source": "frontend/siteContent.ts"},
            },
        )
        if page:
            created += 1

    pages = [
        {
            "slug": "why-gff-ai",
            "title": "Why GFF AI",
            "description": "Garage-Foundry-Factory model for building, deploying, and operating AI-native enterprises.",
            "content_json": {
                "eyebrow": "Why GFF AI",
                "title": "Why GFF AI",
                "subtitle": "A Garage-Foundry-Factory model for building, deploying, and operating AI-native enterprises.",
                "intro": "GFF AI combines strategy, engineering, delivery, governance, and operating rigor into one enterprise transformation system designed for the agentic era.",
            },
        },
        {
            "slug": "capabilities",
            "title": "Capabilities",
            "description": "Strategy, engineering, governance, operations, and agentic AI systems for enterprise transformation.",
            "content_json": {
                "eyebrow": "Capabilities",
                "title": "AI Capabilities",
                "subtitle": "Strategy, engineering, governance, operations, and agentic AI systems for enterprise transformation.",
                "intro": "The capability stack spans advisory through industrialized delivery so enterprises can move from exploration to managed AI operations with one partner.",
            },
        },
        {
            "slug": "industries",
            "title": "Industries",
            "description": "Industry-specific AI transformation systems, agents, architectures, and operating models.",
            "content_json": {
                "eyebrow": "Industries",
                "title": "Industries",
                "subtitle": "Industry-specific AI transformation systems, agents, architectures, and operating models.",
                "intro": "Each industry playbook combines domain challenges, target architectures, reference solutions, AI agents, and business outcomes.",
            },
        },
        {
            "slug": "platforms",
            "title": "Platforms",
            "description": "Garage, Foundry, Factory, Blueprint, Marketplace, Control Center, and specialized ecosystems.",
            "content_json": {
                "eyebrow": "Platforms",
                "title": "Platforms",
                "subtitle": "Garage, Foundry, Factory, Blueprint, Marketplace, Control Center, and specialized AI platform ecosystems.",
                "intro": "The platform portfolio provides reusable environments for innovation, productization, operations, training, and industry acceleration.",
            },
        },
        {
            "slug": "build",
            "title": "Build With GFF",
            "description": "Program delivery, squads, assets, and execution model for AI transformation.",
            "content_json": {
                "eyebrow": "Build",
                "title": "Build With GFF",
                "subtitle": "Program delivery, squads, assets, and execution model for AI transformation.",
            },
        },
        {
            "slug": "resources",
            "title": "Resources",
            "description": "Research, architecture libraries, case studies, videos, webinars, and developer resources.",
            "content_json": {
                "eyebrow": "Resources",
                "title": "Resources",
                "subtitle": "Research, architecture libraries, case studies, videos, webinars, and developer resources for enterprise AI.",
            },
        },
        {
            "slug": "company",
            "title": "Company",
            "description": "Company story, leadership, and global delivery model.",
            "content_json": {
                "eyebrow": "Company",
                "title": "Company",
                "subtitle": "Company story, leadership, and global delivery model.",
            },
        },
        {
            "slug": "portal",
            "title": "Client Portal",
            "description": "Enterprise AI Operations workspace (demo).",
            "content_json": {"eyebrow": "Portal", "title": "Client Portal", "subtitle": "Enterprise AI Operations workspace (demo)."},
        },
    ]

    for item in pages:
        repo.upsert_page(
            slug=item["slug"],
            defaults={
                "title": item["title"],
                "description": item.get("description"),
                "content_json": item.get("content_json", {}),
                "status": "published",
                "sort_order": 0,
                "metadata_json": {"seed_source": "frontend/siteContent.ts"},
            },
        )

    db.commit()
    return created
