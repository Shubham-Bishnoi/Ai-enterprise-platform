from fastapi import APIRouter

from app.api.v1 import (
    agents,
    analytics,
    auth,
    blueprint,
    capabilities,
    consultation,
    contact,
    content,
    dashboard,
    documents,
    governance,
    handoff,
    health,
    industries,
    leads,
    portal,
    platforms,
    resources,
    search,
    support,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(agents.router)
api_router.include_router(analytics.router)
api_router.include_router(blueprint.router)
api_router.include_router(leads.router)
api_router.include_router(contact.router)
api_router.include_router(consultation.router)
api_router.include_router(handoff.router)
api_router.include_router(content.router)
api_router.include_router(capabilities.router)
api_router.include_router(industries.router)
api_router.include_router(platforms.router)
api_router.include_router(resources.router)
api_router.include_router(search.router)
api_router.include_router(dashboard.router)
api_router.include_router(auth.router)
api_router.include_router(portal.router)
api_router.include_router(documents.router)
api_router.include_router(governance.router)
api_router.include_router(support.router)
