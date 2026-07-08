# Deployment Smoke Test Checklist

Use this checklist after deploying the backend to Render, the frontend to Vercel, and the database to Neon.

## Backend

- `GET /api/v1/health` returns `200 OK`.
- Health response shows `success=true`.
- Health response `data.status` is `ok`.
- Health response reflects the expected `environment`.
- No backend startup crash appears in Render logs.
- No database connection errors appear in Render logs.

## Frontend

- The Vercel site loads successfully.
- The homepage renders without a blank screen.
- Static assets load correctly.
- No obvious layout regression appears.

## Core User Flows

- Talk to Agent sends a message successfully.
- Blueprint generation completes.
- Contact form submits successfully.
- Handoff flow completes.
- Consultation booking submits successfully.
- Portal loads after authentication or demo access.

## Content And Navigation

- Resources page loads.
- Industries page loads.
- Platforms page loads.
- Capabilities page loads.
- Search returns results.
- Hash-based navigation works as expected.

## Browser Validation

- Browser console stays clean during the main flows.
- No failed network requests appear for required API calls.
- No CORS errors appear in the browser console.
- API requests target the Render backend URL, not localhost.

## Data Validation

- Seeded content appears where expected.
- Portal demo data is available.
- Blueprint-related records persist in the database.
- Contact, handoff, and consultation submissions persist successfully if expected by the flow.

## Free Tier Notes

- A slow first request after inactivity is expected on the Render free tier.
- If the first request is slow, retry once before treating it as a deployment failure.
