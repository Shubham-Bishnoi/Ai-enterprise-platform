from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.governance import GovernanceRepository
from app.schemas.governance import (
    GovernanceAssessmentCreate,
    GovernanceAssessmentOut,
    GovernanceControlOut,
    GovernanceFrameworkOut,
)


class GovernanceService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = GovernanceRepository(db)

    def frameworks(self) -> list[GovernanceFrameworkOut]:
        return [
            GovernanceFrameworkOut(
                key="gff_ai",
                label="GFF AI Governance Controls",
                description="Baseline governance control framework for demo workspace readiness.",
            )
        ]

    def controls(self, workspace_id: str) -> list[GovernanceControlOut]:
        controls = self.repository.list_controls(workspace_id)
        return [GovernanceControlOut.model_validate(control, from_attributes=True) for control in controls]

    def assessments(self, workspace_id: str) -> list[GovernanceAssessmentOut]:
        rows = self.repository.list_assessments(workspace_id)
        return [GovernanceAssessmentOut.model_validate(row, from_attributes=True) for row in rows]

    def create_assessment(self, workspace_id: str, payload: GovernanceAssessmentCreate) -> GovernanceAssessmentOut:
        controls = self.repository.list_controls(workspace_id)
        implemented = len([c for c in controls if c.implemented])
        score = int((implemented / max(len(controls), 1)) * 100)
        risk_level = "low" if score >= 85 else "medium" if score >= 65 else "high"
        assessment = self.repository.create_assessment(
            workspace_id=workspace_id,
            framework=payload.framework,
            score=score,
            risk_level=risk_level,
            notes=payload.notes,
            payload=payload.payload,
        )
        self.db.commit()
        return GovernanceAssessmentOut.model_validate(assessment, from_attributes=True)

    def get_assessment(self, workspace_id: str, assessment_id: str) -> GovernanceAssessmentOut:
        assessment = self.repository.get_assessment(assessment_id)
        if not assessment or assessment.workspace_id != workspace_id:
            raise ApiException(code="not_found", message="Assessment not found.", status_code=404)
        return GovernanceAssessmentOut.model_validate(assessment, from_attributes=True)
