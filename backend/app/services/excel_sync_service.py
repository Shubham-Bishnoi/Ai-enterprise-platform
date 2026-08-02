"""Excel sync worker: drains `excel_sync_outbox` to Power Automate.

The outbox pattern keeps the visitor's submission independent from Microsoft:
the lead is committed to Supabase first; this worker later delivers each
event to the Power Automate HTTP trigger, which appends the row to the shared
workbook. Failures never touch the original lead — they only reschedule the
outbox event with exponential backoff until `excel_sync_max_attempts`, after
which the event parks in the `dead` state for manual retry via the CLI.

Idempotency: every request carries the immutable submission id as both
`eventId` in the body and the `X-GFFAI-Event-ID` header; the flow checks it
before appending, so duplicate deliveries cannot create duplicate rows.
"""

import logging
from datetime import timedelta

import httpx
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.db.base import utcnow
from app.models.lead_capture import ExcelSyncOutbox

logger = logging.getLogger("app.excel_sync")

SCHEMA_VERSION = "1.0"
REQUEST_TIMEOUT_SECONDS = 20.0
# Backoff: 30s, 1m, 2m, 4m, ... capped at 1h.
BACKOFF_BASE_SECONDS = 30
BACKOFF_CAP_SECONDS = 3600

RETRYABLE_STATUS_CODES = {408, 429}


def is_configured(settings: Settings) -> bool:
    return bool(settings.excel_sync_enabled and settings.excel_sync_webhook_url)


def _post_event(url: str, *, json: dict, headers: dict) -> httpx.Response:
    """Isolated so tests can monkeypatch the network call."""
    with httpx.Client(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        return client.post(url, json=json, headers=headers)


class ExcelSyncService:
    def __init__(self, db: Session, settings: Settings) -> None:
        self.db = db
        self.settings = settings

    def due_events(self, limit: int) -> list[ExcelSyncOutbox]:
        stmt = (
            select(ExcelSyncOutbox)
            .where(ExcelSyncOutbox.status.in_(["pending", "failed"]))
            .where(ExcelSyncOutbox.next_attempt_at <= utcnow())
            .order_by(ExcelSyncOutbox.created_at)
            .limit(limit)
        )
        return list(self.db.scalars(stmt))

    def process_due(self, *, batch_size: int | None = None, dry_run: bool = False) -> dict:
        """Deliver due outbox events. Returns a summary dict."""
        limit = batch_size or self.settings.excel_sync_batch_size
        events = self.due_events(limit)
        summary = {"selected": len(events), "synced": 0, "retried": 0, "dead": 0, "skipped": 0}

        if dry_run:
            summary["skipped"] = len(events)
            return summary

        if not is_configured(self.settings):
            summary["skipped"] = len(events)
            return summary

        for event in events:
            self._deliver(event, summary)
        self.db.commit()
        return summary

    def _deliver(self, event: ExcelSyncOutbox, summary: dict) -> None:
        headers = {
            "Content-Type": "application/json",
            "X-GFFAI-Event-ID": event.event_id,
        }
        if self.settings.excel_sync_webhook_secret:
            headers["X-GFFAI-Webhook-Secret"] = self.settings.excel_sync_webhook_secret

        body = {
            "schemaVersion": SCHEMA_VERSION,
            "eventId": event.event_id,
            "sheetKey": event.sheet_key,
            "row": event.payload,
        }

        try:
            response = _post_event(self.settings.excel_sync_webhook_url or "", json=body, headers=headers)
        except httpx.HTTPError as exc:
            self._mark_failure(event, f"network: {type(exc).__name__}", retryable=True)
            summary["retried" if event.status == "failed" else "dead"] += 1
            return

        if 200 <= response.status_code < 300:
            event.status = "synced"
            event.synced_at = utcnow()
            event.last_error = None
            self.db.add(event)
            summary["synced"] += 1
            logger.info("excel_sync synced event=%s sheet=%s", event.event_id, event.sheet_key)
            return

        retryable = response.status_code >= 500 or response.status_code in RETRYABLE_STATUS_CODES
        self._mark_failure(event, f"http {response.status_code}", retryable=retryable)
        summary["retried" if event.status == "failed" else "dead"] += 1

    def _mark_failure(self, event: ExcelSyncOutbox, error: str, *, retryable: bool) -> None:
        event.attempt_count += 1
        event.last_error = error[:500]
        exhausted = event.attempt_count >= self.settings.excel_sync_max_attempts
        if retryable and not exhausted:
            delay = min(BACKOFF_BASE_SECONDS * (2 ** (event.attempt_count - 1)), BACKOFF_CAP_SECONDS)
            event.status = "failed"
            event.next_attempt_at = utcnow() + timedelta(seconds=delay)
        else:
            event.status = "dead"
        self.db.add(event)
        # Event id + error class only — payloads hold personal data.
        logger.warning(
            "excel_sync failed event=%s attempt=%s status=%s error=%s",
            event.event_id,
            event.attempt_count,
            event.status,
            error,
        )

    def retry(self, *, event_id: str | None = None, include_dead: bool = False, reset_attempts: bool = False) -> int:
        """Re-queue failed (and optionally dead) events. Returns count."""
        stmt = select(ExcelSyncOutbox)
        if event_id:
            stmt = stmt.where(ExcelSyncOutbox.event_id == event_id)
        else:
            statuses = ["failed", "dead"] if include_dead else ["failed"]
            stmt = stmt.where(ExcelSyncOutbox.status.in_(statuses))
        events = list(self.db.scalars(stmt))
        for event in events:
            event.status = "pending"
            event.next_attempt_at = utcnow()
            if reset_attempts:
                event.attempt_count = 0
            self.db.add(event)
        self.db.commit()
        return len(events)

    def status_counts(self) -> dict:
        stmt = select(ExcelSyncOutbox.sheet_key, ExcelSyncOutbox.status, func.count()).group_by(
            ExcelSyncOutbox.sheet_key, ExcelSyncOutbox.status
        )
        counts: dict = {}
        for sheet_key, status, count in self.db.execute(stmt):
            counts.setdefault(sheet_key, {})[status] = count
        return counts
