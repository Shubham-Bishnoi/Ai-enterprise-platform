"""phase 3 content search resources

Revision ID: 20260702_0004
Revises: 20260701_0003
Create Date: 2026-07-02 00:30:00
"""

from alembic import op
import sqlalchemy as sa

revision = "20260702_0004"
down_revision = "20260701_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "content_pages",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("content_json", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_content_pages_slug", "content_pages", ["slug"], unique=True)
    op.create_index("ix_content_pages_status", "content_pages", ["status"])
    op.create_index("ix_content_pages_sort_order", "content_pages", ["sort_order"])

    op.create_table(
        "home_sections",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("section_key", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("subtitle", sa.Text(), nullable=True),
        sa.Column("content_json", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_home_sections_section_key", "home_sections", ["section_key"], unique=True)
    op.create_index("ix_home_sections_status", "home_sections", ["status"])
    op.create_index("ix_home_sections_sort_order", "home_sections", ["sort_order"])

    op.create_table(
        "capabilities",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("tagline", sa.String(length=255), nullable=True),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("ui_color", sa.String(length=32), nullable=True),
        sa.Column("ui_icon", sa.String(length=64), nullable=True),
        sa.Column("items", sa.JSON(), nullable=False),
        sa.Column("deliverables", sa.JSON(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_capabilities_slug", "capabilities", ["slug"], unique=True)
    op.create_index("ix_capabilities_status", "capabilities", ["status"])
    op.create_index("ix_capabilities_sort_order", "capabilities", ["sort_order"])

    op.create_table(
        "platforms",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("ui_color", sa.String(length=32), nullable=True),
        sa.Column("ui_icon", sa.String(length=64), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_platforms_slug", "platforms", ["slug"], unique=True)
    op.create_index("ix_platforms_status", "platforms", ["status"])
    op.create_index("ix_platforms_sort_order", "platforms", ["sort_order"])

    op.create_table(
        "resources",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("resource_type", sa.String(length=64), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("link", sa.String(length=512), nullable=True),
        sa.Column("published_at", sa.String(length=32), nullable=True),
        sa.Column("read_time", sa.String(length=32), nullable=True),
        sa.Column("featured", sa.Boolean(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_resources_slug", "resources", ["slug"], unique=True)
    op.create_index("ix_resources_resource_type", "resources", ["resource_type"])
    op.create_index("ix_resources_featured", "resources", ["featured"])
    op.create_index("ix_resources_status", "resources", ["status"])
    op.create_index("ix_resources_sort_order", "resources", ["sort_order"])

    op.create_table(
        "dashboard_metrics",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("metric_key", sa.String(length=160), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("value", sa.String(length=255), nullable=False),
        sa.Column("unit", sa.String(length=64), nullable=True),
        sa.Column("trend", sa.String(length=64), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_dashboard_metrics_metric_key", "dashboard_metrics", ["metric_key"], unique=True)
    op.create_index("ix_dashboard_metrics_status", "dashboard_metrics", ["status"])
    op.create_index("ix_dashboard_metrics_sort_order", "dashboard_metrics", ["sort_order"])

    op.create_table(
        "industry_content",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("pack_slug", sa.String(length=160), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("subtitle", sa.Text(), nullable=True),
        sa.Column("ui_color", sa.String(length=32), nullable=True),
        sa.Column("ui_icon", sa.String(length=64), nullable=True),
        sa.Column("challenges", sa.JSON(), nullable=False),
        sa.Column("outcomes", sa.JSON(), nullable=False),
        sa.Column("content_json", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_industry_content_slug", "industry_content", ["slug"], unique=True)
    op.create_index("ix_industry_content_pack_slug", "industry_content", ["pack_slug"])
    op.create_index("ix_industry_content_status", "industry_content", ["status"])
    op.create_index("ix_industry_content_sort_order", "industry_content", ["sort_order"])

    op.create_table(
        "search_index_entries",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("link", sa.String(length=512), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("source_type", sa.String(length=64), nullable=False),
        sa.Column("relevance_base", sa.Integer(), nullable=False),
        sa.Column("featured", sa.Boolean(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_search_index_entries_title", "search_index_entries", ["title"])
    op.create_index("ix_search_index_entries_category", "search_index_entries", ["category"])
    op.create_index("ix_search_index_entries_source_type", "search_index_entries", ["source_type"])
    op.create_index("ix_search_index_entries_featured", "search_index_entries", ["featured"])
    op.create_index("ix_search_index_entries_status", "search_index_entries", ["status"])
    op.create_index("ix_search_index_entries_sort_order", "search_index_entries", ["sort_order"])


def downgrade() -> None:
    op.drop_index("ix_search_index_entries_sort_order", table_name="search_index_entries")
    op.drop_index("ix_search_index_entries_status", table_name="search_index_entries")
    op.drop_index("ix_search_index_entries_featured", table_name="search_index_entries")
    op.drop_index("ix_search_index_entries_source_type", table_name="search_index_entries")
    op.drop_index("ix_search_index_entries_category", table_name="search_index_entries")
    op.drop_index("ix_search_index_entries_title", table_name="search_index_entries")
    op.drop_table("search_index_entries")

    op.drop_index("ix_industry_content_sort_order", table_name="industry_content")
    op.drop_index("ix_industry_content_status", table_name="industry_content")
    op.drop_index("ix_industry_content_pack_slug", table_name="industry_content")
    op.drop_index("ix_industry_content_slug", table_name="industry_content")
    op.drop_table("industry_content")

    op.drop_index("ix_dashboard_metrics_sort_order", table_name="dashboard_metrics")
    op.drop_index("ix_dashboard_metrics_status", table_name="dashboard_metrics")
    op.drop_index("ix_dashboard_metrics_metric_key", table_name="dashboard_metrics")
    op.drop_table("dashboard_metrics")

    op.drop_index("ix_resources_sort_order", table_name="resources")
    op.drop_index("ix_resources_status", table_name="resources")
    op.drop_index("ix_resources_featured", table_name="resources")
    op.drop_index("ix_resources_resource_type", table_name="resources")
    op.drop_index("ix_resources_slug", table_name="resources")
    op.drop_table("resources")

    op.drop_index("ix_platforms_sort_order", table_name="platforms")
    op.drop_index("ix_platforms_status", table_name="platforms")
    op.drop_index("ix_platforms_slug", table_name="platforms")
    op.drop_table("platforms")

    op.drop_index("ix_capabilities_sort_order", table_name="capabilities")
    op.drop_index("ix_capabilities_status", table_name="capabilities")
    op.drop_index("ix_capabilities_slug", table_name="capabilities")
    op.drop_table("capabilities")

    op.drop_index("ix_home_sections_sort_order", table_name="home_sections")
    op.drop_index("ix_home_sections_status", table_name="home_sections")
    op.drop_index("ix_home_sections_section_key", table_name="home_sections")
    op.drop_table("home_sections")

    op.drop_index("ix_content_pages_sort_order", table_name="content_pages")
    op.drop_index("ix_content_pages_status", table_name="content_pages")
    op.drop_index("ix_content_pages_slug", table_name="content_pages")
    op.drop_table("content_pages")
