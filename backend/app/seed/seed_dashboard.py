from sqlalchemy.orm import Session

from app.repositories.dashboard import DashboardRepository


DASHBOARD_METRIC_SEED = [
    {"metric_key": "active_clients", "label": "Active Clients", "value": "48+", "sort_order": 10},
    {"metric_key": "agents_running", "label": "Agents Running", "value": "500+", "sort_order": 20},
    {"metric_key": "ai_projects", "label": "AI Projects", "value": "120+", "sort_order": 30},
    {"metric_key": "countries", "label": "Countries", "value": "8+", "sort_order": 40},
    {"metric_key": "industries", "label": "Industries", "value": "20+", "sort_order": 50},
]


def seed_dashboard(db: Session) -> int:
    repo = DashboardRepository(db)
    created = 0
    for metric in DASHBOARD_METRIC_SEED:
        repo.upsert_metric(
            metric_key=metric["metric_key"],
            defaults={
                "label": metric["label"],
                "value": metric["value"],
                "unit": None,
                "trend": None,
                "status": "published",
                "sort_order": metric["sort_order"],
                "metadata_json": {"seed_source": "frontend/siteContent.ts", "note": "ecosystem snapshot / demo workspace"},
            },
        )
        created += 1
    db.commit()
    return created
