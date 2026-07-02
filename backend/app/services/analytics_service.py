import hashlib

from sqlalchemy.orm import Session

from app.repositories.consultation import ConsultationRepository
from app.repositories.contact import ContactRequestRepository
from app.repositories.analytics import AnalyticsRepository
from app.repositories.handoff import HandoffRepository
from app.repositories.leads import LeadRepository
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventOut, AnalyticsSummaryData


class AnalyticsService:
    def __init__(self, db: Session) -> None:
        self.repository = AnalyticsRepository(db)
        self.db = db
        self.leads = LeadRepository(db)
        self.contacts = ContactRequestRepository(db)
        self.consultations = ConsultationRepository(db)
        self.handoffs = HandoffRepository(db)

    def capture_event(
        self,
        payload: AnalyticsEventCreate,
        *,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> AnalyticsEventOut:
        event = self.repository.create(
            session_id=payload.session_id,
            lead_id=payload.lead_id,
            event_name=payload.event_name,
            source=payload.source,
            page_path=payload.page_path,
            component=payload.component,
            payload=payload.payload,
            user_agent=user_agent,
            ip_hash=self._hash_ip(ip_address),
        )
        self.db.commit()
        return AnalyticsEventOut.model_validate(event, from_attributes=True)

    def summary(self) -> AnalyticsSummaryData:
        return AnalyticsSummaryData(
            total_leads=self.leads.count(),
            total_contact_requests=self.contacts.count(),
            total_consultation_bookings=self.consultations.count(),
            total_handoff_requests=self.handoffs.count(),
            total_blueprint_generated_events=self.repository.count_by_event_name("blueprint_generate_completed"),
            total_agent_message_events=self.repository.count_by_event_name("talk_to_agent_message_sent"),
        )

    @staticmethod
    def _hash_ip(ip_address: str | None) -> str | None:
        if not ip_address:
            return None
        return hashlib.sha256(ip_address.encode("utf-8")).hexdigest()
