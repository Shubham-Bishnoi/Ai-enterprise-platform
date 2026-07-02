from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import AgentRun, ClientWorkspace, PortalActivity, PortalDocument, PortalProject, SupportTicket


class PortalRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_workspace_by_user(self, user_id: str) -> ClientWorkspace | None:
        stmt = select(ClientWorkspace).where(ClientWorkspace.user_id == user_id)
        return self.db.scalar(stmt)

    def get_workspace(self, workspace_id: str) -> ClientWorkspace | None:
        return self.db.scalar(select(ClientWorkspace).where(ClientWorkspace.id == workspace_id))

    def upsert_workspace(self, *, user_id: str, defaults: dict) -> ClientWorkspace:
        existing = self.get_workspace_by_user(user_id)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        workspace = ClientWorkspace(user_id=user_id, **defaults)
        self.db.add(workspace)
        self.db.flush()
        self.db.refresh(workspace)
        return workspace

    def list_projects(self, workspace_id: str) -> list[PortalProject]:
        stmt = select(PortalProject).where(PortalProject.workspace_id == workspace_id).order_by(PortalProject.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_project(self, project_id: str) -> PortalProject | None:
        return self.db.scalar(select(PortalProject).where(PortalProject.id == project_id))

    def list_documents(self, workspace_id: str) -> list[PortalDocument]:
        stmt = select(PortalDocument).where(PortalDocument.workspace_id == workspace_id).order_by(PortalDocument.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_document(self, document_id: str) -> PortalDocument | None:
        return self.db.scalar(select(PortalDocument).where(PortalDocument.id == document_id))

    def list_activity(self, workspace_id: str, limit: int = 20) -> list[PortalActivity]:
        stmt = (
            select(PortalActivity)
            .where(PortalActivity.workspace_id == workspace_id)
            .order_by(PortalActivity.created_at.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def add_activity(self, workspace_id: str, *, label: str, activity_type: str, payload: dict) -> PortalActivity:
        activity = PortalActivity(workspace_id=workspace_id, label=label, activity_type=activity_type, payload=payload)
        self.db.add(activity)
        self.db.flush()
        self.db.refresh(activity)
        return activity

    def list_agent_runs(self, workspace_id: str) -> list[AgentRun]:
        stmt = select(AgentRun).where(AgentRun.workspace_id == workspace_id).order_by(AgentRun.started_at.desc())
        return list(self.db.scalars(stmt).all())

    def list_support_tickets(self, workspace_id: str) -> list[SupportTicket]:
        stmt = select(SupportTicket).where(SupportTicket.workspace_id == workspace_id).order_by(SupportTicket.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def create_support_ticket(self, workspace_id: str, **kwargs) -> SupportTicket:
        ticket = SupportTicket(workspace_id=workspace_id, **kwargs)
        self.db.add(ticket)
        self.db.flush()
        self.db.refresh(ticket)
        return ticket
