# Deployment Readiness

## Current Status
- Validation date: `2026-07-02`
- Phase coverage validated: Phase 0, 0.5, 1, 1.5, 2, 3, 4, 5
- Automated verification:
  - Backend + AI tests: `46 passed`
  - Frontend production build: passes
  - Backend API regression sweep: required endpoints returned `200`
- Readiness summary:
  - Internal demo / controlled beta: ready with documented caveats
  - Public production launch: not yet recommended without production auth, rate limiting, and storage/email providers

## Regression Validation Summary
- Passed backend flows:
  - `GET /api/v1/health`
  - `GET /api/v1/dashboard/activity`
  - `GET /api/v1/dashboard/metrics`
  - `GET /api/v1/search`
  - `GET /api/v1/search?q=banking`
  - `GET /api/v1/search/suggestions?q=banking`
  - `GET /api/v1/resources`
  - `GET /api/v1/resources/featured`
  - `GET /api/v1/industries`
  - `GET /api/v1/platforms`
  - `GET /api/v1/capabilities`
  - `GET /api/v1/content/home/sections`
  - `GET /api/v1/blueprint/options`
  - `POST /api/v1/blueprint/generate`
  - `POST /api/v1/contact`
  - `POST /api/v1/handoff`
  - `POST /api/v1/consultation/book`
  - `POST /api/v1/analytics/events`
  - `POST /api/v1/auth/demo-login`
  - `GET /api/v1/portal/dashboard`
  - `GET /api/v1/portal/projects`
  - `GET /api/v1/portal/documents`
  - `GET /api/v1/portal/governance`
  - `POST /api/v1/portal/support`
- Browser validation:
  - Hash routes work as expected.
  - Non-hash routes fall back to the homepage because the app uses `HashRouter`.
  - Automated browser validation was partially limited by browser-sandbox connectivity to `127.0.0.1:8000`; backend API checks from the host environment passed and remain the source of truth for endpoint availability.
- Bug fixes completed during validation:
  - Restored `IndustryPackRepository` compatibility for Blueprint imports.
  - Fixed JSON serialization in Blueprint export placeholder.
  - Fixed dashboard activity datetime handling.

## Required Environment Variables

### Backend
- Required in all environments:
  - `DATABASE_URL`
  - `BACKEND_CORS_ORIGINS`
  - `ENABLE_AI_MOCK_MODE`
  - `AI_PROVIDER`
  - `SECRET_KEY`
- Strongly recommended / production:
  - `GFF_PORTAL_JWT_SECRET`
  - `GFF_PORTAL_DEMO_PASSWORD`
  - `OPENAI_MODEL`
  - `BLUEPRINT_ENGINE_VERSION`
  - `BLUEPRINT_DEFAULT_INDUSTRY`
- Provider-specific:
  - `OPENAI_API_KEY`
  - `OPENAI_BASE_URL`
  - `NVIDIA_API_KEY`
  - `NVIDIA_MODEL`
  - `NVIDIA_BASE_URL`
- Also supported by current settings:
  - `APP_NAME`
  - `ENVIRONMENT`
  - `DEBUG`
  - `TESTING`
  - `API_V1_PREFIX`

### Frontend
- Required:
  - `VITE_API_BASE_URL`

### Not Currently Implemented As Runtime Requirements
- `REDIS_URL`: not used yet
- `ACCESS_TOKEN_EXPIRE_MINUTES`: not configurable yet; token expiry is hardcoded in `app.core.security`
- `FRONTEND_URL`: not used directly; use `BACKEND_CORS_ORIGINS` instead
- `EMAIL_PROVIDER`, `RESEND_API_KEY`, `SENDGRID_API_KEY`, AWS SES variables: placeholders exist, but no active runtime integration yet
- `STORAGE_PROVIDER`: not used yet; document export metadata currently lives in DB
- `APP_ENV`: current settings use `ENVIRONMENT` instead
- `JWT_SECRET_KEY`: current project uses `SECRET_KEY` and/or `GFF_PORTAL_JWT_SECRET`

## Local Run Commands

### Backend
From the repo root:

```bash
export PYTHONPATH="$PWD/backend:$PWD/ai"
./gffenv/bin/uvicorn app.main:create_app --factory --host 0.0.0.0 --port 8000
```

### Frontend
From `frontend/app`:

```bash
npm install
npm run dev
```

### Tests
From the repo root:

```bash
PYTHONPATH="$PWD/backend:$PWD/ai" ./gffenv/bin/python -m pytest backend/app/tests ai/gff_ai/tests -q
```

### Frontend Production Build
From `frontend/app`:

```bash
npm run build
```

## Production Build And Run Commands

### Backend
Recommended production start command:

```bash
PYTHONPATH="$PWD/backend:$PWD/ai" uvicorn app.main:create_app --factory --host 0.0.0.0 --port $PORT
```

### Frontend
Build command:

```bash
npm run build
```

Output directory:
- `frontend/app/dist`

## Database Readiness
- Local validation used SQLite databases for tests/dev (`backend/dev_phase5.db` and temporary pytest DBs).
- Application models are SQLAlchemy 2.0 and are PostgreSQL-compatible.
- Alembic migrations exist through:
  - `20260629_0001_phase_0_talk_to_agent`
  - `20260701_0002_phase_1_blueprint_engine`
  - `20260701_0003_phase_2_contact_leads_analytics`
  - `20260702_0004_phase_3_content_search_resources`
  - `20260702_0005_phase_4_portal_auth`
- Important production note:
  - The app still calls `create_db_and_tables()` during startup. This is acceptable for local development safety, but production operations should treat Alembic as the source of truth and avoid relying on automatic table creation for schema rollout.

### Required Seed Data
- Agents
- Blueprint taxonomy / options
- Industry packs
- Use cases
- Content pages
- Homepage sections
- Capabilities
- Platforms
- Resources
- Dashboard metrics
- Industry UI content
- Search index
- Portal demo users/workspaces
- Portal demo projects
- Portal demo documents
- Governance controls/assessments seed data
- Portal activity

### Migration Command
From `backend`:

```bash
../gffenv/bin/alembic upgrade head
```

### Seed Command
From the repo root:

```bash
export PYTHONPATH="$PWD/backend:$PWD/ai"
./gffenv/bin/python -m app.seed.seed_all
```

### Seed Verification
- `GET /api/v1/agents`
- `GET /api/v1/blueprint/options`
- `GET /api/v1/content/home/sections`
- `GET /api/v1/resources/featured`
- `GET /api/v1/portal/dashboard` after demo login

### Reset Note For Local Development
- Delete the local SQLite file only in development when a clean reset is needed.
- Re-run migrations or the seed command after reset.

## Recommended Production Database
- Recommended initial choice: `Neon Postgres`
- Good alternatives:
  - `Supabase Postgres`
  - `Railway Postgres`
  - `Render Postgres`
  - `AWS RDS` later, when networking/ops maturity is higher
- Why Neon first:
  - fast setup
  - PostgreSQL-native
  - simple connection management for MVP
  - pairs well with Vercel/Render deployment
- Backup note:
  - enable automated backups / point-in-time recovery at the DB provider level before public launch

## Backend Hosting Readiness
- Stack: FastAPI + Uvicorn + SQLAlchemy + Alembic
- Python requirement: `3.11+`
- Dependency file present: `backend/requirements.txt`
- Health endpoint present: `GET /api/v1/health`
- CORS middleware present and configurable
- Debug default is now `false`
- Logging exists, but external log aggregation is still recommended for production
- No static backend asset serving dependency is required for the current architecture
- Document export currently stores placeholder HTML/JSON in DB-backed document records; external object storage is not wired yet

### Recommended Backend Hosting
- Recommended MVP choice: `Render`
- Good alternatives:
  - `Railway`
  - `Fly.io`
  - `DigitalOcean App Platform`
  - `AWS` later
- Why Render first:
  - straightforward Python app deployment
  - easy background migration job / env management
  - simple health checks and service logs

## Frontend Hosting Readiness
- Vite build passes
- Dist output is standard static hosting output under `frontend/app/dist`
- API URL is configurable through `VITE_API_BASE_URL`
- Current router behavior is hash-based, which is safe for static hosts without rewrite rules
- Large media note:
  - the public assets include a hero video and multiple image assets; CDN caching and compression should be enabled in production

### Recommended Frontend Hosting
- Recommended MVP choice: `Vercel`
- Good alternatives:
  - `Netlify`
  - `Cloudflare Pages`

## CORS And API URL Setup
- Frontend reads backend base URL from `VITE_API_BASE_URL`
- Current local fallback is `http://127.0.0.1:8000`
- Backend CORS allows `http://localhost:5173` and `http://127.0.0.1:5173` by default
- For production:
  - set `VITE_API_BASE_URL` to the deployed backend origin
  - set `BACKEND_CORS_ORIGINS` to the real deployed frontend origin(s) only
  - avoid wildcard CORS in production

## Deployment Routing Decision

### Current State
- The app uses `HashRouter`
- Hash routes work:
  - `/#/`
  - `/#/resources`
  - `/#/industries`
  - `/#/platforms`
  - `/#/capabilities`
  - `/#/portal`
  - `/#/contact`
  - `/#/company`
  - `/#/why-gff-ai`
  - `/#/build`
- Non-hash paths like `/resources` and `/portal` currently render the home page shell/content

### Recommendation
- For MVP deployment: keep `HashRouter`
- Before public marketing launch: switch to `BrowserRouter`

### Option A: Keep HashRouter For MVP
- Pros:
  - simplest deployment
  - no rewrite configuration needed
  - lowest routing risk on static hosting
- Cons:
  - less polished URLs
  - weaker SEO / enterprise website presentation

### Option B: Switch To BrowserRouter Before Public Launch
- Pros:
  - clean URLs
  - better SEO and presentation
  - better fit for enterprise marketing/site expectations
- Cons:
  - requires rewrite rules in hosting
  - needs validation for all deep links and hash-anchor scroll behavior

### BrowserRouter Change Required Later
- Replace `HashRouter` with `BrowserRouter` in `frontend/app/src/App.tsx`
- Add rewrite rules for the selected host

#### Vercel
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### Netlify
```text
/* /index.html 200
```

#### Nginx
```nginx
try_files $uri /index.html;
```

## AI Provider Readiness
- Mock mode works without any OpenAI key
- Provider abstraction exists for mock / OpenAI / NVIDIA paths
- No provider keys are hard-coded
- Recommended configuration:
  - local development: `ENABLE_AI_MOCK_MODE=true`, `AI_PROVIDER=mock`
  - internal beta with real LLM: `ENABLE_AI_MOCK_MODE=false`, provider key supplied
  - use smaller/cheaper model for regular chat
  - reserve stronger model configuration for blueprint synthesis only if cost/quality testing justifies it

## Email, Storage, And PDF Readiness

### Email
- `NotificationService` exists as a placeholder
- Provider-ready interface placeholders exist for Resend, SendGrid, and AWS SES
- Recommendation:
  - MVP: Resend
  - later scale: AWS SES

### Document Storage
- Current state:
  - document metadata and export content are stored in DB-backed records
  - no external object storage provider is wired yet
- Recommendation:
  - MVP: keep metadata in DB; store generated artifacts in object storage as soon as downloads become real user-facing assets
  - future provider options:
    - Cloudflare R2
    - Amazon S3
    - Supabase Storage

### PDF Export
- Current state:
  - blueprint export creates a document record with HTML/JSON payload
  - PDF rendering is still a placeholder
- Recommendation:
  - use Playwright HTML-to-PDF or WeasyPrint when converting to real downloadable PDFs

## Security Readiness
- Debug mode defaults to `false`
- Standard API error envelopes are in place
- Raw stack traces should not be exposed when `DEBUG=false`
- Input validation is handled through Pydantic schemas
- CORS is configurable
- Demo portal auth is clearly not production auth
- Rate limiting is only a placeholder today
- Additional pre-production TODOs:
  - add rate limiting
  - add spam/bot protection for public forms
  - add request size limits
  - replace demo auth with production identity
  - centralize audit logs / security logs
  - enable automated DB backups

## No Secrets Committed
- `.env.example` files exist for backend and frontend
- Validation did not require any real provider secrets
- Mock mode works without an external LLM key

## Recommended Hosting Stack
- Frontend: `Vercel`
- Backend: `Render`
- Database: `Neon Postgres`
- Email later: `Resend`
- Storage later: `Cloudflare R2` or `S3`

## Known Risks Before Public Launch
- Demo auth is not production auth
- Rate limiting and abuse controls are not implemented
- Non-hash routes are not ready unless router strategy changes
- External document storage is not implemented
- Real PDF export is not implemented
- Email providers are placeholders only
- Startup still runs `create_db_and_tables()` in addition to migration-based schema management

## Pre-Deploy Checklist
- Provision PostgreSQL database
- Set all required env variables
- Run Alembic migrations
- Run the seed command
- Configure frontend `VITE_API_BASE_URL`
- Configure backend `BACKEND_CORS_ORIGINS`
- Verify `GET /api/v1/health`
- Run pytest suite
- Run frontend production build
- Decide routing strategy: keep `HashRouter` or switch to `BrowserRouter`
- Replace demo secrets before any external-facing deployment

## Post-Deploy Smoke Checklist
- Home page loads
- Quick Search works
- Resources, Industries, Platforms, Capabilities pages load
- Talk to Agent creates a session and responds
- Blueprint options load and generation succeeds
- Contact, handoff, and consultation flows succeed
- Portal demo login works
- Portal dashboard/projects/documents/governance/support load
- Analytics events are recorded
- No 500s on `/api/v1/dashboard/activity`
- No CORS failures from the deployed frontend origin
