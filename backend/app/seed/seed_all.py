from app.db.session import create_db_and_tables, get_session_factory
from app.seed.seed_agents import seed_agents


def run_seed() -> int:
    create_db_and_tables()
    session_factory = get_session_factory()
    with session_factory() as db:
        created = seed_agents(db)
    return created


if __name__ == "__main__":
    seeded_count = run_seed()
    print(f"Seed complete. Agents created: {seeded_count}")
