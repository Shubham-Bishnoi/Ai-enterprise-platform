# GFF AI Lead-Data Audit

Audited 2026-08-03 against the deployed stack (Next.js frontend on Vercel →
FastAPI backend on Render → Supabase Postgres). Every claim below was verified
by reading the full path: frontend component → API request → backend
validation → service → SQLAlchemy model → committed row. Nothing here is
assumed from table names.

## Existing Supabase tables that receive lead-related records

| Table | Model | Purpose |
|---|---|---|
| `leads` | `app/models/lead.py` | One row per person, upserted case-insensitively by email (`LeadRepository.get_by_email` uses `lower()`), with first/last-seen timestamps and merged metadata |
| `contact_requests` | `app/models/contact.py` | One immutable row per contact-form submission (name, email, intent, message, source, `lead_id`) |
| `consultation_bookings` | `app/models/consultation.py` | Consultation bookings (type, preferred date/time/timezone, notes, `lead_id`) |
| `handoff_requests` | `app/models/handoff.py` | Human handoffs (type, summary, `chat_session_id`, `blueprint_result_id`, `lead_id`) |
| `blueprint_requests` / `blueprint_results` | `app/models/blueprint.py` | Blueprint submissions and generated results, `lead_id` linked |
| `chat_sessions` / `chat_messages` | `app/models/chat.py` | Talk-to-Agent sessions and transcripts (no email) |
| `analytics_events` | `app/models/analytics.py` | Click/interaction events (`event_name`, `source`, `component`, payload, `ip_hash` — raw IPs are not stored) |

Schema created by Alembic migrations `0001–0005`; the app also runs
`create_db_and_tables()` (SQLAlchemy `create_all`) at startup.

## Journey-by-journey findings

| # | Journey | Frontend component | API endpoint | Backend service | Supabase table(s) | Email stored? | Other fields | Working? | Missing work |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Blueprint email submission | `components/home/blueprint-section.tsx` (email required + regex-validated) | `POST /api/v1/blueprint/generate` | `BlueprintService` → `LeadService.upsert_lead` | `blueprint_requests`, `blueprint_results`, `leads` | Yes (required) | name, company, industry, objectives | **Yes — verified end-to-end** | No UTM/consent; no unified submission record; no Excel sync |
| 2 | Talk-to-Agent email submission | `components/home/talk-to-agent-section.tsx` | `/api/v1/agents/session`, `/agents/chat` | `ChatService` | `chat_sessions`, `chat_messages`, `analytics_events` | **No — there is no email-capture UI in the chat** | transcript, agent id | Chat works; **lead capture does not exist** | Voluntary email-capture / human-expert UI; the `/api/v1/handoff` endpoint exists but nothing in the UI calls it |
| 3 | Contact form | `components/contact/contact-form.tsx` | `POST /api/v1/contact` | `ContactService` → `LeadService` | `contact_requests`, `leads` | Yes (required, validated server-side) | name, company, intent, message, source=`contact_page` | **Yes — verified** | No consent capture, no UTM |
| 4 | Consultation request | Contact form intent chip “Book Consultation” → same `/api/v1/contact` (intent `book_consultation`) | as above | as above | `contact_requests` | Yes | intent preserved | **Yes, via contact form** | A dedicated `POST /api/v1/consultation/book` endpoint + `consultation_bookings` table exist but **no UI uses them** |
| 5 | Workshop booking | Contact form intent chip “Book Workshop” (Build-With-GFF “Book a Workshop” links to `/contact`) | `/api/v1/contact` (intent `book_workshop`) | as above | `contact_requests` | Yes | intent preserved | **Yes, via contact form** | Same as above; no dedicated fields (topic/team size) in the form |
| 6 | Proposal request | **No UI exists** | `/api/v1/handoff` supports `handoff_type='proposal'` | `HandoffService` | `handoff_requests` | Optional in schema | — | **Not reachable by a visitor** | Needs an entry point (added: “Request Proposal” intent on the contact form) |
| 7 | Human-expert handoff | **No UI exists** | `/api/v1/handoff` (`human_expert`) | `HandoffService` → `LeadService` (when email present) | `handoff_requests`, `leads` | Optional | summary, chat_session_id | **Not reachable by a visitor** | Needs UI in the chat (added in this work) |

## Cross-cutting findings

- **Success is only shown after a confirmed insert.** The contact form awaits
  the API response before rendering “Message received”; services commit before
  responding. The blueprint UI shows results only after the backend returns
  the persisted result. No form fakes success.
- **Email validation:** server-side regex validator (`app/schemas/leads.py`)
  on contact, consultation, handoff and blueprint schemas. Emails were **not
  normalised (lower-cased/trimmed) at rest** — only compared
  case-insensitively on upsert. Fixed in this work (`normalized_email`).
- **Duplicates:** person-level dedupe exists (case-insensitive upsert into
  `leads`); every submission correctly creates its own immutable row in the
  per-type tables. There was **no idempotency guard against double-click
  duplicate posts** (added: short-window duplicate suppression on the new
  submission layer).
- **Consent:** **not captured anywhere** before this work.
- **UTM / referrer / source page:** **not captured anywhere** before this
  work (only a free-text `source` label).
- **Anonymous clicks** (e.g. “Book Workshop” button clicks) are recorded as
  `analytics_events` only — they never enter lead tables, and are excluded
  from the Excel sync by design.
- **Rate limiting:** `rate_limit_service.py` exists but is not applied to the
  public lead endpoints. Render/Cloudflare provide network-level protection;
  the new duplicate-suppression window addresses double-submits. Full
  per-IP rate limiting remains a recommended follow-up.
- **Missing migrations before this work:** none — schema and code matched.
  This work adds migration `0006` (lead identity columns, `lead_submissions`,
  `excel_sync_outbox`, two reporting views).

## Conclusion

Journeys 1, 3, 4 and 5 were already saving correctly. Journey 2 (Talk-to-Agent
lead capture), 6 (Proposal) and 7 (Human handoff) had complete backend support
but **no way for a visitor to reach them**, and no journey captured consent or
attribution. There was no unified submission log and no Excel/reporting layer.
The remainder of this implementation adds those pieces without renaming,
deleting or restructuring any existing production table.
