# Phase 3 — Content, Search, Resources

## Goals
- Provide backend APIs for site content, capabilities, industries, platforms, resources, search, and dashboard metrics.
- Keep frontend UI unchanged; switch to backend as primary data source with hardcoded fallback.
- Keep analytics best-effort only (UI must never break on analytics failures).

## Implemented Backend Modules
- Content: navigation/footer/home pages + home sections
- Capabilities: list + detail
- Industries: list + detail + use-cases/agents/reference-architecture
- Platforms: list + detail
- Resources: list + detail + types + featured
- Search: search + suggestions + index (featured + chips)
- Dashboard: metrics + activity feed derived from analytics

## Seed Strategy
- All Phase 3 tables are seeded at backend startup (FastAPI lifespan).
- Seeds are idempotent (upsert by unique keys).
- Seed data is derived from existing frontend datasets (siteContent.ts and page-local arrays).

## Frontend Integration
- QuickSearch: backend `/search` and `/search/index` primary, local fallback.
- LatestResearch: backend `/resources/featured` primary, local fallback.
- LiveDashboard: backend `/dashboard/metrics` + `/dashboard/activity` primary, local fallback.
- Capabilities/Industries/Platforms/Resources pages: backend primary, local fallback.

## Demo/Data Truth Labeling
- Dashboard metrics are treated as an ecosystem snapshot / demo workspace signal, not production claims.
