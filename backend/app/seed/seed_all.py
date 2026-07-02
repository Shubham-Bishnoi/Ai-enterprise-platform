from app.db.session import create_db_and_tables, get_session_factory
from app.seed.seed_blueprint_taxonomy import seed_blueprint_taxonomy
from app.seed.seed_agents import seed_agents
from app.seed.seed_industries import seed_industries
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
        }


if __name__ == "__main__":
    seeded_counts = run_seed()
    print(f"Seed complete. Results: {seeded_counts}")
