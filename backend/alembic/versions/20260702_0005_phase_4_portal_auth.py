"""phase 4 portal auth

Revision ID: 20260702_0005
Revises: 20260702_0004
Create Date: 2026-07-02 01:30:00
"""

from alembic import op
import sqlalchemy as sa

revision = "20260702_0005"
down_revision = "20260702_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=255), nullable=False),
        sa.Column("client_type", sa.String(length=64), nullable=False),
        sa.Column("organization_name", sa.String(length=255), nullable=False),
        sa.Column("password_salt", sa.String(length=64), nullable=True),
        sa.Column("password_hash", sa.String(length=128), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("is_demo", sa.Boolean(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_client_type", "users", ["client_type"])
    op.create_index("ix_users_status", "users", ["status"])

    op.create_table(
        "client_workspaces",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("client_type", sa.String(length=64), nullable=False),
        sa.Column("organization_name", sa.String(length=255), nullable=False),
        sa.Column("workspace_name", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("stage", sa.String(length=64), nullable=False),
        sa.Column("current_program", sa.String(length=255), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_client_workspaces_user_id", "client_workspaces", ["user_id"])
    op.create_index("ix_client_workspaces_client_type", "client_workspaces", ["client_type"])
    op.create_index("ix_client_workspaces_status", "client_workspaces", ["status"])
    op.create_index("ix_client_workspaces_stage", "client_workspaces", ["stage"])

    op.create_table(
        "portal_projects",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("workspace_id", sa.String(), sa.ForeignKey("client_workspaces.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("phase", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("owner", sa.String(length=255), nullable=True),
        sa.Column("progress", sa.Integer(), nullable=False),
        sa.Column("risk_level", sa.String(length=32), nullable=False),
        sa.Column("next_milestone", sa.String(length=255), nullable=True),
        sa.Column("related_blueprint_id", sa.String(length=64), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_portal_projects_workspace_id", "portal_projects", ["workspace_id"])
    op.create_index("ix_portal_projects_status", "portal_projects", ["status"])

    op.create_table(
        "portal_project_milestones",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("project_id", sa.String(), sa.ForeignKey("portal_projects.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("due_date", sa.String(length=64), nullable=True),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_portal_project_milestones_project_id", "portal_project_milestones", ["project_id"])
    op.create_index("ix_portal_project_milestones_status", "portal_project_milestones", ["status"])

    op.create_table(
        "portal_documents",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("workspace_id", sa.String(), sa.ForeignKey("client_workspaces.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("document_type", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("source", sa.String(length=64), nullable=True),
        sa.Column("source_id", sa.String(length=64), nullable=True),
        sa.Column("download_url", sa.String(length=512), nullable=True),
        sa.Column("content_json", sa.JSON(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_portal_documents_workspace_id", "portal_documents", ["workspace_id"])
    op.create_index("ix_portal_documents_document_type", "portal_documents", ["document_type"])
    op.create_index("ix_portal_documents_status", "portal_documents", ["status"])

    op.create_table(
        "governance_controls",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("workspace_id", sa.String(), sa.ForeignKey("client_workspaces.id"), nullable=False),
        sa.Column("control_key", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("implemented", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_governance_controls_workspace_id", "governance_controls", ["workspace_id"])
    op.create_index("ix_governance_controls_control_key", "governance_controls", ["control_key"])
    op.create_index("ix_governance_controls_category", "governance_controls", ["category"])
    op.create_index("ix_governance_controls_status", "governance_controls", ["status"])

    op.create_table(
        "governance_assessments",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("workspace_id", sa.String(), sa.ForeignKey("client_workspaces.id"), nullable=False),
        sa.Column("framework", sa.String(length=64), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("risk_level", sa.String(length=32), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_governance_assessments_workspace_id", "governance_assessments", ["workspace_id"])

    op.create_table(
        "agent_runs",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("workspace_id", sa.String(), sa.ForeignKey("client_workspaces.id"), nullable=False),
        sa.Column("agent_name", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("metrics_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_agent_runs_workspace_id", "agent_runs", ["workspace_id"])
    op.create_index("ix_agent_runs_status", "agent_runs", ["status"])

    op.create_table(
        "support_tickets",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("workspace_id", sa.String(), sa.ForeignKey("client_workspaces.id"), nullable=False),
        sa.Column("request_type", sa.String(length=64), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("priority", sa.String(length=32), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_support_tickets_workspace_id", "support_tickets", ["workspace_id"])
    op.create_index("ix_support_tickets_request_type", "support_tickets", ["request_type"])
    op.create_index("ix_support_tickets_status", "support_tickets", ["status"])

    op.create_table(
        "portal_activity",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("workspace_id", sa.String(), sa.ForeignKey("client_workspaces.id"), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("activity_type", sa.String(length=64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_portal_activity_workspace_id", "portal_activity", ["workspace_id"])
    op.create_index("ix_portal_activity_activity_type", "portal_activity", ["activity_type"])


def downgrade() -> None:
    op.drop_index("ix_portal_activity_activity_type", table_name="portal_activity")
    op.drop_index("ix_portal_activity_workspace_id", table_name="portal_activity")
    op.drop_table("portal_activity")

    op.drop_index("ix_support_tickets_status", table_name="support_tickets")
    op.drop_index("ix_support_tickets_request_type", table_name="support_tickets")
    op.drop_index("ix_support_tickets_workspace_id", table_name="support_tickets")
    op.drop_table("support_tickets")

    op.drop_index("ix_agent_runs_status", table_name="agent_runs")
    op.drop_index("ix_agent_runs_workspace_id", table_name="agent_runs")
    op.drop_table("agent_runs")

    op.drop_index("ix_governance_assessments_workspace_id", table_name="governance_assessments")
    op.drop_table("governance_assessments")

    op.drop_index("ix_governance_controls_status", table_name="governance_controls")
    op.drop_index("ix_governance_controls_category", table_name="governance_controls")
    op.drop_index("ix_governance_controls_control_key", table_name="governance_controls")
    op.drop_index("ix_governance_controls_workspace_id", table_name="governance_controls")
    op.drop_table("governance_controls")

    op.drop_index("ix_portal_documents_status", table_name="portal_documents")
    op.drop_index("ix_portal_documents_document_type", table_name="portal_documents")
    op.drop_index("ix_portal_documents_workspace_id", table_name="portal_documents")
    op.drop_table("portal_documents")

    op.drop_index("ix_portal_project_milestones_status", table_name="portal_project_milestones")
    op.drop_index("ix_portal_project_milestones_project_id", table_name="portal_project_milestones")
    op.drop_table("portal_project_milestones")

    op.drop_index("ix_portal_projects_status", table_name="portal_projects")
    op.drop_index("ix_portal_projects_workspace_id", table_name="portal_projects")
    op.drop_table("portal_projects")

    op.drop_index("ix_client_workspaces_stage", table_name="client_workspaces")
    op.drop_index("ix_client_workspaces_status", table_name="client_workspaces")
    op.drop_index("ix_client_workspaces_client_type", table_name="client_workspaces")
    op.drop_index("ix_client_workspaces_user_id", table_name="client_workspaces")
    op.drop_table("client_workspaces")

    op.drop_index("ix_users_status", table_name="users")
    op.drop_index("ix_users_client_type", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

