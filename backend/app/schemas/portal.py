from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class PortalWorkspaceHeader(BaseModel):
    workspace_name: str
    organization_name: str
    client_type: str
    status: str
    stage: str
    current_program: str | None = None
    last_updated: datetime
    demo_secure_workspace: bool = True


class PortalPersonalization(BaseModel):
    client_type: str
    dashboard_subtitle: str
    recommended_modules: list[str] = Field(default_factory=list)
    governance_focus: list[str] = Field(default_factory=list)
    suggested_next_actions: list[dict[str, Any]] = Field(default_factory=list)


class ExecutiveSnapshotCard(BaseModel):
    label: str
    value: str
    detail: str | None = None
    accent: str | None = None


class TransformationTimelineStage(BaseModel):
    key: str
    label: str
    status: str


class TransformationTimeline(BaseModel):
    stages: list[TransformationTimelineStage] = Field(default_factory=list)
    current_stage: str


class PortalProjectOut(BaseModel):
    id: str
    name: str
    phase: str
    status: str
    owner: str | None = None
    progress: int
    risk_level: str
    next_milestone: str | None = None
    related_blueprint_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PortalDocumentOut(BaseModel):
    id: str
    title: str
    document_type: str
    status: str
    source: str | None = None
    source_id: str | None = None
    download_url: str | None = None
    content: dict[str, Any] = Field(default_factory=dict, validation_alias="content_json")
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AIOperationsSummary(BaseModel):
    agents_running: int
    agent_sessions: int
    automation_runs: int
    failed_runs: int
    human_review_queue: int
    governance_checks: int
    model_health: str


class GovernanceSummary(BaseModel):
    readiness_score: int
    controls_implemented: int
    controls_pending: int
    risk_level: str
    audit_trail_status: str
    human_in_loop_coverage: str


class SupportTicketOut(BaseModel):
    id: str
    request_type: str
    title: str
    message: str
    status: str
    priority: str
    metadata: dict[str, Any] = Field(default_factory=dict, validation_alias="metadata_json")
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PortalActivityOut(BaseModel):
    label: str
    activity_type: str
    payload: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime


class PortalDashboardOut(BaseModel):
    header: PortalWorkspaceHeader
    personalization: PortalPersonalization
    executive_snapshot: list[ExecutiveSnapshotCard] = Field(default_factory=list)
    transformation: TransformationTimeline
    ai_operations: AIOperationsSummary
    governance: GovernanceSummary
    projects: list[PortalProjectOut] = Field(default_factory=list)
    documents: list[PortalDocumentOut] = Field(default_factory=list)
    activity: list[PortalActivityOut] = Field(default_factory=list)
