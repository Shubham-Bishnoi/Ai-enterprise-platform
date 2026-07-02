# Phase 1 Blueprint Engine

## Overview

Phase 1 adds the backend and AI foundation for the homepage Blueprint flow without changing the existing frontend UI or removing the current frontend mock path.

Implemented layers:

- FastAPI router under `/api/v1/blueprint`
- SQLAlchemy models and Alembic migration for blueprint requests, results, options, industry packs, and use cases
- Deterministic readiness scoring and recommendation pipeline
- LangGraph-ready Blueprint graph
- Mock-mode compatible AI engine with optional provider-driven summary synthesis
- Seeded taxonomy, industry packs, and use cases
- Backend and AI tests

## Backend Modules

- `backend/app/api/v1/blueprint.py`
  - Thin route handlers only
  - Uses `APIResponse` envelope with `success`, `data`, `error`, `meta`
- `backend/app/services/blueprint_service.py`
  - Request validation orchestration
  - Lead lookup/creation
  - Analytics capture
  - AI graph invocation
  - Persistence and regeneration handling
- `backend/app/repositories/blueprint.py`
  - Blueprint request/result CRUD
  - Option retrieval
  - Lead lookup/create
- `backend/app/repositories/industries.py`
  - Active industry-pack reads
- `backend/app/repositories/use_cases.py`
  - Active use-case reads

## AI Modules

- `ai/gff_ai/engines/readiness_scoring.py`
  - Deterministic weighted formula
- `ai/gff_ai/engines/industry_pack_engine.py`
  - Industry selection and fallback
- `ai/gff_ai/engines/recommendation_engine.py`
  - Blueprint opportunity rules layered on top of existing Phase 0 recommendation code
- `ai/gff_ai/engines/blueprint_engine.py`
  - End-to-end deterministic blueprint assembly
- `ai/gff_ai/graphs/blueprint_graph.py`
  - LangGraph-ready pipeline nodes matching the Phase 1 sequence
- `ai/gff_ai/agents/blueprint.py`
  - Optional provider-based summary synthesis with deterministic fallback

## Database

Added tables:

- `blueprint_requests`
- `blueprint_results`
- `blueprint_option_sets`
- `industry_packs`
- `use_cases`

Migration:

- `backend/alembic/versions/20260701_0002_phase_1_blueprint_engine.py`

## API Endpoints

- `GET /api/v1/blueprint/options`
- `POST /api/v1/blueprint/generate`
- `GET /api/v1/blueprint/{blueprint_id}`
- `POST /api/v1/blueprint/{blueprint_id}/regenerate`
- `POST /api/v1/blueprint/{blueprint_id}/export`
- `POST /api/v1/blueprint/{blueprint_id}/email`
- `POST /api/v1/blueprint/{blueprint_id}/handoff`

## Analytics Events

Blueprint flows emit these backend analytics events:

- `blueprint_options_loaded`
- `blueprint_generate_started`
- `blueprint_generate_completed`
- `blueprint_generate_failed`
- `blueprint_retrieved`
- `blueprint_regenerate_requested`
- `blueprint_export_requested`
- `blueprint_email_requested`
- `blueprint_handoff_requested`

## Readiness Scoring

Formula:

```text
0.20 * AI Maturity
+ 0.25 * Business Need
+ 0.20 * Data Readiness
+ 0.20 * Process Complexity
+ 0.15 * Transformation Readiness
```

Properties:

- Deterministic for the same input
- Conservative defaults when advanced fields are missing
- Category mapping:
  - `0-25`: `AI Beginner`
  - `26-50`: `AI Explorer`
  - `51-70`: `AI Adopter`
  - `71-85`: `AI Transformer`
  - `86-100`: `AI-Native Leader`

## Graph Pipeline

Implemented nodes:

1. `validate_input`
2. `normalize_profile`
3. `compute_readiness_score`
4. `select_industry_pack`
5. `recommend_opportunities`
6. `recommend_solutions`
7. `recommend_operating_model`
8. `recommend_agents`
9. `recommend_architecture`
10. `recommend_governance`
11. `generate_roadmap`
12. `estimate_business_impact`
13. `compose_summary`
14. `build_next_actions`
15. `validate_output`
16. `persist_result`

The graph is runnable with or without LangGraph installed. If LangGraph is available, it compiles a `StateGraph`; otherwise it falls back to the runner class.

## Mock And Real Mode

Mock mode:

- Controlled by `ENABLE_AI_MOCK_MODE=true`
- No external provider call required
- Full blueprint still returned
- Output stays schema-bound and deterministic

Real provider mode:

- Uses existing provider abstraction through `get_llm_client()`
- Deterministic scoring remains in code
- Provider only refines summary wording
- Failure falls back to deterministic output and records a warning

## Seed Data

Seeded:

- Blueprint options for all required form groups
- 14 industry packs including `generic-enterprise`
- Cross-industry and industry-specific use cases

## Tests

Validated with:

- Phase 1 backend tests for options, generate, retrieve, regenerate, and scoring
- AI tests for engine output, schema validation, and readiness scoring
- Existing Phase 0 Talk-to-Agent backend tests to confirm no regression
