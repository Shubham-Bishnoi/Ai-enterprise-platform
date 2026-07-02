from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.portal import GovernanceAssessment, GovernanceControl


class GovernanceRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_controls(self, workspace_id: str) -> list[GovernanceControl]:
        stmt = (
            select(GovernanceControl)
            .where(GovernanceControl.workspace_id == workspace_id)
            .order_by(GovernanceControl.category.asc(), GovernanceControl.control_key.asc())
        )
        return list(self.db.scalars(stmt).all())

    def upsert_control(self, *, workspace_id: str, control_key: str, defaults: dict) -> GovernanceControl:
        stmt = select(GovernanceControl).where(
            GovernanceControl.workspace_id == workspace_id, GovernanceControl.control_key == control_key
        )
        existing = self.db.scalar(stmt)
        if existing:
            for key, value in defaults.items():
                setattr(existing, key, value)
            self.db.add(existing)
            self.db.flush()
            self.db.refresh(existing)
            return existing
        control = GovernanceControl(workspace_id=workspace_id, control_key=control_key, **defaults)
        self.db.add(control)
        self.db.flush()
        self.db.refresh(control)
        return control

    def list_assessments(self, workspace_id: str) -> list[GovernanceAssessment]:
        stmt = (
            select(GovernanceAssessment)
            .where(GovernanceAssessment.workspace_id == workspace_id)
            .order_by(GovernanceAssessment.created_at.desc())
        )
        return list(self.db.scalars(stmt).all())

    def get_assessment(self, assessment_id: str) -> GovernanceAssessment | None:
        return self.db.scalar(select(GovernanceAssessment).where(GovernanceAssessment.id == assessment_id))

    def create_assessment(self, **kwargs) -> GovernanceAssessment:
        assessment = GovernanceAssessment(**kwargs)
        self.db.add(assessment)
        self.db.flush()
        self.db.refresh(assessment)
        return assessment
