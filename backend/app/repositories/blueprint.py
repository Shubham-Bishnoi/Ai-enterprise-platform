from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blueprint import BlueprintOptionSet, BlueprintRequest, BlueprintResult
from app.models.lead import Lead


class BlueprintRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_option_sets(self) -> list[BlueprintOptionSet]:
        stmt = (
            select(BlueprintOptionSet)
            .where(BlueprintOptionSet.is_active.is_(True))
            .order_by(BlueprintOptionSet.option_group.asc(), BlueprintOptionSet.sort_order.asc())
        )
        return list(self.db.scalars(stmt).all())

    def get_result(self, blueprint_id: str) -> BlueprintResult | None:
        stmt = select(BlueprintResult).where(BlueprintResult.id == blueprint_id)
        return self.db.scalar(stmt)

    def get_request(self, request_id: str) -> BlueprintRequest | None:
        stmt = select(BlueprintRequest).where(BlueprintRequest.id == request_id)
        return self.db.scalar(stmt)

    def get_latest_result_for_request(self, request_id: str) -> BlueprintResult | None:
        stmt = (
            select(BlueprintResult)
            .where(BlueprintResult.request_id == request_id)
            .order_by(BlueprintResult.created_at.desc())
        )
        return self.db.scalars(stmt).first()

    def find_or_create_lead(self, *, email: str, source: str) -> Lead:
        stmt = select(Lead).where(Lead.email == email)
        lead = self.db.scalar(stmt)
        if lead:
            return lead
        lead = Lead(email=email, source=source, status="blueprint_lead")
        self.db.add(lead)
        self.db.flush()
        self.db.refresh(lead)
        return lead

    def create_request(self, **kwargs) -> BlueprintRequest:
        request = BlueprintRequest(**kwargs)
        self.db.add(request)
        self.db.flush()
        self.db.refresh(request)
        return request

    def create_result(self, **kwargs) -> BlueprintResult:
        result = BlueprintResult(**kwargs)
        self.db.add(result)
        self.db.flush()
        self.db.refresh(result)
        return result
