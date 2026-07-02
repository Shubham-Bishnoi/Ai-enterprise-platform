# Phase 2: Contact, Leads, Consultation, Handoff, and Analytics

## Scope
- Adds backend conversion systems for leads, contact requests, consultation bookings, handoff requests, and analytics summaries.
- Extends existing Phase 0/1 structures instead of rebuilding architecture.
- Connects the existing frontend contact forms and major CTA actions to backend capture flows.

## Backend Implementation
- `Lead` now stores richer profile and lifecycle data: phone, role, industry, company size, lifecycle stage, first seen, last seen, and updated timestamps.
- `AnalyticsEvent` now supports `lead_id`, `page_path`, `component`, `user_agent`, and `ip_hash`.
- New request tables:
  - `ContactRequest`
  - `ConsultationBooking`
  - `HandoffRequest`
- New services:
  - `LeadService`
  - `ContactService`
  - `ConsultationService`
  - `HandoffService`
  - `NotificationService`
- Existing Blueprint and Talk-to-Agent handoff flows now reuse the shared `HandoffService`.

## Lead Lifecycle
- Supported lifecycle stages:
  - `visitor`
  - `lead`
  - `mql`
  - `sql`
  - `customer`
- Supported lead status examples:
  - `new`
  - `contacted`
  - `qualified`
  - `workshop_requested`
  - `proposal_requested`
  - `converted`
  - `closed`
- Lead upsert behavior:
  - Reuses the same lead for the same email.
  - Fills in missing fields without overwriting good existing values.
  - Updates `last_seen_at` on every conversion touchpoint.

## Contact Flow
- `POST /api/v1/contact`
- Validates email and message length.
- Creates or updates a lead.
- Stores a `ContactRequest`.
- Captures `contact_request_created`.
- Uses a notification placeholder for future email/CRM routing.

## Consultation Flow
- `POST /api/v1/consultation/book`
- Creates or updates a lead.
- Stores a `ConsultationBooking` with status `requested`.
- Captures `consultation_requested`.
- `GET /api/v1/consultation/slots` returns a Phase 2 placeholder response until calendar integration is added.

## Handoff Flow
- `POST /api/v1/handoff`
- Supports:
  - `human_expert`
  - `proposal`
  - `workshop`
  - `blueprint_review`
  - `architecture_review`
  - `governance_review`
  - `pilot_program`
- Creates or updates a lead when an email is available.
- Links to `chat_session_id` and `blueprint_result_id` when provided.
- Existing `POST /api/v1/agents/handoff` and `POST /api/v1/blueprint/{id}/handoff` now persist through the same shared service.

## Analytics Flow
- `POST /api/v1/analytics/events` remains best-effort for the frontend.
- `GET /api/v1/analytics/summary` returns:
  - total leads
  - total contact requests
  - total consultation bookings
  - total handoff requests
  - total blueprint generated events
  - total agent message events
- Frontend CTA tracking added for hero actions, contact submissions, talk-agent next actions, blueprint next actions, resource clicks, and general CTA/navigation clicks.

## Notification Placeholder
- `NotificationService` logs placeholder events for:
  - contact request created
  - consultation requested
  - handoff requested
  - newsletter subscribed
- Real provider integration can later be added with Resend, SendGrid, or AWS SES.
- No email API keys are hard-coded.

## Frontend Integration
- Existing contact page form now posts to `/api/v1/contact`.
- Existing homepage contact section now posts to `/api/v1/contact` using the current visible fields.
- Blueprint next actions now:
  - book workshop via `/api/v1/consultation/book`
  - request proposal via `/api/v1/handoff`
  - keep export/email on existing placeholder endpoints
- Talk-to-Agent next actions keep the current UI flow but now emit Phase 2 CTA analytics while backend handoff persistence goes through the shared handoff service.

## Future Integrations
- CRM sync for leads and contact routing.
- Calendar slot provider for consultations.
- Real email delivery for consultation and handoff notifications.
- Newsletter capture once a frontend subscription form exists.
