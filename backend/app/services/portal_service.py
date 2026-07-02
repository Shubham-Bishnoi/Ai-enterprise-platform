from datetime import datetime

from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.governance import GovernanceRepository
from app.repositories.portal import PortalRepository
from app.schemas.portal import (
    AIOperationsSummary,
    ExecutiveSnapshotCard,
    GovernanceSummary,
    PortalActivityOut,
    PortalDashboardOut,
    PortalPersonalization,
    PortalWorkspaceHeader,
    TransformationTimeline,
    TransformationTimelineStage,
)
from app.services.portal_personalization_service import PortalPersonalizationService


class PortalService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = PortalRepository(db)
        self.governance = GovernanceRepository(db)
        self.personalization = PortalPersonalizationService()

    def ensure_workspace(self, *, user_id: str, organization_name: str, client_type: str) -> str:
        workspace = self.repository.upsert_workspace(
            user_id=user_id,
            defaults={
                "client_type": client_type,
                "organization_name": organization_name,
                "workspace_name": "GFF AI Client Workspace",
                "status": "active",
                "stage": "foundry_pilot",
                "current_program": "Enterprise AI Blueprint Program",
                "metadata_json": {"demo_workspace": True},
            },
        )
        self.db.commit()
        return workspace.id

    def dashboard(self, *, user, client_type_override: str | None = None) -> PortalDashboardOut:
        workspace = self.repository.get_workspace_by_user(user.id)
        if not workspace:
            workspace_id = self.ensure_workspace(
                user_id=user.id,
                organization_name=user.organization_name,
                client_type=client_type_override or user.client_type,
            )
            workspace = self.repository.get_workspace(workspace_id)
        if not workspace:
            raise ApiException(code="internal_error", message="Workspace not initialized.", status_code=500)

        if client_type_override and client_type_override != workspace.client_type:
            workspace.client_type = client_type_override
            self.db.add(workspace)
            self.db.commit()
            self.db.refresh(workspace)

        personalization = self.personalization.get_personalization(workspace.client_type)

        projects = self.repository.list_projects(workspace.id)
        documents = self.repository.list_documents(workspace.id)
        tickets = self.repository.list_support_tickets(workspace.id)
        runs = self.repository.list_agent_runs(workspace.id)
        controls = self.governance.list_controls(workspace.id)
        activity = self.repository.list_activity(workspace.id, limit=10)

        implemented = len([c for c in controls if c.implemented])
        pending = max(len(controls) - implemented, 0)
        readiness = int((implemented / max(len(controls), 1)) * 100)

        next_milestone = None
        for proj in projects:
            if proj.next_milestone:
                next_milestone = proj.next_milestone
                break

        snapshot = [
            ExecutiveSnapshotCard(label="Active Projects", value=str(len(projects)), detail="Delivery workstreams", accent="blue"),
            ExecutiveSnapshotCard(label="Blueprint Score", value=str(workspace.metadata_json.get("blueprint_score", 82)), detail="Demo readiness snapshot", accent="purple"),
            ExecutiveSnapshotCard(label="Agents Running", value=str(len([r for r in runs if r.status == 'running'])), detail="Agent operations cockpit", accent="cyan"),
            ExecutiveSnapshotCard(label="Governance Readiness", value=f"{readiness}%", detail="Control coverage", accent="green"),
            ExecutiveSnapshotCard(label="Documents", value=str(len(documents)), detail="Vault items", accent="amber"),
            ExecutiveSnapshotCard(label="Open Tickets", value=str(len([t for t in tickets if t.status == 'open'])), detail="Support queue", accent="red"),
            ExecutiveSnapshotCard(label="Support SLA", value="4h", detail="Demo operating view", accent="gray"),
            ExecutiveSnapshotCard(label="Next Milestone", value=next_milestone or "Governance Review", detail="Program cadence", accent="blue"),
        ]

        transformation = self._timeline(workspace.stage)

        ai_ops = AIOperationsSummary(
            agents_running=len([r for r in runs if r.status == "running"]),
            agent_sessions=int(workspace.metadata_json.get("agent_sessions", 19)),
            automation_runs=int(workspace.metadata_json.get("automation_runs", 42)),
            failed_runs=len([r for r in runs if r.status in {"failed", "error"}]),
            human_review_queue=int(workspace.metadata_json.get("human_review_queue", 6)),
            governance_checks=implemented,
            model_health=str(workspace.metadata_json.get("model_health", "stable")),
        )

        governance = GovernanceSummary(
            readiness_score=readiness,
            controls_implemented=implemented,
            controls_pending=pending,
            risk_level=str(workspace.metadata_json.get("risk_level", "medium")),
            audit_trail_status=str(workspace.metadata_json.get("audit_trail_status", "enabled")),
            human_in_loop_coverage=str(workspace.metadata_json.get("hil_coverage", "partial")),
        )

        header = PortalWorkspaceHeader(
            workspace_name=workspace.workspace_name,
            organization_name=workspace.organization_name,
            client_type=workspace.client_type,
            status=workspace.status,
            stage=workspace.stage,
            current_program=workspace.current_program,
            last_updated=workspace.updated_at,
            demo_secure_workspace=bool(getattr(user, "is_demo", True)),
        )

        personalization_out = PortalPersonalization(
            client_type=workspace.client_type,
            dashboard_subtitle=personalization["dashboard_subtitle"],
            recommended_modules=personalization.get("recommended_modules", []),
            governance_focus=personalization.get("governance_focus", []),
            suggested_next_actions=personalization.get("suggested_next_actions", []),
        )

        return PortalDashboardOut(
            header=header,
            personalization=personalization_out,
            executive_snapshot=snapshot,
            transformation=transformation,
            ai_operations=ai_ops,
            governance=governance,
            projects=projects[:8],
            documents=documents[:8],
            activity=[
                PortalActivityOut(label=a.label, activity_type=a.activity_type, payload=dict(a.payload or {}), created_at=a.created_at)
                for a in activity
            ],
        )

    @staticmethod
    def _timeline(current_stage: str) -> TransformationTimeline:
        stages = [
            ("garage", "Garage"),
            ("foundry_pilot", "Foundry"),
            ("factory_scale", "Factory"),
            ("operate", "Operate"),
            ("optimize", "Optimize"),
            ("scale", "Scale"),
        ]
        current_index = 0
        for idx, (key, _) in enumerate(stages):
            if key == current_stage:
                current_index = idx
                break

        timeline: list[TransformationTimelineStage] = []
        for idx, (key, label) in enumerate(stages):
            status = "complete" if idx < current_index else "current" if idx == current_index else "upcoming"
            timeline.append(TransformationTimelineStage(key=key, label=label, status=status))
        return TransformationTimeline(stages=timeline, current_stage=stages[current_index][0])
