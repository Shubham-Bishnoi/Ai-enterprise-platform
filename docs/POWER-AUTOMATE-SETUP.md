# Power Automate Flow Setup — “GFFAI Supabase Lead Sync”

One flow bridges the backend outbox to the shared workbook. Microsoft Graph's
Excel row API does not support application-only permissions, so Power
Automate (Excel Online Business connector, delegated) is the supported
unattended path. Complete `docs/EXCEL-WORKBOOK-SETUP.md` first.

## 1 — Create the flow

Power Automate → **Create → Instant cloud flow → When an HTTP request is
received** (trigger: *Anyone* can trigger — protection is the secret header
check below). Name it `GFFAI Supabase Lead Sync`.

Trigger **Request Body JSON Schema**:

```json
{
  "type": "object",
  "properties": {
    "schemaVersion": { "type": "string" },
    "eventId": { "type": "string" },
    "sheetKey": { "type": "string" },
    "row": { "type": "object" }
  },
  "required": ["eventId", "sheetKey", "row"]
}
```

## 2 — Validate the secret header

Add a **Condition** as the first step:

- Left: expression `triggerOutputs()?['headers']?['X-GFFAI-Webhook-Secret']`
- Condition: *is equal to*
- Right: the secret you generate (long random string — the same value you
  will place in the backend env var `EXCEL_SYNC_WEBHOOK_SECRET`).

**If no** → action **Response**: status `401`, body
`{"ok": false, "error": "invalid secret"}` → **Terminate** (Failed is fine).

All remaining steps live in the **If yes** branch.

## 3 — Idempotency check (duplicate deliveries must not duplicate rows)

The backend retries deliveries, so the same `eventId` can arrive twice.

1. Action **List rows present in a table** (Excel Online (Business)):
   - Location: the SharePoint/OneDrive for Business site holding the workbook
   - Document Library / File: the shared workbook
   - Table: `tblWebsiteLeads`
   - Filter Query: `EventID eq '@{triggerBody()?['eventId']}'`
2. A second **List rows present in a table** for `tblSalesEnquiries` with the
   same filter.
3. **Condition**: `length(outputs('List_rows_website')?['body/value'])` is
   greater than 0 **or** the same for the sales list.
   - **If yes** → **Response** status `200`, body
     `{"ok": true, "duplicate": true, "eventId": "@{triggerBody()?['eventId']}"}`
     → Terminate (Succeeded). This is the idempotent success path.

## 4 — Route by sheetKey

Add a **Switch** on `triggerBody()?['sheetKey']`:

### Case `website_leads` → **Add a row into a table** → `tblWebsiteLeads`

Map every column from `triggerBody()?['row']?['<Column>']`:

`EventID, ContactID, ReceivedAt, Name, Email, Phone, Company, JobTitle,
Country, Source, BlueprintID, AgentSessionID, ObjectiveSummary, SourcePage,
UTMSource, UTMMedium, UTMCampaign, ConsentStatus`

Example expression for one field: `triggerBody()?['row']?['Email']`

### Case `sales_enquiries` → **Add a row into a table** → `tblSalesEnquiries`

Map: `EventID, ContactID, ReceivedAt, EnquiryType, Name, Email, Phone,
Company, JobTitle, Country, BusinessObjective, WorkshopTopic, TeamSize,
PreferredDate, PreferredTime, Timezone, Message, SourcePage, UTMSource,
UTMMedium, UTMCampaign, ConsentStatus, FollowUpStatus, Owner, LastContacted,
NextFollowUp, InternalNotes`

### Default case

**Response** status `400`, body `{"ok": false, "error": "unknown sheetKey"}`.

### After the Switch

**Response** status `200`, body
`{"ok": true, "eventId": "@{triggerBody()?['eventId']}"}`.

## 5 — Concurrency and retries

- Trigger → Settings → **Concurrency Control: On, Degree of Parallelism: 1**
  (Excel locks the workbook during writes; parallel appends cause 409s).
- On both “Add a row” actions → Settings → Retry Policy: Fixed, 3 retries,
  20-second interval (the backend also retries with backoff, so keep this
  modest).

## 6 — Wire the backend

1. Save the flow, copy the generated **HTTP POST URL**.
2. On Render (gff-ai-backend → Environment) set:

   ```env
   EXCEL_SYNC_ENABLED=true
   EXCEL_SYNC_WEBHOOK_URL=<the copied flow URL>
   EXCEL_SYNC_WEBHOOK_SECRET=<the same secret used in step 2>
   ```

   Optional tuning (defaults shown): `EXCEL_SYNC_BATCH_SIZE=25`,
   `EXCEL_SYNC_MAX_ATTEMPTS=8`, `EXCEL_SYNC_POLL_SECONDS=30`.
3. Saving env vars restarts the backend; the worker starts automatically
   (log line: `excel_sync worker started`).

Never commit the URL or secret to the repository, and never expose them to
the frontend.

## 7 — Test procedure

1. Submit the site's contact form with a test email.
2. Within ~30 s the row should appear in `tblSalesEnquiries`.
3. Submit a Blueprint with a test email → row in `tblWebsiteLeads`.
4. Re-deliver manually (backend: `python -m app.cli.lead_excel_sync retry --event-id <id>`)
   → the flow answers `duplicate: true` and no second row appears.
5. Send a request without the secret header (curl) → 401 and no row.
6. Check state anytime with `python -m app.cli.lead_excel_sync status`.

## 8 — If the tenant blocks the HTTP-request trigger

Some tenants disable “When an HTTP request is received”. The closest approved
alternative: replace the trigger with **When an item is created in SharePoint
list** and have IT approve a premium HTTP trigger, or schedule a flow that
polls a Supabase REST endpoint. If you hit this, the backend outbox is
unaffected — only the delivery bridge changes. Report the blocker before
choosing an alternative; do not fall back to sharing the workbook publicly or
embedding Microsoft credentials in the backend.
