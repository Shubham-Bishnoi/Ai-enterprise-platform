# Excel Workbook Setup (one-time, manual)

The backend cannot modify the Microsoft 365 workbook, so these steps must be
done once by someone signed into the GFF AI Microsoft account, in the shared
workbook:

`https://netorgft20225718-my.sharepoint.com/:x:/g/personal/shubham_bishnoi_gffai_ai/IQBldnDPOwyrSJ9COYjf7GKDAduS7DWHWSjTTk3Xovli-og`

Supabase remains the master database — this workbook is a synchronized
reporting and follow-up view only. Do not hand-edit the data columns of
synced rows (the follow-up columns at the right of Sales Enquiries are yours
to edit).

## 1 — Create two worksheets

Add two worksheets named exactly:

1. `Website Leads`
2. `Sales Enquiries`

Preserve any unrelated existing sheets.

## 2 — Create the named tables

Power Automate writes into **named Excel Tables**, not plain cells.

### Worksheet “Website Leads” → table `tblWebsiteLeads`

1. In row 1, enter these headers, one per column, in this exact order:

   `EventID | ContactID | ReceivedAt | Name | Email | Phone | Company | JobTitle | Country | Source | BlueprintID | AgentSessionID | ObjectiveSummary | SourcePage | UTMSource | UTMMedium | UTMCampaign | ConsentStatus`

2. Select the header range (A1:R1), then **Insert → Table** with
   “My table has headers” ticked.
3. With the table selected, open **Table Design** and set the table name to
   `tblWebsiteLeads`.

### Worksheet “Sales Enquiries” → table `tblSalesEnquiries`

1. In row 1, enter:

   `EventID | ContactID | ReceivedAt | EnquiryType | Name | Email | Phone | Company | JobTitle | Country | BusinessObjective | WorkshopTopic | TeamSize | PreferredDate | PreferredTime | Timezone | Message | SourcePage | UTMSource | UTMMedium | UTMCampaign | ConsentStatus | FollowUpStatus | Owner | LastContacted | NextFollowUp | InternalNotes`

2. Insert → Table over A1:AA1 (headers ticked), name it `tblSalesEnquiries`.

## 3 — Recommended formatting

- Freeze row 1 (View → Freeze Panes → Freeze Top Row) on both sheets.
- Keep the tables' built-in filters and banded-row style.
- Format the `Email` column as **Text** on both sheets.
- Format `ReceivedAt` as a readable date-time (e.g. `yyyy-mm-dd hh:mm`).
- No merged cells inside the tables, no formulas in the data columns, and no
  decorative rows/columns inside or directly beneath the tables (they break
  row insertion).
- Protect the header row if desired (Review → Protect Sheet, allowing edits
  to the data range only).

## 4 — Sales Enquiries follow-up statuses

`FollowUpStatus` arrives as `New`. The team maintains it manually. Add
conditional formatting on that column so each value gets a distinct fill:

- `New` — blue
- `Contacted` — yellow
- `Qualified` — green
- `Meeting Scheduled` — teal
- `Closed` — grey
- `Not Proceeding` — red

These values are conventions for the team; the backend never requires them.

## 5 — Access

Restrict workbook sharing to authorized GFF AI personnel only (no “anyone
with the link can edit”). The Power Automate connection (next doc) runs as
the Microsoft account that owns the flow, which needs edit access to this
workbook.
