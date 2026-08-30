import hashlib
import json
import logging
from datetime import timedelta

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import ApiException
from app.core.event_taxonomy import is_allowed_event
from app.db.base import utcnow
from app.models.analytics import AnalyticsSession
from app.repositories.analytics import AnalyticsRepository
from app.repositories.consultation import ConsultationRepository
from app.repositories.contact import ContactRequestRepository
from app.repositories.handoff import HandoffRepository
from app.repositories.leads import LeadRepository
from app.schemas.analytics import AnalyticsEventAck, AnalyticsEventCreate, AnalyticsSummaryData

logger = logging.getLogger("app.analytics")

# Health checks, uptime monitors and crawlers never become "visitors".
_BOT_UA_MARKERS = (
    "bot",
    "crawler",
    "spider",
    "curl/",
    "wget/",
    "python-requests",
    "python-httpx",
    "go-http-client",
    "pingdom",
    "uptime",
    "monitor",
    "headlesschrome",
    "render/",
    "lighthouse",
)

_OCCURRED_AT_MAX_SKEW = timedelta(hours=24)


def _is_bot(user_agent: str | None) -> bool:
    if not user_agent:
        return False
    lowered = user_agent.lower()
    return any(marker in lowered for marker in _BOT_UA_MARKERS)


def _device_category(user_agent: str | None) -> str | None:
    if not user_agent:
        return None
    ua = user_agent.lower()
    if "ipad" in ua or "tablet" in ua:
        return "tablet"
    if "mobi" in ua or "iphone" in ua or "android" in ua:
        return "mobile"
    return "desktop"


def _browser_category(user_agent: str | None) -> str | None:
    if not user_agent:
        return None
    ua = user_agent.lower()
    if "edg/" in ua or "edge" in ua:
        return "edge"
    if "firefox" in ua:
        return "firefox"
    if "chrome" in ua or "crios" in ua:
        return "chrome"
    if "safari" in ua:
        return "safari"
    return "other"


class AnalyticsService:
    def __init__(self, db: Session) -> None:
        self.repository = AnalyticsRepository(db)
        self.db = db
        self.settings = get_settings()
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
    ) -> AnalyticsEventAck:
        if not is_allowed_event(payload.event_name):
            raise ApiException(
                code="unknown_event",
                message="event_name is not in the analytics taxonomy.",
                status_code=422,
            )

        payload_bytes = len(json.dumps(payload.payload, default=str).encode("utf-8"))
        if payload_bytes > self.settings.analytics_payload_max_bytes:
            raise ApiException(
                code="payload_too_large",
                message="Event payload exceeds the allowed size.",
                status_code=413,
            )

        # Bots/monitors get a success response (nothing for them to retry)
        # but never inflate the stored analytics.
        if _is_bot(user_agent):
            return AnalyticsEventAck(id=None, event_id=payload.event_id, stored=False)

        # Idempotency: a redelivered event_id is acknowledged, not re-stored.
        if payload.event_id:
            existing = self.repository.get_by_event_id(payload.event_id)
            if existing is not None:
                return AnalyticsEventAck(id=existing.id, event_id=payload.event_id, stored=True, duplicate=True)

        occurred_at = self._clamped_occurred_at(payload.occurred_at)
        self._touch_session(payload, user_agent=user_agent)

        try:
            event = self.repository.create(
                event_id=payload.event_id,
                session_id=payload.session_id,
                anonymous_id=payload.anonymous_id,
                visitor_session_id=payload.visitor_session_id,
                lead_id=payload.lead_id,
                event_name=payload.event_name,
                source=payload.source,
                page_path=payload.page_path,
                component=payload.component,
                entity_type=payload.entity_type,
                entity_id=payload.entity_id,
                payload=payload.payload,
                user_agent=(user_agent or "")[:512] or None,
                ip_hash=self._hash_ip(ip_address),
                occurred_at=occurred_at,
            )
            self.db.commit()
        except IntegrityError:
            # Lost the race on the unique event_id — the event is stored.
            self.db.rollback()
            return AnalyticsEventAck(id=None, event_id=payload.event_id, stored=True, duplicate=True)

        return AnalyticsEventAck(id=event.id, event_id=event.event_id, stored=True)

    def _touch_session(self, payload: AnalyticsEventCreate, *, user_agent: str | None) -> None:
        """Create or refresh the anonymous session row for this event."""
        if not payload.visitor_session_id:
            return

        session = self.db.get(AnalyticsSession, payload.visitor_session_id) or self.db.scalar(
            self.repository.session_by_key(payload.visitor_session_id)
        )
        context = payload.session_context
        now = utcnow()
        if session is None:
            session = AnalyticsSession(
                session_key=payload.visitor_session_id,
                anonymous_id=payload.anonymous_id,
                first_seen_at=now,
                last_seen_at=now,
                landing_page=(context.landing_page if context else None) or payload.page_path,
                referrer=context.referrer if context else None,
                utm_source=context.utm_source if context else None,
                utm_medium=context.utm_medium if context else None,
                utm_campaign=context.utm_campaign if context else None,
                utm_term=context.utm_term if context else None,
                utm_content=context.utm_content if context else None,
                device_category=(context.device_category if context else None) or _device_category(user_agent),
                browser_category=(context.browser_category if context else None) or _browser_category(user_agent),
                consent_status=(context.consent_status if context else None) or "essential_analytics",
                page_view_count=0,
            )
            self.db.add(session)
        else:
            session.last_seen_at = now
            if payload.anonymous_id and not session.anonymous_id:
                session.anonymous_id = payload.anonymous_id
            if context and context.consent_status:
                session.consent_status = context.consent_status
        if payload.event_name == "page_viewed":
            session.page_view_count = (session.page_view_count or 0) + 1
        self.db.flush()

    @staticmethod
    def _clamped_occurred_at(value):
        if value is None:
            return None
        now = utcnow()
        if value.tzinfo is None:
            from datetime import timezone

            value = value.replace(tzinfo=timezone.utc)
        if abs(now - value) > _OCCURRED_AT_MAX_SKEW:
            return now
        return value

    def summary(self) -> AnalyticsSummaryData:
        return AnalyticsSummaryData(
            total_leads=self.leads.count(),
            total_contact_requests=self.contacts.count(),
            total_consultation_bookings=self.consultations.count(),
            total_handoff_requests=self.handoffs.count(),
            total_blueprint_generated_events=self.repository.count_by_event_name("blueprint_generate_completed")
            + self.repository.count_by_event_name("blueprint_generation_succeeded"),
            total_agent_message_events=self.repository.count_by_event_name("talk_to_agent_message_sent")
            + self.repository.count_by_event_name("agent_conversation_started"),
        )

    def _hash_ip(self, ip_address: str | None) -> str | None:
        """Salted, non-reversible hash — raw IPs are never stored."""
        if not ip_address:
            return None
        salt = self.settings.secret_key
        return hashlib.sha256(f"{salt}:{ip_address}".encode("utf-8")).hexdigest()

    def rate_limit_key(self, ip_address: str | None) -> str:
        return self._hash_ip(ip_address) or "unknown"
