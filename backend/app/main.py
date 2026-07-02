from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.cors import add_cors_middleware
from app.core.errors import register_error_handlers
from app.core.logging import configure_logging
from app.db.session import create_db_and_tables, get_session_factory
from app.seed.seed_blueprint_taxonomy import seed_blueprint_taxonomy
from app.seed.seed_agents import seed_agents
from app.seed.seed_capabilities import seed_capabilities
from app.seed.seed_content import seed_content
from app.seed.seed_dashboard import seed_dashboard
from app.seed.seed_industries import seed_industries
from app.seed.seed_industries_content import seed_industries_content
from app.seed.seed_homepage import seed_homepage
from app.seed.seed_platforms import seed_platforms
from app.seed.seed_resources import seed_resources
from app.seed.seed_search import seed_search
from app.seed.seed_use_cases import seed_use_cases
from app.seed.seed_portal_demo import seed_portal_demo
from app.seed.seed_portal_projects import seed_portal_projects
from app.seed.seed_documents import seed_documents
from app.seed.seed_governance import seed_governance
from app.seed.seed_portal_activity import seed_portal_activity


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    with get_session_factory()() as db:
        seed_agents(db)
        seed_blueprint_taxonomy(db)
        seed_industries(db)
        seed_use_cases(db)
        seed_content(db)
        seed_homepage(db)
        seed_capabilities(db)
        seed_platforms(db)
        seed_resources(db)
        seed_dashboard(db)
        seed_industries_content(db)
        seed_search(db)
        seed_portal_demo(db)
        seed_portal_projects(db)
        seed_documents(db)
        seed_governance(db)
        seed_portal_activity(db)
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging()

    app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)
    add_cors_middleware(app, settings)
    register_error_handlers(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
