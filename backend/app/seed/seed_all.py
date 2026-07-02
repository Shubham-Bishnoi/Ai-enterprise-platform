from app.seed.seed_agents import seed_agents
from app.seed.seed_blueprint_taxonomy import seed_blueprint_taxonomy
from app.seed.seed_capabilities import seed_capabilities
from app.seed.seed_content import seed_content
from app.seed.seed_dashboard import seed_dashboard
from app.seed.seed_documents import seed_documents
from app.db.session import create_db_and_tables, get_session_factory
from app.seed.seed_governance import seed_governance
from app.seed.seed_homepage import seed_homepage
from app.seed.seed_industries import seed_industries
from app.seed.seed_industries_content import seed_industries_content
from app.seed.seed_platforms import seed_platforms
from app.seed.seed_portal_activity import seed_portal_activity
from app.seed.seed_portal_demo import seed_portal_demo
from app.seed.seed_portal_projects import seed_portal_projects
from app.seed.seed_resources import seed_resources
from app.seed.seed_search import seed_search
from app.seed.seed_use_cases import seed_use_cases


def run_seed() -> dict[str, int]:
    create_db_and_tables()
    session_factory = get_session_factory()
    with session_factory() as db:
        return {
            "agents": seed_agents(db),
            "blueprint_taxonomy": seed_blueprint_taxonomy(db),
            "industry_packs": seed_industries(db),
            "use_cases": seed_use_cases(db),
            "content_pages": seed_content(db),
            "homepage_sections": seed_homepage(db),
            "capabilities": seed_capabilities(db),
            "platforms": seed_platforms(db),
            "resources": seed_resources(db),
            "dashboard_metrics": seed_dashboard(db),
            "industry_content": seed_industries_content(db),
            "search_index_entries": seed_search(db),
            "portal_demo_users": seed_portal_demo(db),
            "portal_projects": seed_portal_projects(db),
            "portal_documents": seed_documents(db),
            "governance_controls": seed_governance(db),
            "portal_activity": seed_portal_activity(db),
        }


if __name__ == "__main__":
    seeded_counts = run_seed()
    print(f"Seed complete. Results: {seeded_counts}")
