# Phase 4 — Client Portal, Auth, Documents, Governance

## Summary
- Adds demo auth foundation (signed token), seeded demo users, and portal APIs.
- Adds portal workspace, projects, documents, governance, and support models with seed data.
- Redesigns `/portal` into a premium glassmorphic cockpit that adapts to client type.

## Auth (Demo)
- `POST /api/v1/auth/demo-login` issues a demo token for a selected `client_type`.
- `GET /api/v1/auth/me` returns user profile for the token.
- Tokens are stored client-side in `localStorage.gff_portal_token` for the demo environment.

## Portal
- `GET /api/v1/portal/dashboard?client_type=` returns cockpit dashboard payload.
- Includes personalization fields and demo-safe metrics.

## Documents
- `GET /api/v1/documents`
- `POST /api/v1/documents/generate` creates a placeholder document record.
- `GET /api/v1/documents/{id}/download` returns download metadata (no file generation yet).

## Governance
- `GET /api/v1/governance/frameworks`
- `GET /api/v1/governance/controls`
- `GET /api/v1/governance/assessments`
- `POST /api/v1/governance/assessment` creates a computed assessment.

## Blueprint Export Foundation
- `POST /api/v1/blueprint/{id}/export` now attempts to create a portal document record containing:
  - `report_json`
  - `report_html` (simple template)
- PDF rendering remains TODO for Phase 5 hardening.
