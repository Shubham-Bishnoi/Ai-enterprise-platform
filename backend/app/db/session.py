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
    from app.models.resource import Resource  # noqa: F401
    from app.models.search import SearchIndexEntry  # noqa: F401
    from app.models.user import User  # noqa: F401
    from app.models.use_case import UseCase  # noqa: F401

    Base.metadata.create_all(bind=get_engine())


def get_db() -> Generator[Session, None, None]:
    db = get_session_factory()()
    try:
        yield db
    finally:
        db.close()
