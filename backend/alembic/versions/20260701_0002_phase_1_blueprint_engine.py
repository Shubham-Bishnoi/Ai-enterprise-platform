"""phase 1 blueprint backend foundation

Revision ID: 20260701_0002
Revises: 20260629_0001
Create Date: 2026-07-01 00:00:00
"""

from alembic import op
import sqlalchemy as sa

revision = "20260701_0002"
down_revision = "20260629_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "blueprint_requests",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("lead_id", sa.String(), sa.ForeignKey("leads.id"), nullable=True),
        sa.Column("chat_session_id", sa.String(), sa.ForeignKey("chat_sessions.id"), nullable=True),
        sa.Column("industry", sa.String(length=128), nullable=False),
        sa.Column("company_size", sa.String(length=64), nullable=False),
        sa.Column("top_priorities", sa.JSON(), nullable=False),
        sa.Column("ai_journey_stage", sa.String(length=64), nullable=False),
        sa.Column("biggest_challenge", sa.String(length=128), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("data_readiness", sa.String(length=64), nullable=True),
        sa.Column("existing_systems", sa.JSON(), nullable=False),
        sa.Column("leadership_commitment", sa.String(length=64), nullable=True),
        sa.Column("risk_appetite", sa.String(length=64), nullable=True),
        sa.Column("source", sa.String(length=128), nullable=False),
        sa.Column("raw_payload", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_blueprint_requests_chat_session_id", "blueprint_requests", ["chat_session_id"])

    op.create_table(
        "blueprint_results",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("request_id", sa.String(), sa.ForeignKey("blueprint_requests.id"), nullable=False),
        sa.Column("readiness_score", sa.Integer(), nullable=False),
        sa.Column("readiness_category", sa.String(length=64), nullable=False),
        sa.Column("readiness_breakdown", sa.JSON(), nullable=False),
        sa.Column("result_json", sa.JSON(), nullable=False),
        sa.Column("version", sa.String(length=32), nullable=False),
        sa.Column("ai_model", sa.String(length=128), nullable=True),
        sa.Column("provider", sa.String(length=64), nullable=True),
        sa.Column("confidence_score", sa.Float(), nullable=False),
        sa.Column("assumptions", sa.JSON(), nullable=False),
        sa.Column("warnings", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_blueprint_results_request_id", "blueprint_results", ["request_id"])

    op.create_table(
        "blueprint_option_sets",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("option_group", sa.String(length=128), nullable=False),
        sa.Column("label", sa.String(length=128), nullable=False),
        sa.Column("value", sa.String(length=128), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("metadata", sa.JSON(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_blueprint_option_sets_option_group", "blueprint_option_sets", ["option_group"])

    op.create_table(
        "industry_packs",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("slug", sa.String(length=128), nullable=False, unique=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("common_challenges", sa.JSON(), nullable=False),
        sa.Column("recommended_use_cases", sa.JSON(), nullable=False),
        sa.Column("architecture_hints", sa.JSON(), nullable=False),
        sa.Column("governance_priorities", sa.JSON(), nullable=False),
        sa.Column("recommended_agents", sa.JSON(), nullable=False),
        sa.Column("business_outcomes", sa.JSON(), nullable=False),
        sa.Column("roadmap_bias", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_industry_packs_slug", "industry_packs", ["slug"])

    op.create_table(
        "use_cases",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("slug", sa.String(length=128), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("industry_slug", sa.String(length=128), nullable=True),
        sa.Column("capability_slug", sa.String(length=128), nullable=True),
        sa.Column("impact_level", sa.String(length=32), nullable=False),
        sa.Column("complexity", sa.String(length=32), nullable=False),
        sa.Column("time_to_value", sa.String(length=64), nullable=False),
        sa.Column("recommended_agent", sa.String(length=128), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_use_cases_slug", "use_cases", ["slug"])


def downgrade() -> None:
    op.drop_index("ix_use_cases_slug", table_name="use_cases")
    op.drop_table("use_cases")
    op.drop_index("ix_industry_packs_slug", table_name="industry_packs")
    op.drop_table("industry_packs")
    op.drop_index("ix_blueprint_option_sets_option_group", table_name="blueprint_option_sets")
    op.drop_table("blueprint_option_sets")
    op.drop_index("ix_blueprint_results_request_id", table_name="blueprint_results")
    op.drop_table("blueprint_results")
    op.drop_index("ix_blueprint_requests_chat_session_id", table_name="blueprint_requests")
    op.drop_table("blueprint_requests")
