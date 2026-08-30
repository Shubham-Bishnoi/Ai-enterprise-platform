"""analytics sessions + daily report runs

Extends the existing `analytics_events` table with idempotency, anonymous
visitor identifiers, entity references and a client-reported timestamp; adds
`analytics_sessions` (privacy-safe anonymous sessions — no IPs, no
fingerprints) and `daily_report_runs` (one row per attempted daily activity
email, unique per report date + timezone so duplicate reports are impossible).

On PostgreSQL (Supabase) all three tables get RLS enabled with no policies —
only the backend's service-role connection can read or write them — and the
anon/authenticated roles are revoked.

Revision ID: 20260830_0007
Revises: 20260803_0006
Create Date: 2026-08-30 12:00:00
"""

from alembic import op
import sqlalchemy as sa

revision = "20260830_0007"
down_revision = "20260803_0006"
branch_labels = None
depends_on = None

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


def upgrade() -> None:
    with op.batch_alter_table("analytics_events") as batch_op:
        batch_op.add_column(sa.Column("event_id", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("anonymous_id", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("visitor_session_id", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("entity_type", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("entity_id", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=True))

    op.create_index("ix_analytics_events_event_id", "analytics_events", ["event_id"], unique=True)
    op.create_index("ix_analytics_events_anonymous_id", "analytics_events", ["anonymous_id"])
    op.create_index("ix_analytics_events_visitor_session_id", "analytics_events", ["visitor_session_id"])
    op.create_index("ix_analytics_events_occurred_at", "analytics_events", ["occurred_at"])
    op.create_index("ix_analytics_events_created_at", "analytics_events", ["created_at"])
    op.create_index("ix_analytics_events_page_path", "analytics_events", ["page_path"])
    op.create_index("ix_analytics_events_entity", "analytics_events", ["entity_type", "entity_id"])

    op.create_table(
        "analytics_sessions",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("session_key", sa.String(length=64), nullable=False),
        sa.Column("anonymous_id", sa.String(length=64), nullable=True),
        sa.Column("authenticated_user_id", sa.String(length=64), nullable=True),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("landing_page", sa.String(length=512), nullable=True),
        sa.Column("referrer", sa.String(length=512), nullable=True),
        sa.Column("utm_source", sa.String(length=255), nullable=True),
        sa.Column("utm_medium", sa.String(length=255), nullable=True),
        sa.Column("utm_campaign", sa.String(length=255), nullable=True),
        sa.Column("utm_term", sa.String(length=255), nullable=True),
        sa.Column("utm_content", sa.String(length=255), nullable=True),
        sa.Column("device_category", sa.String(length=32), nullable=True),
        sa.Column("browser_category", sa.String(length=32), nullable=True),
        sa.Column("country_code", sa.String(length=8), nullable=True),
        sa.Column("consent_status", sa.String(length=64), nullable=False, server_default="essential_analytics"),
        sa.Column("page_view_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_analytics_sessions_session_key", "analytics_sessions", ["session_key"], unique=True)
    op.create_index("ix_analytics_sessions_anonymous_id", "analytics_sessions", ["anonymous_id"])
    op.create_index("ix_analytics_sessions_first_seen_at", "analytics_sessions", ["first_seen_at"])
    op.create_index("ix_analytics_sessions_last_seen_at", "analytics_sessions", ["last_seen_at"])

    op.create_table(
        "daily_report_runs",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("report_date", sa.Date(), nullable=False),
        sa.Column("timezone", sa.String(length=64), nullable=False, server_default="Asia/Kolkata"),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="running"),
        sa.Column("recipients", sa.JSON(), nullable=False),
        sa.Column("totals", sa.JSON(), nullable=False),
        sa.Column("provider_message_id", sa.String(length=128), nullable=True),
        sa.Column("attempt_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("next_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("report_date", "timezone", name="uq_daily_report_date_tz"),
    )
    op.create_index("ix_daily_report_runs_report_date", "daily_report_runs", ["report_date"])
    op.create_index("ix_daily_report_runs_status", "daily_report_runs", ["status"])

    if op.get_bind().dialect.name == "postgresql":
        op.execute(ANALYTICS_HARDENING)


def downgrade() -> None:
    op.drop_table("daily_report_runs")
    op.drop_table("analytics_sessions")
    op.drop_index("ix_analytics_events_entity", table_name="analytics_events")
    op.drop_index("ix_analytics_events_page_path", table_name="analytics_events")
    op.drop_index("ix_analytics_events_created_at", table_name="analytics_events")
    op.drop_index("ix_analytics_events_occurred_at", table_name="analytics_events")
    op.drop_index("ix_analytics_events_visitor_session_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_anonymous_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_event_id", table_name="analytics_events")
    with op.batch_alter_table("analytics_events") as batch_op:
        batch_op.drop_column("occurred_at")
        batch_op.drop_column("entity_id")
        batch_op.drop_column("entity_type")
        batch_op.drop_column("visitor_session_id")
        batch_op.drop_column("anonymous_id")
        batch_op.drop_column("event_id")
