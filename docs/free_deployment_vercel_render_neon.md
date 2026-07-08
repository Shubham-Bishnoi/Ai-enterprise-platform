# Free Deployment Guide: Vercel + Render + Neon

This repo is prepared for a low-cost demo or staging deployment with:

- Frontend: Vercel
- Backend and AI package: Render
- Database: Neon PostgreSQL
- OpenAI calls: backend only

## Recommended Architecture

- Keep `frontend/app` as the frontend project root for Vercel.
- Keep `backend` and `ai` bundled into one Render web service.
- Do not split `ai` into a separate service unless it later gets its own standalone FastAPI app.
- Use the repo-root `Dockerfile` so the container can copy both `backend/` and `ai/`.
- Use `PYTHONPATH=/app/backend:/app/ai` inside the Render container.

Important path note:

- The repository folder is `ai`, not `AI`.
- On Linux hosts like Render, path case matters.
- Use `/app/ai` and `$PWD/ai` in commands, not `/app/AI` or `$PWD/AI`.

## Backend Start Command

This project uses the FastAPI app factory pattern in `backend/app/main.py`.

Use this start command:

```bash
PYTHONPATH="/app/backend:/app/ai" uvicorn app.main:create_app --factory --host 0.0.0.0 --port ${PORT:-8000}
```

## Step-By-Step Deployment

1. Create a GitHub repository or use the existing repo.
2. Push the current codebase, including `Dockerfile`, `render.yaml`, and the new deployment docs.
3. Create a Neon account.
4. Create a Neon project.
5. Copy the Neon `DATABASE_URL`.
6. Create a Render account.
7. In Render, create a new Web Service.
8. Connect the GitHub repo.
9. Use the repo root as the Render root directory because the `Dockerfile` needs access to both `backend/` and `ai/`.
10. Set runtime to Docker if you are configuring manually.
11. Confirm the Dockerfile path is `./Dockerfile`.
12. Set the Render health check path to `/api/v1/health`.
13. Add the backend environment variables from `backend/.env.production.example`.
14. Set `DATABASE_URL` to the Neon connection string.
15. Set `BACKEND_CORS_ORIGINS` to your frontend URLs, for example `http://localhost:3000,https://your-vercel-domain.vercel.app`.
16. Set `FRONTEND_URL` to your Vercel production URL.
17. Set `AI_PROVIDER=openai`.
18. Set `ENABLE_AI_MOCK_MODE=false`.
19. Set `OPENAI_API_KEY` and keep `OPENAI_BASE_URL=https://api.openai.com/v1`.
20. Deploy the backend on Render.
21. Test `https://your-render-backend.onrender.com/api/v1/health`.
22. Run database migrations.
23. Run the seed command.
24. Create a Vercel account.
25. Import the GitHub repo into Vercel.
26. Set Root Directory to `frontend/app`.
27. Set Build Command to `npm run build`.
28. Set Output Directory to `dist`.
29. Add `VITE_API_BASE_URL=https://your-render-backend.onrender.com`.
30. Deploy the frontend.
31. Copy the Vercel URL.
32. Add the Vercel URL to Render `BACKEND_CORS_ORIGINS`.
33. Redeploy the backend.
34. Smoke test the application end to end.

## Render Manual Setup

If you do not use `render.yaml`, use these fields in the Render UI:

- Root Directory: repo root
- Runtime: Docker
- Dockerfile Path: `./Dockerfile`
- Build Command: not required when using Docker
- Start Command: handled by the Docker `CMD`
- Health Check Path: `/api/v1/health`

Container runtime details:

- Working directory: `/app`
- Backend path: `/app/backend`
- AI package path: `/app/ai`
- Effective Python path: `/app/backend:/app/ai`

## Render Environment Variables

Required:

```env
DATABASE_URL=postgresql+psycopg://username:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require
BACKEND_CORS_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app
FRONTEND_URL=https://your-vercel-domain.vercel.app

AI_PROVIDER=openai
ENABLE_AI_MOCK_MODE=false

OPENAI_API_KEY=replace-with-your-openai-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-5.4-mini
OPENAI_ROUTER_MODEL=gpt-5.4-nano
OPENAI_BLUEPRINT_MODEL=gpt-5.4-mini

SECRET_KEY=replace-with-a-long-random-secret
GFF_PORTAL_JWT_SECRET=replace-with-a-second-long-random-secret
GFF_PORTAL_DEMO_PASSWORD=change-this-demo-password

DEBUG=false
ENVIRONMENT=production
API_V1_PREFIX=/api/v1
BLUEPRINT_ENGINE_VERSION=v1
BLUEPRINT_DEFAULT_INDUSTRY=generic-enterprise
```

Optional placeholders:

```env
REDIS_URL=
EMAIL_PROVIDER=
RESEND_API_KEY=
STORAGE_PROVIDER=
S3_BUCKET=
CLOUDFLARE_R2_BUCKET=
```

## Vercel Setup

Use these fields in Vercel:

- Framework Preset: Vite
- Root Directory: `frontend/app`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

This app currently uses `HashRouter`, so no Vercel rewrite rule is required for the deployed routes.

If you later migrate to `BrowserRouter`, add a rewrite like this in docs or `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

Do not enable that rewrite now unless you also switch the app router.

## Neon Setup

- Create a Neon PostgreSQL project.
- Copy the connection string.
- Ensure the connection string includes SSL. Neon typically provides this automatically.
- Set Render `DATABASE_URL` to the Neon URL.

Example:

```env
DATABASE_URL=postgresql+psycopg://username:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Migrations

Local command from the repo root:

```bash
cd backend
../gffenv/bin/alembic upgrade head
```

Equivalent command from the repo root without changing directories:

```bash
./gffenv/bin/python -m alembic -c backend/alembic.ini upgrade head
```

Typical Render shell command:

```bash
cd /app/backend
alembic upgrade head
```

## Seed Data

Local command from the repo root:

```bash
PYTHONPATH="$PWD/backend:$PWD/ai" ./gffenv/bin/python -m app.seed.seed_all
```

Typical Render shell command:

```bash
cd /app
PYTHONPATH="/app/backend:/app/ai" python -m app.seed.seed_all
```

## Health Check

Use this backend health endpoint for Render:

```text
/api/v1/health
```

Expected shape:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "GFF AI Backend",
    "environment": "production",
    "mock_ai_mode": false
  },
  "error": null,
  "meta": {
    "path": "/api/v1/health"
  }
}
```

## Notes For Free Tiers

- Render free services may sleep after inactivity.
- The first request after sleeping can be slow.
- This is acceptable for demos, previews, and staging.
- It is not ideal for public production workloads with strict latency expectations.

## Recommended Smoke Test Order

1. Confirm backend health at `/api/v1/health`.
2. Confirm the frontend loads from Vercel.
3. Send a message through Talk to Agent.
4. Generate a blueprint.
5. Submit the contact form.
6. Submit a handoff flow.
7. Submit a consultation booking.
8. Open the portal.
9. Verify resources, industries, platforms, and capabilities pages load.
10. Verify search results return data.
11. Check the browser console for errors.
12. Confirm there are no CORS failures.
