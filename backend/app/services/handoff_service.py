from typing import Any

from sqlalchemy.orm import Session

from app.core.errors import ApiException
from app.repositories.analytics import AnalyticsRepository
from app.repositories.blueprint import BlueprintRepository
from app.repositories.chat import ChatRepository
from app.repositories.handoff import HandoffRepository
from app.schemas.handoff import HandoffRequestCreate, HandoffRequestCreatedData
from app.schemas.leads import LeadUpsertRequest
from app.services.lead_capture_service import LeadCaptureService
from app.services.lead_service import LeadService
from app.services.notification_service import NotificationService

# Handoff types that represent a specific sales-enquiry type.
HANDOFF_SOURCE_TYPES = {
    "proposal": "proposal",
    "workshop": "workshop",
}


class HandoffService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.handoffs = HandoffRepository(db)
        self.analytics = AnalyticsRepository(db)
        self.chat = ChatRepository(db)
        self.blueprints = BlueprintRepository(db)
        self.leads = LeadService(db)
        self.capture = LeadCaptureService(db)
        self.notifications = NotificationService()

    def create_request(self, payload: HandoffRequestCreate) -> HandoffRequestCreatedData:
        lead = None
        if payload.email:
            status = "proposal_requested" if payload.handoff_type == "proposal" else "contacted"
            lifecycle = "sql" if payload.handoff_type in {"proposal", "architecture_review"} else "mql"
            lead = self.leads.upsert_lead(
                LeadUpsertRequest(
                    email=payload.email,
                    name=payload.name,
                    company=payload.company,
                    source=payload.source,
                    metadata=payload.context,
                ),
                status=status,
                lifecycle_stage=lifecycle,
            )

        self._validate_links(
            chat_session_id=payload.chat_session_id,
            blueprint_result_id=payload.blueprint_result_id,
        )

        request = self.handoffs.create(
            lead_id=None if lead is None else lead.id,
            chat_session_id=payload.chat_session_id,
            blueprint_result_id=payload.blueprint_result_id,
            handoff_type=payload.handoff_type,
            source=payload.source,
            recommended_specialist=payload.recommended_specialist,
            summary=payload.summary,
            context_json=payload.context,
            status="requested",
        )
        if lead is not None:
            source_type = HANDOFF_SOURCE_TYPES.get(payload.handoff_type, "human_handoff")
            self.capture.record_submission(
                lead=lead,
                source_type=source_type,
                metadata=payload.context,
                objective_summary=payload.summary,
                chat_session_id=payload.chat_session_id,
                blueprint_result_id=payload.blueprint_result_id,
                handoff_request_id=request.id,
                enquiry_fields={
                    "enquiry_type": source_type,
                    "name": payload.name,
                    "company": payload.company,
                    "business_objective": payload.handoff_type,
                },
            )

        self._safe_capture_event(
            event_name="handoff_requested",
            source=payload.source,
            lead_id=None if lead is None else lead.id,
            session_id=payload.chat_session_id,
            payload={
                "handoff_id": request.id,
                "handoff_type": payload.handoff_type,
                "blueprint_result_id": payload.blueprint_result_id,
            },
        )
        self.db.commit()
        self.notifications.notify_handoff_requested(
            {
                "handoff_id": request.id,
                "handoff_type": payload.handoff_type,
                "lead_id": None if lead is None else lead.id,
            }
        )
        return HandoffRequestCreatedData(
            handoff_id=request.id,
            lead_id=None if lead is None else lead.id,
            status=request.status,
            next_step_message="Your request has been routed to the right specialist. Our team will follow up shortly.",
        )

    def _validate_links(self, *, chat_session_id: str | None, blueprint_result_id: str | None) -> None:
        if chat_session_id and not self.chat.get_session(chat_session_id):
            raise ApiException(status_code=404, code="session_not_found", message="Chat session not found.")
        if blueprint_result_id and not self.blueprints.get_result(blueprint_result_id):
            raise ApiException(status_code=404, code="blueprint_not_found", message="Blueprint not found.")

    def _safe_capture_event(
        self,
        *,
        event_name: str,
        source: str,
        payload: dict[str, Any],
        lead_id: str | None = None,
        session_id: str | None = None,
    ) -> None:
        try:
            self.analytics.create(
                event_name=event_name,
                source=source,
                payload=payload,
                lead_id=lead_id,
                session_id=session_id,
            )
        except Exception:
            pass
