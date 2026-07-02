# Phase 5 — Hardening Plan

## Error Handling
- Continue using `APIResponse` envelope everywhere.
- Keep `register_error_handlers` as the single choke point for unexpected errors.
- Analytics calls remain best-effort only on the frontend.

## Rate Limiting (Placeholder)
- Add `RateLimitService` hook for future per-IP/per-token limits.
- Production recommendation: reverse-proxy rate limiting (NGINX/Cloudflare) + app-level per-route budgets.

## Notifications (Provider-ready)
- Provider interfaces for email: Resend, SendGrid, SES.
- No keys in repo; configured via env vars at deploy time.

## Calendar (Provider-ready)
- Provider interfaces for Google Calendar, Calendly, Microsoft Outlook.

## CRM (Provider-ready)
- Provider interfaces for HubSpot, Salesforce, Zoho.

## PDF Export
- Current: blueprint export creates a document record and HTML report payload.
- Next: Playwright HTML-to-PDF or WeasyPrint (evaluate security + runtime footprint).

## Admin/CMS Readiness
- Content models have `status`, `sort_order`, and `metadata_json` for future CMS/admin UI.
