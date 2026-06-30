# GFF AI Backend

Phase 0 backend foundation for Talk to Agent.

## Stack

- Python 3.11+
- FastAPI
- Pydantic v2
- SQLAlchemy 2.0
- Alembic
- PostgreSQL
- pytest

## Setup

1. Create a virtual environment.
2. Install dependencies:
   `pip install -r backend/requirements.txt -r ai/requirements.txt`
3. Copy env files:
   `cp backend/.env.example backend/.env`
   `cp ai/.env.example ai/.env`
4. Export Python path from the repo root:
   `export PYTHONPATH="$PWD/backend:$PWD/ai"`

## Database

- Default production/local database uses PostgreSQL via `DATABASE_URL`.
- Tests can run on SQLite without changing app code.
- Create tables and seed agents:
  `python -m app.seed.seed_all`

## Run

From the repo root:

```bash
export PYTHONPATH="$PWD/backend:$PWD/ai"
uvicorn app.main:app --app-dir backend --reload
```

Health endpoint:

`GET http://127.0.0.1:8000/api/v1/health`

## Phase 0 APIs

- `GET /api/v1/health`
- `GET /api/v1/agents`
- `GET /api/v1/agents/{agent_id}`
- `POST /api/v1/agents/session`
- `GET /api/v1/agents/session/{session_id}`
- `POST /api/v1/agents/chat`
- `POST /api/v1/agents/quick-action`
- `POST /api/v1/agents/handoff`
- `POST /api/v1/analytics/events`

## Mock Mode

- `ENABLE_AI_MOCK_MODE=true` keeps Talk to Agent fully functional without an external LLM key.
- The same graph and service interface runs in both mock and real-provider modes.
- `AI_PROVIDER=nvidia` enables NVIDIA NIM via `NVIDIA_API_KEY`.
- If `AI_PROVIDER=openai` and `OPENAI_API_KEY` is missing while `NVIDIA_API_KEY` exists, the AI layer falls back to NVIDIA automatically.

## Tests

From the repo root:

```bash
export PYTHONPATH="$PWD/backend:$PWD/ai"
python3 -m pytest backend/app/tests
cd ai/gff_ai/tests
PYTHONPATH="/absolute/path/to/DEMO2/backend:/absolute/path/to/DEMO2/ai" python3 -m pytest test_routing_engine.py test_profile_extractor.py test_discovery_graph.py test_provider.py
```
