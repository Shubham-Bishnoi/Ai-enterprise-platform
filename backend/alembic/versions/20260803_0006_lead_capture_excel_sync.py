"""phase 5 lead capture + excel sync

Adds the normalized lead-capture layer without touching existing tables'
shape: identity/consent columns on `leads`, the immutable `lead_submissions`
event log, the `excel_sync_outbox`, and the two reporting views that back the
shared Excel workbook. On PostgreSQL (Supabase) the new tables get RLS
enabled with no policies — only the backend's service-role connection can
read or write them — and the anon/authenticated roles are revoked from the
reporting views.

Revision ID: 20260803_0006
Revises: 20260702_0005
Create Date: 2026-08-03 12:00:00
"""

from alembic import op
import sqlalchemy as sa

revision = "20260803_0006"
down_revision = "20260702_0005"
branch_labels = None
depends_on = None

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


def upgrade() -> None:
    with op.batch_alter_table("leads") as batch_op:
        batch_op.add_column(sa.Column("normalized_email", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("country", sa.String(length=128), nullable=True))
        batch_op.add_column(sa.Column("consent_status", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("marketing_consent", sa.Boolean(), nullable=False, server_default=sa.false()))
        batch_op.add_column(sa.Column("privacy_policy_version", sa.String(length=32), nullable=True))
        batch_op.create_index("ix_leads_normalized_email", ["normalized_email"])

    op.execute("UPDATE leads SET normalized_email = LOWER(TRIM(email)) WHERE email IS NOT NULL")

    op.create_table(
        "lead_submissions",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("lead_id", sa.String(), sa.ForeignKey("leads.id"), nullable=False),
        sa.Column("source_type", sa.String(length=32), nullable=False),
        sa.Column("source_page", sa.String(length=512), nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("blueprint_request_id", sa.String(length=64), nullable=True),
        sa.Column("blueprint_result_id", sa.String(length=64), nullable=True),
        sa.Column("chat_session_id", sa.String(length=64), nullable=True),
        sa.Column("contact_request_id", sa.String(length=64), nullable=True),
        sa.Column("consultation_booking_id", sa.String(length=64), nullable=True),
        sa.Column("handoff_request_id", sa.String(length=64), nullable=True),
        sa.Column("objective_summary", sa.String(length=500), nullable=True),
        sa.Column("utm_source", sa.String(length=255), nullable=True),
        sa.Column("utm_medium", sa.String(length=255), nullable=True),
        sa.Column("utm_campaign", sa.String(length=255), nullable=True),
        sa.Column("referrer", sa.String(length=512), nullable=True),
        sa.Column("consent_status", sa.String(length=64), nullable=True),
        sa.Column("marketing_consent", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("dedupe_hash", sa.String(length=64), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=False),
    )
    op.create_index("ix_lead_submissions_lead_id", "lead_submissions", ["lead_id"])
    op.create_index("ix_lead_submissions_source_type", "lead_submissions", ["source_type"])
    op.create_index("ix_lead_submissions_submitted_at", "lead_submissions", ["submitted_at"])
    op.create_index("ix_lead_submissions_dedupe_hash", "lead_submissions", ["dedupe_hash"])

    op.create_table(
        "excel_sync_outbox",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("event_id", sa.String(length=64), nullable=False),
        sa.Column("sheet_key", sa.String(length=32), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("attempt_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("next_attempt_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_error", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("synced_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_excel_sync_outbox_event_id", "excel_sync_outbox", ["event_id"], unique=True)
    op.create_index("ix_excel_sync_outbox_sheet_key", "excel_sync_outbox", ["sheet_key"])
    op.create_index("ix_excel_sync_outbox_status", "excel_sync_outbox", ["status"])
    op.create_index("ix_excel_sync_outbox_next_attempt_at", "excel_sync_outbox", ["next_attempt_at"])

    op.execute(WEBSITE_LEADS_VIEW)
    op.execute(SALES_ENQUIRIES_VIEW)

    if op.get_bind().dialect.name == "postgresql":
        op.execute(POSTGRES_HARDENING)


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS reporting_sales_enquiries")
    op.execute("DROP VIEW IF EXISTS reporting_website_leads")
    op.drop_table("excel_sync_outbox")
    op.drop_table("lead_submissions")
    with op.batch_alter_table("leads") as batch_op:
        batch_op.drop_index("ix_leads_normalized_email")
        batch_op.drop_column("privacy_policy_version")
        batch_op.drop_column("marketing_consent")
        batch_op.drop_column("consent_status")
        batch_op.drop_column("country")
        batch_op.drop_column("normalized_email")
