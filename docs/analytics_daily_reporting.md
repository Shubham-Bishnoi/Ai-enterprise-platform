# Website Analytics, Lead Tracking & Daily Email Reporting

End-to-end description of the analytics + daily-report system added in
migration `20260830_0007`, how to deploy it, test it, and roll it back.

## Architecture

```
Website (Next.js on Vercel)
  → trackEvent()  — typed taxonomy, event_id idempotency, anonymous session ids
  → POST /api/v1/analytics/events  (FastAPI on Render; allowlist, rate limit,
                                    payload cap, bot filter, salted-hash keys)
  → Supabase Postgres  (analytics_events, analytics_sessions — RLS enabled,
                        anon/authenticated revoked; service connection only)
  → report metrics service  (previous IST calendar day, Python aggregation)
  → daily scheduler  (in-process loop @ 23:55 Asia/Kolkata, plus a
                      secret-protected HTTP trigger as external-cron backup)
  → Resend  → ashish.chandra@gffai.ai, malvika.singh@gffai.ai
  → daily_report_runs  (unique per report_date+timezone → no duplicate emails)
```

Supabase remains the source of truth. Existing tables are reused, not
duplicated: `leads` + `lead_submissions` stay authoritative for every
conversion journey (blueprint, talk-to-agent, contact, consultation,
workshop, proposal, human handoff); analytics rows only reference them.

## Privacy rules enforced

- Anonymous visitors: only a browser-generated anonymous id + rotating
  session id, page paths, event names, timestamps, referrer/UTM, device and
  browser category, consent state. No identity claims, ever.
- Raw IPs are never stored. A salted SHA-256 hash (salt = `SECRET_KEY`) is
  used for rate limiting and abuse control only.
- Lead details appear in reports only when voluntarily submitted via a form.
- Chat transcripts and full AI content never enter analytics or emails —
  `objective_summary` (max 500 chars, 200 in email) is the only free text.
- RLS is enabled with zero policies on `analytics_events`,
  `analytics_sessions`, `daily_report_runs` (plus the existing lead tables);
  Supabase `anon`/`authenticated` roles are revoked. Only the backend's
  service connection reads or writes them.

## Environment variables (backend / Render)

| Variable | Purpose |
| --- | --- |
| `REPORT_ENABLED` | `true` to start the in-process daily scheduler |
| `REPORT_RECIPIENTS` | Comma-separated production recipients |
| `REPORT_FROM_EMAIL` | Verified Resend sender, e.g. `GFF AI Reports <reports@gffai.ai>` |
| `REPORT_TIMEZONE` | `Asia/Kolkata` |
| `REPORT_SEND_HOUR` / `REPORT_SEND_MINUTE` | Local send time (default 23:55) |
| `REPORT_MAX_ATTEMPTS` | Delivery retries before a run parks as `dead` (default 5) |
| `RESEND_API_KEY` | Server-side only. Never in the frontend |
| `DAILY_REPORT_SECRET` | Long random string protecting `/api/v1/reports/*` |
| `REPORT_TEST_RECIPIENT` | The only address test reports may go to |
| `ADMIN_DASHBOARD_URL` | Optional link shown in the report email |
| `ANALYTICS_RATE_LIMIT_PER_MINUTE` | Ingestion rate limit per salted key (default 120) |
| `ANALYTICS_PAYLOAD_MAX_BYTES` | Event payload cap (default 8192) |

No new frontend env vars: the tracking client reuses `NEXT_PUBLIC_API_BASE_URL`.

## Deployment steps

1. **Migrate the database** (or rely on the startup schema guard, which
   applies the same DDL idempotently on deploy):
   ```bash
   cd backend && alembic upgrade head
   ```
2. **Resend setup**: create an API key at resend.com; verify the sending
   domain (`gffai.ai`) — add the DKIM/SPF DNS records Resend shows for the
   domain, wait for "Verified". Until verified, use the Resend sandbox sender
   for tests only.
3. **Set Render env vars** (see table). Keep `REPORT_ENABLED=false` until the
   test email has been reviewed.
4. **External cron backup (recommended — the free Render instance sleeps)**:
   schedule an HTTPS POST at 00:05 IST daily (18:35 UTC) from cron-job.org,
   GitHub Actions, or Supabase `pg_cron` + `pg_net`:
   ```
   POST https://gff-ai-backend.onrender.com/api/v1/reports/daily/trigger
   Header: X-Report-Secret: <DAILY_REPORT_SECRET>
   Body: {}
   ```
   With no `report_date` it sends the previous IST day; the run table makes
   the call idempotent, so the in-process scheduler and the cron can never
   double-send. Supabase pg_cron example:
   ```sql
   select cron.schedule('gffai-daily-report', '35 18 * * *', $$
     select net.http_post(
       url := 'https://gff-ai-backend.onrender.com/api/v1/reports/daily/trigger',
       headers := '{"Content-Type":"application/json","X-Report-Secret":"<SECRET>"}'::jsonb,
       body := '{}'::jsonb);
   $$);
   ```
5. **Send a test report** (never hits production recipients):
   ```bash
   cd backend
   PYTHONPATH=".:../ai" python -m app.cli.daily_report seed-fake    # optional fake data
   PYTHONPATH=".:../ai" python -m app.cli.daily_report send-test    # -> REPORT_TEST_RECIPIENT only
   ```
6. Review the test email, **verify the recipient addresses**, then set
   `REPORT_ENABLED=true` and redeploy.

## Scheduling semantics

- The in-process loop ticks every `REPORT_POLL_SECONDS`. At/after 23:55 IST
  it sends **that day's** report (window: IST midnight → midnight; events in
  the final five minutes land in the next catch-up run's data if the send
  happens at 23:55 exactly).
- On startup/each tick it also back-fills **yesterday** if it was never sent
  (Render sleep/restart protection) and retries `failed` runs with
  exponential backoff (2m → 30m cap) until `REPORT_MAX_ATTEMPTS`.
- Zero-activity days still send, stating: *"No website activity or lead
  submissions were recorded today."*

## Reporting API (all require `X-Report-Secret`)

- `POST /api/v1/reports/daily/trigger` — `{report_date?, force?, test_recipient?}`
- `GET  /api/v1/reports/daily/status` — last 30 run rows
- `GET  /api/v1/reports/summary?days=N` — per-day metrics JSON (dashboard-ready;
  no public admin UI is added because the repo has no authenticated admin area —
  this endpoint is the prepared foundation for one)

## Event taxonomy

Canonical names live in `backend/app/core/event_taxonomy.py` and
`frontend/app/lib/analytics/events.ts` (change together — the backend rejects
unknown names). Server-side services additionally record authoritative
`blueprint_generate_started/completed/failed`, `talk_to_agent_*` events; the
report counts those and dedupes against client events by chat-session id.

## Manual testing checklist

- [ ] Visit the site → `analytics_sessions` gains one row; `page_viewed`
      events appear with `visitor_session_id`, no raw IP anywhere.
- [ ] Reload the page → no duplicate `session_started` (30-min idle rotation).
- [ ] Open Talk to Agent, send a message, close → `talk_to_agent_opened`,
      `agent_conversation_started`, `agent_conversation_completed`.
- [ ] Fill Blueprint form → `blueprint_opened`, `blueprint_started`, then
      server `blueprint_generate_started/completed`; download → `blueprint_downloaded`.
- [ ] Submit Contact with intent "Book Workshop" → lead row + submission +
      `contact_form_submitted` + `workshop_booking_submitted`.
- [ ] Kill the backend mid-submit → form shows the error UI and a
      `form_submission_failed` event arrives after recovery (analytics never
      blocks the user).
- [ ] `POST /reports/daily/trigger` without the secret → 401.
- [ ] CLI `send-test` with `REPORT_TEST_RECIPIENT` set → one email, correct
      IST date, lead table populated; run again → `sent` row reused, no email.
- [ ] Zero-activity date trigger → email contains the explicit zero-activity
      sentence.

## Rollback

1. Set `REPORT_ENABLED=false` (stops the scheduler; trigger endpoint stays
   secret-protected) and/or remove `DAILY_REPORT_SECRET` (404s the API).
2. Frontend tracking is fire-and-forget: reverting the frontend deploy
   removes new events; old bundles keep working (legacy names stay accepted).
3. Schema: `cd backend && alembic downgrade 20260803_0006` drops
   `analytics_sessions`, `daily_report_runs` and the new `analytics_events`
   columns. No pre-existing table shape is touched.
4. Data captured meanwhile can be deleted with plain SQL; nothing else
   references the new tables.
