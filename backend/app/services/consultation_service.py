from sqlalchemy.orm import Session

from app.repositories.analytics import AnalyticsRepository
from app.repositories.consultation import ConsultationRepository
from app.schemas.consultation import (
    ConsultationBookingCreate,
    ConsultationBookingCreatedData,
    ConsultationSlotsData,
)
from app.schemas.leads import LeadUpsertRequest
from app.services.lead_service import LeadService
from app.services.notification_service import NotificationService


class ConsultationService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.consultations = ConsultationRepository(db)
        self.analytics = AnalyticsRepository(db)
        self.leads = LeadService(db)
        self.notifications = NotificationService()

    def book(self, payload: ConsultationBookingCreate) -> ConsultationBookingCreatedData:
        lead = self.leads.upsert_lead(
            LeadUpsertRequest(
                email=payload.email,
                name=payload.name,
                company=payload.company,
                source=payload.source,
                metadata=payload.metadata,
            ),
            status="qualified" if payload.consultation_type == "discovery_call" else "contacted",
            lifecycle_stage="mql",
        )

        booking = self.consultations.create(
            lead_id=lead.id,
            name=payload.name,
            email=payload.email,
            company=payload.company,
            consultation_type=payload.consultation_type,
            preferred_date=payload.preferred_date,
            preferred_time=payload.preferred_time,
            timezone=payload.timezone,
            notes=payload.notes,
            source=payload.source,
            status="requested",
            metadata_json=payload.metadata,
        )
        lead.status = "workshop_requested" if payload.consultation_type == "executive_workshop" else lead.status

        self._safe_capture_event(
            event_name="consultation_requested",
            source=payload.source,
            lead_id=lead.id,
            payload={
                "booking_id": booking.id,
                "consultation_type": payload.consultation_type,
            },
        )
        self.db.commit()
        self.notifications.notify_consultation_requested(
            {
                "booking_id": booking.id,
                "lead_id": lead.id,
                "consultation_type": payload.consultation_type,
            }
        )
        return ConsultationBookingCreatedData(
            booking_id=booking.id,
            lead_id=lead.id,
            status=booking.status,
            message="Consultation request received. Calendar integration will be configured later.",
        )

    def list_placeholder_slots(self) -> ConsultationSlotsData:
        return ConsultationSlotsData(
            slots=[],
            message="Calendar integration will be configured later.",
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
