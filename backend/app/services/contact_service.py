from sqlalchemy.orm import Session

from app.repositories.analytics import AnalyticsRepository
from app.repositories.contact import ContactRequestRepository
from app.schemas.contact import ContactRequestCreate, ContactRequestCreatedData
from app.schemas.leads import LeadUpsertRequest
from app.services.lead_service import LeadService
from app.services.notification_service import NotificationService


class ContactService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.contacts = ContactRequestRepository(db)
        self.analytics = AnalyticsRepository(db)
        self.leads = LeadService(db)
        self.notifications = NotificationService()

    def submit(self, payload: ContactRequestCreate) -> ContactRequestCreatedData:
        lead = self.leads.upsert_lead(
            LeadUpsertRequest(
                email=payload.email,
                name=payload.name,
                company=payload.company,
                source=payload.source,
                metadata=payload.metadata,
            ),
            status="contacted",
            lifecycle_stage="lead",
        )

        request = self.contacts.create(
            lead_id=lead.id,
            name=payload.name,
            company=payload.company,
            email=payload.email,
            intent=payload.intent,
            message=payload.message,
            source=payload.source,
            status="new",
            metadata_json=payload.metadata,
        )

        self._safe_capture_event(
            event_name="contact_request_created",
            source=payload.source,
            lead_id=lead.id,
            payload={
                "contact_request_id": request.id,
                "intent": payload.intent,
            },
        )
        self.db.commit()
        self.notifications.notify_contact_request_created(
            {
                "contact_request_id": request.id,
                "lead_id": lead.id,
                "source": payload.source,
                "intent": payload.intent,
            }
        )
        return ContactRequestCreatedData(
            contact_request_id=request.id,
            lead_id=lead.id,
            status=request.status,
            message="Contact request received successfully.",
        )

    def _safe_capture_event(
        self,
        *,
        event_name: str,
        source: str,
        payload: dict,
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
