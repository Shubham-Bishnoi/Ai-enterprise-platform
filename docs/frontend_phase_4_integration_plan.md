# Frontend Phase 4 Integration Plan

## Portal UX Flow
- Default: portal loads a premium preview cockpit (no auth required).
- Demo mode: user selects a client type and clicks “Enter Demo Workspace”.
- Token is stored in `localStorage.gff_portal_token`.
- Portal then calls `/api/v1/portal/dashboard?client_type=...`.

## Client Type Personalization
- Selected type persists in `localStorage.gff_portal_client_type`.
- Dashboard subtitle, modules, governance focus, and next actions are driven by backend `personalization`.

## Support Requests
- Support modal posts to `/api/v1/portal/support`.
- UI refreshes dashboard after submit.

## Safety
- Any backend failure keeps the preview cockpit (fallback) and shows a friendly message.
