"""Reporting-view DDL shared by migration 0006 and the startup schema guard.

`reporting_website_leads` — people who submitted contact details through the
Blueprint Generator or Talk to an AI Agent.
`reporting_sales_enquiries` — contact, consultation, workshop, proposal and
human-handoff submissions with their operational follow-up fields.

Access: backend/service-role only. On PostgreSQL the hardening block enables
RLS on the underlying tables and revokes the Supabase anon/authenticated
roles from both views.
"""

WEBSITE_LEADS_VIEW = """
CREATE VIEW reporting_website_leads AS
SELECT
    s.id AS "EventID",
    l.id AS "ContactID",
    s.submitted_at AS "ReceivedAt",
    COALESCE(l.name, '') AS "Name",
    COALESCE(l.normalized_email, LOWER(l.email), '') AS "Email",
    COALESCE(l.phone, '') AS "Phone",
    COALESCE(l.company, '') AS "Company",
    COALESCE(l.role, '') AS "JobTitle",
    COALESCE(l.country, '') AS "Country",
    CASE s.source_type WHEN 'blueprint' THEN 'Blueprint' ELSE 'Talk to Agent' END AS "Source",
    COALESCE(s.blueprint_result_id, s.blueprint_request_id, '') AS "BlueprintID",
    COALESCE(s.chat_session_id, '') AS "AgentSessionID",
    COALESCE(s.objective_summary, '') AS "ObjectiveSummary",
    COALESCE(s.source_page, '') AS "SourcePage",
    COALESCE(s.utm_source, '') AS "UTMSource",
    COALESCE(s.utm_medium, '') AS "UTMMedium",
    COALESCE(s.utm_campaign, '') AS "UTMCampaign",
    COALESCE(s.consent_status, '') AS "ConsentStatus"
FROM lead_submissions s
JOIN leads l ON l.id = s.lead_id
WHERE s.source_type IN ('blueprint', 'talk_to_agent')
"""

SALES_ENQUIRIES_VIEW = """
CREATE VIEW reporting_sales_enquiries AS
SELECT
    s.id AS "EventID",
    l.id AS "ContactID",
    s.submitted_at AS "ReceivedAt",
    s.source_type AS "EnquiryType",
    COALESCE(l.name, cr.name, cb.name, '') AS "Name",
    COALESCE(l.normalized_email, LOWER(l.email), '') AS "Email",
    COALESCE(l.phone, '') AS "Phone",
    COALESCE(l.company, cr.company, cb.company, '') AS "Company",
    COALESCE(l.role, '') AS "JobTitle",
    COALESCE(l.country, '') AS "Country",
    COALESCE(cb.consultation_type, hr.handoff_type, '') AS "BusinessObjective",
    CASE WHEN s.source_type = 'workshop' THEN COALESCE(cb.notes, '') ELSE '' END AS "WorkshopTopic",
    '' AS "TeamSize",
    COALESCE(cb.preferred_date, '') AS "PreferredDate",
    COALESCE(cb.preferred_time, '') AS "PreferredTime",
    COALESCE(cb.timezone, '') AS "Timezone",
    COALESCE(s.objective_summary, '') AS "Message",
    COALESCE(s.source_page, '') AS "SourcePage",
    COALESCE(s.utm_source, '') AS "UTMSource",
    COALESCE(s.utm_medium, '') AS "UTMMedium",
    COALESCE(s.utm_campaign, '') AS "UTMCampaign",
    COALESCE(s.consent_status, '') AS "ConsentStatus",
    COALESCE(cr.status, cb.status, hr.status, 'new') AS "FollowUpStatus",
    '' AS "Owner",
    '' AS "LastContacted",
    '' AS "NextFollowUp",
    '' AS "InternalNotes"
FROM lead_submissions s
JOIN leads l ON l.id = s.lead_id
LEFT JOIN contact_requests cr ON cr.id = s.contact_request_id
LEFT JOIN consultation_bookings cb ON cb.id = s.consultation_booking_id
LEFT JOIN handoff_requests hr ON hr.id = s.handoff_request_id
WHERE s.source_type IN ('contact', 'consultation', 'workshop', 'proposal', 'human_handoff')
"""

# Same posture for the analytics + daily-report tables: the backend service
# role is the only reader/writer; Supabase anon/authenticated roles get
# nothing. RLS is enabled with no policies, so even a leaked anon key sees
# zero rows.
ANALYTICS_HARDENING = """
DO $$
BEGIN
    EXECUTE 'ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE daily_report_runs ENABLE ROW LEVEL SECURITY';
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
        EXECUTE 'REVOKE ALL ON analytics_events FROM anon';
        EXECUTE 'REVOKE ALL ON analytics_sessions FROM anon';
        EXECUTE 'REVOKE ALL ON daily_report_runs FROM anon';
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
        EXECUTE 'REVOKE ALL ON analytics_events FROM authenticated';
        EXECUTE 'REVOKE ALL ON analytics_sessions FROM authenticated';
        EXECUTE 'REVOKE ALL ON daily_report_runs FROM authenticated';
    END IF;
END
$$;
"""

POSTGRES_HARDENING = """
DO $$
BEGIN
    EXECUTE 'ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE excel_sync_outbox ENABLE ROW LEVEL SECURITY';
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
        EXECUTE 'REVOKE ALL ON reporting_website_leads FROM anon';
        EXECUTE 'REVOKE ALL ON reporting_sales_enquiries FROM anon';
        EXECUTE 'REVOKE ALL ON lead_submissions FROM anon';
        EXECUTE 'REVOKE ALL ON excel_sync_outbox FROM anon';
    END IF;
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
        EXECUTE 'REVOKE ALL ON reporting_website_leads FROM authenticated';
        EXECUTE 'REVOKE ALL ON reporting_sales_enquiries FROM authenticated';
        EXECUTE 'REVOKE ALL ON lead_submissions FROM authenticated';
        EXECUTE 'REVOKE ALL ON excel_sync_outbox FROM authenticated';
    END IF;
END
$$;
"""
