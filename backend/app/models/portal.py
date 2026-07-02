from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin, utcnow


class ClientWorkspace(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "client_workspaces"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    client_type: Mapped[str] = mapped_column(String(64), index=True)
    organization_name: Mapped[str] = mapped_column(String(255))
    workspace_name: Mapped[str] = mapped_column(String(255), default="GFF AI Client Workspace")
    status: Mapped[str] = mapped_column(String(64), default="active", index=True)
    stage: Mapped[str] = mapped_column(String(64), default="foundry_pilot", index=True)
    current_program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class PortalProject(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "portal_projects"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("client_workspaces.id"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    phase: Mapped[str] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(String(64), index=True)
    owner: Mapped[str | None] = mapped_column(String(255), nullable=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    risk_level: Mapped[str] = mapped_column(String(32), default="medium")
    next_milestone: Mapped[str | None] = mapped_column(String(255), nullable=True)
    related_blueprint_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class ProjectMilestone(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "portal_project_milestones"

    project_id: Mapped[str] = mapped_column(ForeignKey("portal_projects.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(64), default="pending", index=True)
    due_date: Mapped[str | None] = mapped_column(String(64), nullable=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class PortalDocument(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "portal_documents"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("client_workspaces.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    document_type: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(64), default="ready", index=True)
    source: Mapped[str | None] = mapped_column(String(64), nullable=True)
    source_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    download_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    content_json: Mapped[dict] = mapped_column(JSON, default=dict)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class GovernanceControl(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "governance_controls"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("client_workspaces.id"), index=True)
    control_key: Mapped[str] = mapped_column(String(160), index=True)
    title: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(64), index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    implemented: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(64), default="pending", index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class GovernanceAssessment(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "governance_assessments"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("client_workspaces.id"), index=True)
    framework: Mapped[str] = mapped_column(String(64), default="gff_ai")
    score: Mapped[int] = mapped_column(Integer, default=0)
    risk_level: Mapped[str] = mapped_column(String(32), default="medium")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class AgentRun(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "agent_runs"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("client_workspaces.id"), index=True)
    agent_name: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(64), default="running", index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    metrics_json: Mapped[dict] = mapped_column(JSON, default=dict)


class SupportTicket(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "support_tickets"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("client_workspaces.id"), index=True)
    request_type: Mapped[str] = mapped_column(String(64), index=True)
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(64), default="open", index=True)
    priority: Mapped[str] = mapped_column(String(32), default="normal")
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class PortalActivity(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "portal_activity"

    workspace_id: Mapped[str] = mapped_column(ForeignKey("client_workspaces.id"), index=True)
    label: Mapped[str] = mapped_column(String(255))
    activity_type: Mapped[str] = mapped_column(String(64), index=True)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
