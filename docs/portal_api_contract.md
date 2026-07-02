# Portal API Contract

All endpoints return the standard envelope.

## Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/demo-login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Portal
- `GET /api/v1/portal/dashboard?client_type=`
- `GET /api/v1/portal/workspace`
- `GET /api/v1/portal/projects`
- `GET /api/v1/portal/projects/{project_id}`
- `GET /api/v1/portal/activity`
- `GET /api/v1/portal/analytics`
- `GET /api/v1/portal/ai-operations`
- `GET /api/v1/portal/governance`
- `GET /api/v1/portal/documents`
- `GET /api/v1/portal/support`
- `POST /api/v1/portal/support`

## Documents
- `GET /api/v1/documents`
- `GET /api/v1/documents/{document_id}`
- `POST /api/v1/documents/generate`
- `GET /api/v1/documents/{document_id}/download`

## Governance
- `GET /api/v1/governance/frameworks`
- `GET /api/v1/governance/controls`
- `GET /api/v1/governance/assessments`
- `POST /api/v1/governance/assessment`
- `GET /api/v1/governance/assessment/{id}`

## Support
- `GET /api/v1/support`
- `POST /api/v1/support`
