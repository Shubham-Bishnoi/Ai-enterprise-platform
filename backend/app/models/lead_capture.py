"""Normalized lead-capture layer.

`lead_submissions` is the immutable event log: one row for every meaningful
submission (blueprint, talk-to-agent capture, contact, consultation, workshop,
proposal, human handoff), linked to the person in `leads` and to the
type-specific operational record. `excel_sync_outbox` is the reliable outbox
that feeds the shared Excel workbook via Power Automate — Excel is a reporting
view only; Supabase remains the source of truth.
"""

from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow

SOURCE_TYPES = (
    "blueprint",
    "talk_to_agent",
    "contact",
    "consultation",
    "workshop",
    "proposal",
    "human_handoff",
)

# source_type -> Excel worksheet dataset
WEBSITE_LEAD_SOURCES = ("blueprint", "talk_to_agent")
SALES_ENQUIRY_SOURCES = ("contact", "consultation", "workshop", "proposal", "human_handoff")

SHEET_WEBSITE_LEADS = "website_leads"
SHEET_SALES_ENQUIRIES = "sales_enquiries"


class LeadSubmission(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "lead_submissions"

    lead_id: Mapped[str] = mapped_column(ForeignKey("leads.id"), index=True)
    source_type: Mapped[str] = mapped_column(String(32), index=True)
    source_page: Mapped[str | None] = mapped_column(String(512), nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)

    # Links to the type-specific operational records (all optional).
    blueprint_request_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    blueprint_result_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    chat_session_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    contact_request_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    consultation_booking_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    handoff_request_id: Mapped[str | None] = mapped_column(String(64), nullable=True)

    # Short, Excel-safe summary. Never a full transcript.
    objective_summary: Mapped[str | None] = mapped_column(String(500), nullable=True)

    utm_source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    utm_medium: Mapped[str | None] = mapped_column(String(255), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(255), nullable=True)
    referrer: Mapped[str | None] = mapped_column(String(512), nullable=True)

    consent_status: Mapped[str | None] = mapped_column(String(64), nullable=True)
    marketing_consent: Mapped[bool] = mapped_column(Boolean, default=False)

    # Short fingerprint used to suppress accidental double-submits.
    dedupe_hash: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)

    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)


class ExcelSyncOutbox(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "excel_sync_outbox"

    # One outbox event per submission; also the idempotency key sent to
    # Power Automate as EventID / X-GFFAI-Event-ID.
    event_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    sheet_key: Mapped[str] = mapped_column(String(32), index=True)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)

    # pending -> synced | failed (retryable) -> dead (max attempts exceeded)
    status: Mapped[str] = mapped_column(String(16), default="pending", index=True)
    attempt_count: Mapped[int] = mapped_column(Integer, default=0)
    next_attempt_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    last_error: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
