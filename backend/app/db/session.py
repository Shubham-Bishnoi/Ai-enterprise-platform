from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.db.base import Base

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def _engine_kwargs(database_url: str) -> dict:
    if database_url.startswith("sqlite"):
        return {"connect_args": {"check_same_thread": False}}

    kwargs = {"pool_pre_ping": True}

    # Supabase transaction poolers sit behind PgBouncer and are not compatible
    # with psycopg prepared statements during metadata checks/startup.
    if "pooler.supabase.com" in database_url:
        kwargs["connect_args"] = {"prepare_threshold": None}

    return kwargs


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        settings = get_settings()
        _engine = create_engine(
            settings.database_url,
            future=True,
            **_engine_kwargs(settings.database_url),
        )
    return _engine


def get_session_factory() -> sessionmaker[Session]:
    global _session_factory
    if _session_factory is None:
        _session_factory = sessionmaker(
            bind=get_engine(),
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
            class_=Session,
        )
    return _session_factory


def reset_engine() -> None:
    global _engine, _session_factory
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _session_factory = None


def create_db_and_tables() -> None:
    from app.models.blueprint import BlueprintOptionSet, BlueprintRequest, BlueprintResult  # noqa: F401
    from app.models.agent import Agent  # noqa: F401
    from app.models.analytics import AnalyticsEvent  # noqa: F401
    from app.models.capability import Capability  # noqa: F401
    from app.models.chat import ChatMessage, ChatSession  # noqa: F401
    from app.models.consultation import ConsultationBooking  # noqa: F401
    from app.models.content import ContentPage, HomeSection  # noqa: F401
    from app.models.contact import ContactRequest  # noqa: F401
    from app.models.dashboard import DashboardMetric  # noqa: F401
    from app.models.handoff import HandoffRequest  # noqa: F401
    from app.models.industry import IndustryPack  # noqa: F401
    from app.models.industry_content import IndustryContent  # noqa: F401
    from app.models.lead import Lead  # noqa: F401
    from app.models.platform import Platform  # noqa: F401
    from app.models.portal import (  # noqa: F401
        AgentRun,
        ClientWorkspace,
        GovernanceAssessment,
        GovernanceControl,
        PortalActivity,
        PortalDocument,
        PortalProject,
        ProjectMilestone,
        SupportTicket,
    )
    from app.models.lead_capture import ExcelSyncOutbox, LeadSubmission  # noqa: F401
    from app.models.resource import Resource  # noqa: F401
    from app.models.search import SearchIndexEntry  # noqa: F401
    from app.models.user import User  # noqa: F401
    from app.models.use_case import UseCase  # noqa: F401

    from app.models.analytics import AnalyticsSession  # noqa: F401
    from app.models.daily_report import DailyReportRun  # noqa: F401

    Base.metadata.create_all(bind=get_engine())
    ensure_lead_capture_schema()
    ensure_analytics_schema()


# Columns migration 0006 adds to the pre-existing `leads` table, and the two
# reporting views. Deploys run `create_all` (not Alembic), which never ALTERs
# existing tables — this guard applies the same changes idempotently so the
# Render deploy is safe with or without running the migration.
_LEAD_COLUMNS = {
    "normalized_email": "VARCHAR(255)",
    "country": "VARCHAR(128)",
    "consent_status": "VARCHAR(64)",
    "marketing_consent": "BOOLEAN NOT NULL DEFAULT false",
    "privacy_policy_version": "VARCHAR(32)",
}


def ensure_lead_capture_schema() -> None:
    from sqlalchemy import inspect, text

    engine = get_engine()
    inspector = inspect(engine)
    existing_columns = {column["name"] for column in inspector.get_columns("leads")}
    existing_views = set(inspector.get_view_names())

    from app.db import reporting_views

    with engine.begin() as conn:
        for name, ddl_type in _LEAD_COLUMNS.items():
            if name not in existing_columns:
                column_type = ddl_type if engine.dialect.name != "sqlite" else ddl_type.replace("false", "0")
                conn.execute(text(f"ALTER TABLE leads ADD COLUMN {name} {column_type}"))
        if "normalized_email" not in existing_columns:
            conn.execute(text("UPDATE leads SET normalized_email = LOWER(TRIM(email)) WHERE email IS NOT NULL"))

        if "reporting_website_leads" not in existing_views:
            conn.execute(text(reporting_views.WEBSITE_LEADS_VIEW))
        if "reporting_sales_enquiries" not in existing_views:
            conn.execute(text(reporting_views.SALES_ENQUIRIES_VIEW))

        if engine.dialect.name == "postgresql":
            conn.execute(text(reporting_views.POSTGRES_HARDENING))


# Columns migration 0007 adds to the pre-existing `analytics_events` table.
# Same guard pattern as `_LEAD_COLUMNS`: deploys run `create_all`, which never
# ALTERs existing tables, so these are applied idempotently at startup.
_ANALYTICS_EVENT_COLUMNS = {
    "event_id": "VARCHAR(64)",
    "anonymous_id": "VARCHAR(64)",
    "visitor_session_id": "VARCHAR(64)",
    "entity_type": "VARCHAR(64)",
    "entity_id": "VARCHAR(64)",
    "occurred_at": "TIMESTAMPTZ",
}

_ANALYTICS_EVENT_INDEXES = {
    "ix_analytics_events_event_id": "CREATE UNIQUE INDEX ix_analytics_events_event_id ON analytics_events (event_id)",
    "ix_analytics_events_anonymous_id": "CREATE INDEX ix_analytics_events_anonymous_id ON analytics_events (anonymous_id)",
    "ix_analytics_events_visitor_session_id": (
        "CREATE INDEX ix_analytics_events_visitor_session_id ON analytics_events (visitor_session_id)"
    ),
    "ix_analytics_events_occurred_at": "CREATE INDEX ix_analytics_events_occurred_at ON analytics_events (occurred_at)",
    "ix_analytics_events_created_at": "CREATE INDEX ix_analytics_events_created_at ON analytics_events (created_at)",
    "ix_analytics_events_page_path": "CREATE INDEX ix_analytics_events_page_path ON analytics_events (page_path)",
    "ix_analytics_events_entity": "CREATE INDEX ix_analytics_events_entity ON analytics_events (entity_type, entity_id)",
}


def ensure_analytics_schema() -> None:
    from sqlalchemy import inspect, text

    from app.db import reporting_views

    engine = get_engine()
    inspector = inspect(engine)
    existing_columns = {column["name"] for column in inspector.get_columns("analytics_events")}
    existing_indexes = {index["name"] for index in inspector.get_indexes("analytics_events")}

    with engine.begin() as conn:
        for name, ddl_type in _ANALYTICS_EVENT_COLUMNS.items():
            if name not in existing_columns:
                column_type = ddl_type if engine.dialect.name != "sqlite" else ddl_type.replace("TIMESTAMPTZ", "TIMESTAMP")
                conn.execute(text(f"ALTER TABLE analytics_events ADD COLUMN {name} {column_type}"))
        for index_name, ddl in _ANALYTICS_EVENT_INDEXES.items():
            if index_name not in existing_indexes:
                conn.execute(text(ddl))

        if engine.dialect.name == "postgresql":
            conn.execute(text(reporting_views.ANALYTICS_HARDENING))


def get_db() -> Generator[Session, None, None]:
    db = get_session_factory()()
    try:
        yield db
    finally:
        db.close()
