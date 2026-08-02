"""Unified lead-capture layer.

Called by the contact, consultation, handoff and blueprint services after
their own records are written, inside the same transaction. Creates the
immutable `lead_submissions` event, keeps the person-level consent/identity
fields on `leads` current, and enqueues the matching `excel_sync_outbox`
event that feeds the shared Excel workbook.

Design rules enforced here:
- Supabase is the source of truth; Excel receives a flat reporting row only.
- Never a full chat transcript or AI prompt — `objective_summary` is capped.
- Anonymous activity never reaches this layer (a lead record is required).
- Accidental double-submits (same person, same source, same content within a
  short window) do not create a second submission or Excel row.
"""

import hashlib
from datetime import timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.base import utcnow
from app.models.lead import Lead
from app.models.lead_capture import (
    SHEET_SALES_ENQUIRIES,
    SHEET_WEBSITE_LEADS,
    SOURCE_TYPES,
    WEBSITE_LEAD_SOURCES,
    ExcelSyncOutbox,
    LeadSubmission,
)

DEDUPE_WINDOW_MINUTES = 10
SUMMARY_MAX_LENGTH = 500

ATTRIBUTION_KEYS = (
    "source_page",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "referrer",
    "consent_status",
    "marketing_consent",
    "privacy_policy_version",
)


def normalize_email(value: str | None) -> str | None:
    if not value:
        return None
    return value.strip().lower() or None


def attribution_from_metadata(metadata: dict[str, Any] | None) -> dict[str, Any]:
    """Attribution travels in the existing `metadata` dict so no public API
    contract changes shape; this lifts the known keys out safely."""
    metadata = metadata or {}
    out: dict[str, Any] = {}
    for key in ATTRIBUTION_KEYS:
        value = metadata.get(key)
        if isinstance(value, bool):
            out[key] = value
        elif isinstance(value, str) and value.strip():
            out[key] = value.strip()[:512]
    return out


def _summary(text: str | None) -> str | None:
    if not text:
        return None
    cleaned = " ".join(text.split())
    return cleaned[:SUMMARY_MAX_LENGTH] or None


class LeadCaptureService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def record_submission(
        self,
        *,
        lead: Lead,
        source_type: str,
        metadata: dict[str, Any] | None = None,
        objective_summary: str | None = None,
        blueprint_request_id: str | None = None,
        blueprint_result_id: str | None = None,
        chat_session_id: str | None = None,
        contact_request_id: str | None = None,
        consultation_booking_id: str | None = None,
        handoff_request_id: str | None = None,
        enquiry_fields: dict[str, Any] | None = None,
        submitted_at=None,
    ) -> LeadSubmission | None:
        """Create the immutable submission event + Excel outbox row.

        Runs inside the caller's transaction (no commit here). Returns None
        when the submission was suppressed as a double-submit duplicate.
        """
        if source_type not in SOURCE_TYPES:
            source_type = "contact"

        attribution = attribution_from_metadata(metadata)
        self._apply_identity_fields(lead, attribution)

        # Content-based fingerprint (link ids excluded deliberately): a
        # double-click posts identical content and must collapse to one
        # submission, while a genuine repeat enquiry later — or with different
        # content — is always kept.
        summary = _summary(objective_summary)
        dedupe_hash = hashlib.sha256(
            "|".join([lead.id, source_type, summary or ""]).encode("utf-8")
        ).hexdigest()

        cutoff = utcnow() - timedelta(minutes=DEDUPE_WINDOW_MINUTES)
        existing = self.db.scalar(
            select(LeadSubmission)
            .where(LeadSubmission.dedupe_hash == dedupe_hash)
            .where(LeadSubmission.submitted_at >= cutoff)
            .limit(1)
        )
        if existing is not None:
            return None

        submission = LeadSubmission(
            lead_id=lead.id,
            source_type=source_type,
            submitted_at=submitted_at or utcnow(),
            source_page=attribution.get("source_page"),
            blueprint_request_id=blueprint_request_id,
            blueprint_result_id=blueprint_result_id,
            chat_session_id=chat_session_id,
            contact_request_id=contact_request_id,
            consultation_booking_id=consultation_booking_id,
            handoff_request_id=handoff_request_id,
            objective_summary=summary,
            utm_source=attribution.get("utm_source"),
            utm_medium=attribution.get("utm_medium"),
            utm_campaign=attribution.get("utm_campaign"),
            referrer=attribution.get("referrer"),
            consent_status=attribution.get("consent_status"),
            marketing_consent=bool(attribution.get("marketing_consent", False)),
            dedupe_hash=dedupe_hash,
            metadata_json={},
        )
        self.db.add(submission)
        self.db.flush()

        sheet_key = SHEET_WEBSITE_LEADS if source_type in WEBSITE_LEAD_SOURCES else SHEET_SALES_ENQUIRIES
        payload = self._build_row(
            sheet_key=sheet_key,
            lead=lead,
            submission=submission,
            enquiry_fields=enquiry_fields or {},
        )
        self.db.add(
            ExcelSyncOutbox(
                event_id=submission.id,
                sheet_key=sheet_key,
                payload=payload,
                status="pending",
                attempt_count=0,
                next_attempt_at=utcnow(),
            )
        )
        return submission

    def _apply_identity_fields(self, lead: Lead, attribution: dict[str, Any]) -> None:
        normalized = normalize_email(lead.email)
        if normalized and lead.normalized_email != normalized:
            lead.normalized_email = normalized
        consent = attribution.get("consent_status")
        if consent:
            lead.consent_status = consent
        if attribution.get("marketing_consent"):
            lead.marketing_consent = True
        policy = attribution.get("privacy_policy_version")
        if policy:
            lead.privacy_policy_version = policy
        self.db.add(lead)

    def _build_row(
        self,
        *,
        sheet_key: str,
        lead: Lead,
        submission: LeadSubmission,
        enquiry_fields: dict[str, Any],
    ) -> dict[str, Any]:
        base = {
            "EventID": submission.id,
            "ContactID": lead.id,
            "ReceivedAt": submission.submitted_at.isoformat(),
            "Name": lead.name or enquiry_fields.get("name") or "",
            "Email": lead.normalized_email or normalize_email(lead.email) or "",
            "Phone": lead.phone or "",
            "Company": lead.company or enquiry_fields.get("company") or "",
            "JobTitle": lead.role or "",
            "Country": lead.country or "",
            "SourcePage": submission.source_page or "",
            "UTMSource": submission.utm_source or "",
            "UTMMedium": submission.utm_medium or "",
            "UTMCampaign": submission.utm_campaign or "",
            "ConsentStatus": submission.consent_status or "",
        }
        if sheet_key == SHEET_WEBSITE_LEADS:
            return {
                **base,
                "Source": "Blueprint" if submission.source_type == "blueprint" else "Talk to Agent",
                "BlueprintID": submission.blueprint_result_id or submission.blueprint_request_id or "",
                "AgentSessionID": submission.chat_session_id or "",
                "ObjectiveSummary": submission.objective_summary or "",
            }
        return {
            **base,
            "EnquiryType": enquiry_fields.get("enquiry_type") or submission.source_type,
            "BusinessObjective": enquiry_fields.get("business_objective") or "",
            "WorkshopTopic": enquiry_fields.get("workshop_topic") or "",
            "TeamSize": enquiry_fields.get("team_size") or "",
            "PreferredDate": enquiry_fields.get("preferred_date") or "",
            "PreferredTime": enquiry_fields.get("preferred_time") or "",
            "Timezone": enquiry_fields.get("timezone") or "",
            "Message": submission.objective_summary or "",
            "FollowUpStatus": "New",
            "Owner": "",
            "LastContacted": "",
            "NextFollowUp": "",
            "InternalNotes": "",
        }


def rebuild_row(db: Session, submission: LeadSubmission) -> tuple[str, dict[str, Any]] | None:
    """Reconstruct the Excel row for an existing submission (backfill/repair).

    Returns (sheet_key, payload) or None when the lead no longer exists.
    """
    from app.models.consultation import ConsultationBooking
    from app.models.contact import ContactRequest
    from app.models.handoff import HandoffRequest

    lead = db.get(Lead, submission.lead_id)
    if lead is None:
        return None

    enquiry_fields: dict[str, Any] = {"enquiry_type": submission.source_type}
    if submission.consultation_booking_id:
        booking = db.get(ConsultationBooking, submission.consultation_booking_id)
        if booking is not None:
            enquiry_fields.update(
                business_objective=booking.consultation_type,
                preferred_date=booking.preferred_date,
                preferred_time=booking.preferred_time,
                timezone=booking.timezone,
                workshop_topic=booking.notes if submission.source_type == "workshop" else None,
            )
    if submission.contact_request_id:
        request = db.get(ContactRequest, submission.contact_request_id)
        if request is not None:
            enquiry_fields.setdefault("name", request.name)
            enquiry_fields.setdefault("company", request.company)
    if submission.handoff_request_id:
        handoff = db.get(HandoffRequest, submission.handoff_request_id)
        if handoff is not None:
            enquiry_fields.setdefault("business_objective", handoff.handoff_type)

    sheet_key = SHEET_WEBSITE_LEADS if submission.source_type in WEBSITE_LEAD_SOURCES else SHEET_SALES_ENQUIRIES
    payload = LeadCaptureService(db)._build_row(
        sheet_key=sheet_key,
        lead=lead,
        submission=submission,
        enquiry_fields=enquiry_fields,
    )
    return sheet_key, payload
