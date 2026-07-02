"""phase 2 contact leads analytics

Revision ID: 20260701_0003
Revises: 20260701_0002
Create Date: 2026-07-01 00:30:00
"""

from alembic import op
import sqlalchemy as sa

revision = "20260701_0003"
down_revision = "20260701_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("leads") as batch_op:
        batch_op.add_column(sa.Column("phone", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("role", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("industry", sa.String(length=128), nullable=True))
        batch_op.add_column(sa.Column("company_size", sa.String(length=64), nullable=True))
        batch_op.add_column(
            sa.Column("lifecycle_stage", sa.String(length=64), nullable=False, server_default="visitor")
        )
        batch_op.add_column(
            sa.Column("first_seen_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now())
        )
        batch_op.add_column(
            sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now())
        )
        batch_op.add_column(
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now())
        )
        batch_op.create_index("ix_leads_email", ["email"])

    with op.batch_alter_table("analytics_events") as batch_op:
        batch_op.add_column(sa.Column("lead_id", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("page_path", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("component", sa.String(length=128), nullable=True))
        batch_op.add_column(sa.Column("user_agent", sa.String(length=512), nullable=True))
        batch_op.add_column(sa.Column("ip_hash", sa.String(length=128), nullable=True))
        batch_op.create_index("ix_analytics_events_lead_id", ["lead_id"])
        batch_op.create_foreign_key("fk_analytics_events_lead_id", "leads", ["lead_id"], ["id"])

    op.create_table(
        "contact_requests",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("lead_id", sa.String(), sa.ForeignKey("leads.id"), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("intent", sa.String(length=64), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("source", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_contact_requests_lead_id", "contact_requests", ["lead_id"])
    op.create_index("ix_contact_requests_email", "contact_requests", ["email"])

    op.create_table(
        "consultation_bookings",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("lead_id", sa.String(), sa.ForeignKey("leads.id"), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=True),
        sa.Column("consultation_type", sa.String(length=64), nullable=False),
        sa.Column("preferred_date", sa.String(length=64), nullable=True),
        sa.Column("preferred_time", sa.String(length=64), nullable=True),
        sa.Column("timezone", sa.String(length=64), nullable=True),
        sa.Column("notes", sa.String(length=2000), nullable=True),
        sa.Column("source", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_consultation_bookings_lead_id", "consultation_bookings", ["lead_id"])
    op.create_index("ix_consultation_bookings_email", "consultation_bookings", ["email"])

    op.create_table(
        "handoff_requests",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("lead_id", sa.String(), sa.ForeignKey("leads.id"), nullable=True),
        sa.Column("chat_session_id", sa.String(), sa.ForeignKey("chat_sessions.id"), nullable=True),
        sa.Column("blueprint_result_id", sa.String(), sa.ForeignKey("blueprint_results.id"), nullable=True),
        sa.Column("handoff_type", sa.String(length=64), nullable=False),
        sa.Column("source", sa.String(length=128), nullable=False),
        sa.Column("recommended_specialist", sa.String(length=255), nullable=True),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("context", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_handoff_requests_lead_id", "handoff_requests", ["lead_id"])
    op.create_index("ix_handoff_requests_chat_session_id", "handoff_requests", ["chat_session_id"])
    op.create_index("ix_handoff_requests_blueprint_result_id", "handoff_requests", ["blueprint_result_id"])


def downgrade() -> None:
    op.drop_index("ix_handoff_requests_blueprint_result_id", table_name="handoff_requests")
    op.drop_index("ix_handoff_requests_chat_session_id", table_name="handoff_requests")
    op.drop_index("ix_handoff_requests_lead_id", table_name="handoff_requests")
    op.drop_table("handoff_requests")

    op.drop_index("ix_consultation_bookings_email", table_name="consultation_bookings")
    op.drop_index("ix_consultation_bookings_lead_id", table_name="consultation_bookings")
    op.drop_table("consultation_bookings")

    op.drop_index("ix_contact_requests_email", table_name="contact_requests")
    op.drop_index("ix_contact_requests_lead_id", table_name="contact_requests")
    op.drop_table("contact_requests")

    with op.batch_alter_table("analytics_events") as batch_op:
        batch_op.drop_constraint("fk_analytics_events_lead_id", type_="foreignkey")
        batch_op.drop_index("ix_analytics_events_lead_id")
        batch_op.drop_column("ip_hash")
        batch_op.drop_column("user_agent")
        batch_op.drop_column("component")
        batch_op.drop_column("page_path")
        batch_op.drop_column("lead_id")

    with op.batch_alter_table("leads") as batch_op:
        batch_op.drop_index("ix_leads_email")
        batch_op.drop_column("updated_at")
        batch_op.drop_column("last_seen_at")
        batch_op.drop_column("first_seen_at")
        batch_op.drop_column("lifecycle_stage")
        batch_op.drop_column("company_size")
        batch_op.drop_column("industry")
        batch_op.drop_column("role")
        batch_op.drop_column("phone")
