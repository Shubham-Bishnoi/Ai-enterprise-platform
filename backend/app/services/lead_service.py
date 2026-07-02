from datetime import datetime

from sqlalchemy.orm import Session

from app.models.lead import Lead
from app.repositories.leads import LeadRepository
from app.schemas.leads import LeadCreatedData, LeadOut, LeadUpsertRequest
from app.db.base import utcnow


class LeadService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = LeadRepository(db)

    def upsert_lead(
        self,
        payload: LeadUpsertRequest,
        *,
        status: str | None = None,
        lifecycle_stage: str | None = None,
        seen_at: datetime | None = None,
    ) -> Lead:
        timestamp = seen_at or utcnow()
        lead = self.repository.get_by_email(payload.email)
        metadata = self.repository.merge_metadata(None if lead is None else lead.metadata_json, payload.metadata)

        if lead:
            lead.name = lead.name or payload.name
            lead.company = lead.company or payload.company
            lead.phone = lead.phone or payload.phone
            lead.role = lead.role or payload.role
            lead.industry = lead.industry or payload.industry
            lead.company_size = lead.company_size or payload.company_size
            lead.source = payload.source or lead.source
            lead.status = status or lead.status
            lead.lifecycle_stage = lifecycle_stage or lead.lifecycle_stage
            lead.metadata_json = metadata
            self.repository.touch_last_seen(lead, timestamp)
            return self.repository.save(lead)

        return self.repository.create(
            email=payload.email,
            name=payload.name,
            company=payload.company,
            phone=payload.phone,
            role=payload.role,
            industry=payload.industry,
            company_size=payload.company_size,
            source=payload.source,
            status=status or "new",
            lifecycle_stage=lifecycle_stage or "lead",
            metadata_json=metadata,
            first_seen_at=timestamp,
            last_seen_at=timestamp,
        )

    def create_or_update(self, payload: LeadUpsertRequest) -> LeadCreatedData:
        lead = self.upsert_lead(payload)
        self.db.commit()
        return LeadCreatedData(
            lead_id=lead.id,
            status=lead.status,
            lifecycle_stage=lead.lifecycle_stage,
            message="Lead captured successfully.",
        )

    def get_lead(self, lead_id: str) -> LeadOut:
        lead = self.repository.get_by_id(lead_id)
        if not lead:
            from app.core.errors import ApiException

            raise ApiException(status_code=404, code="lead_not_found", message="Lead not found.")
        return LeadOut.model_validate(lead, from_attributes=True)
