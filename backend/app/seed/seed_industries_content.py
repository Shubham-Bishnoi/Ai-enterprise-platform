from sqlalchemy.orm import Session

from app.repositories.industries import IndustryRepository


INDUSTRY_UI_SEED = [
    {"slug": "financial-services", "pack_slug": "banking-financial-services", "title": "Financial Services", "ui_icon": "Landmark", "ui_color": "#FF3040", "challenges": ["Risk complexity", "Regulatory pressure", "Legacy systems"], "outcomes": ["Faster decisioning", "Compliance automation", "Customer intelligence"], "sort_order": 10},
    {"slug": "insurance", "pack_slug": "insurance", "title": "Insurance", "ui_icon": "Shield", "ui_color": "#FF9F1A", "challenges": ["Claims processing", "Fraud detection", "Underwriting"], "outcomes": ["Claims automation", "Risk accuracy", "Service speed"], "sort_order": 20},
    {"slug": "healthcare", "pack_slug": "healthcare", "title": "Healthcare", "ui_icon": "Heart", "ui_color": "#FF3040", "challenges": ["Care coordination", "Documentation", "Operations"], "outcomes": ["Care efficiency", "Clinical support", "Cost reduction"], "sort_order": 30},
    {"slug": "life-sciences", "pack_slug": "generic-enterprise", "title": "Life Sciences", "ui_icon": "FlaskConical", "ui_color": "#1173BC", "challenges": ["Research velocity", "Compliance", "Commercial ops"], "outcomes": ["Research acceleration", "Regulatory speed", "Market insight"], "sort_order": 35},
    {"slug": "manufacturing", "pack_slug": "manufacturing", "title": "Manufacturing", "ui_icon": "Factory", "ui_color": "#10B981", "challenges": ["Quality control", "Maintenance", "Supply chain"], "outcomes": ["Uptime improvement", "Quality intelligence", "Predictive ops"], "sort_order": 40},
    {"slug": "retail", "pack_slug": "retail", "title": "Retail", "ui_icon": "ShoppingCart", "ui_color": "#6B5BFF", "challenges": ["Demand planning", "Personalization", "Store ops"], "outcomes": ["Demand accuracy", "Customer insight", "Store efficiency"], "sort_order": 50},
    {"slug": "education", "pack_slug": "education", "title": "Education", "ui_icon": "GraduationCap", "ui_color": "#1173BC", "challenges": ["Student support", "Academic ops", "Digital learning"], "outcomes": ["Student success", "Faculty enablement", "Learning outcomes"], "sort_order": 60},
    {"slug": "government", "pack_slug": "government", "title": "Government", "ui_icon": "Building2", "ui_color": "#C03C85", "challenges": ["Service delivery", "Data security", "Mission ops"], "outcomes": ["Citizen service", "Secure analytics", "Mission efficiency"], "sort_order": 70},
    {"slug": "mining", "pack_slug": "mining", "title": "Mining", "ui_icon": "Pickaxe", "ui_color": "#A855F7", "challenges": ["Field operations", "Asset intelligence", "Safety"], "outcomes": ["Operational safety", "Asset optimization", "Field efficiency"], "sort_order": 80},
    {"slug": "energy", "pack_slug": "energy", "title": "Energy", "ui_icon": "Zap", "ui_color": "#FF9F1A", "challenges": ["Network ops", "Maintenance", "Risk controls"], "outcomes": ["Grid intelligence", "Predictive maintenance", "Risk reduction"], "sort_order": 90},
    {"slug": "telecom", "pack_slug": "telecom", "title": "Telecom", "ui_icon": "Wifi", "ui_color": "#00A3FF", "challenges": ["Network assurance", "Customer ops", "Automation"], "outcomes": ["Network reliability", "Customer satisfaction", "Service automation"], "sort_order": 100},
    {"slug": "audit", "pack_slug": "audit", "title": "Audit", "ui_icon": "FileSearch", "ui_color": "#6B5BFF", "challenges": ["Evidence workflows", "Control review", "Planning"], "outcomes": ["Audit efficiency", "Control coverage", "Workflow speed"], "sort_order": 110},
    {"slug": "tax", "pack_slug": "tax", "title": "Tax", "ui_icon": "Calculator", "ui_color": "#10B981", "challenges": ["Research complexity", "Workflow automation", "Delivery"], "outcomes": ["Research speed", "Automation coverage", "Client delivery"], "sort_order": 120},
    {"slug": "legal", "pack_slug": "legal", "title": "Legal", "ui_icon": "Scale", "ui_color": "#C03C85", "challenges": ["Matter intelligence", "Contract workflows", "Knowledge mgmt"], "outcomes": ["Matter efficiency", "Contract speed", "Knowledge access"], "sort_order": 130},
]


def seed_industries_content(db: Session) -> int:
    repo = IndustryRepository(db)
    created = 0
    for item in INDUSTRY_UI_SEED:
        repo.upsert_content(
            slug=item["slug"],
            defaults={
                "pack_slug": item.get("pack_slug"),
                "title": item["title"],
                "subtitle": None,
                "ui_color": item.get("ui_color"),
                "ui_icon": item.get("ui_icon"),
                "challenges": item.get("challenges", []),
                "outcomes": item.get("outcomes", []),
                "content_json": {},
                "status": "published",
                "sort_order": item.get("sort_order", 0),
                "metadata_json": {"seed_source": "frontend/pages/Industries.tsx"},
            },
        )
        created += 1
    db.commit()
    return created
