"""Operational CLI for the Supabase -> Excel lead sync.

Run from the backend directory (same environment as the API):

    PYTHONPATH=".:../ai" python -m app.cli.lead_excel_sync status
    PYTHONPATH=".:../ai" python -m app.cli.lead_excel_sync run-once --batch-size 25
    PYTHONPATH=".:../ai" python -m app.cli.lead_excel_sync retry --failed
    PYTHONPATH=".:../ai" python -m app.cli.lead_excel_sync retry --event-id <uuid>
    PYTHONPATH=".:../ai" python -m app.cli.lead_excel_sync backfill --from 2026-01-01 --to 2026-08-31 --dry-run
    PYTHONPATH=".:../ai" python -m app.cli.lead_excel_sync backfill --from 2026-01-01 --execute

`backfill` is dry-run by default: it reports what would be created and sends
nothing until `--execute` is passed. It covers two gaps: (a) historical
records created before the submission layer existed (contact requests,
consultation bookings, handoffs with a lead, blueprint requests) get a
retroactive `lead_submissions` row, and (b) submissions missing an outbox
event get one. Already-exported EventIDs are always skipped, so re-running
can never create duplicate Excel rows.
"""

import argparse
import sys
from datetime import datetime, timezone

from sqlalchemy import select

from app.core.config import get_settings
from app.db.session import create_db_and_tables, get_session_factory
from app.models.consultation import ConsultationBooking
from app.models.contact import ContactRequest
from app.models.handoff import HandoffRequest
from app.models.blueprint import BlueprintRequest, BlueprintResult
from app.models.lead import Lead
from app.models.lead_capture import ExcelSyncOutbox, LeadSubmission, SOURCE_TYPES
from app.services.excel_sync_service import ExcelSyncService, is_configured
from app.services.lead_capture_service import LeadCaptureService, rebuild_row

INTENT_SOURCE_TYPES = {
    "book_workshop": "workshop",
    "book_consultation": "consultation",
    "request_proposal": "proposal",
}
HANDOFF_SOURCE_TYPES = {"proposal": "proposal", "workshop": "workshop"}


def _parse_date(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=timezone.utc)


def cmd_status(db, settings, _args) -> int:
    service = ExcelSyncService(db, settings)
    print(f"configured: {is_configured(settings)} (enabled={settings.excel_sync_enabled})")
    counts = service.status_counts()
    if not counts:
        print("outbox: empty")
    for sheet, statuses in counts.items():
        print(f"{sheet}: " + ", ".join(f"{status}={count}" for status, count in sorted(statuses.items())))
    return 0


def cmd_run_once(db, settings, args) -> int:
    service = ExcelSyncService(db, settings)
    summary = service.process_due(batch_size=args.batch_size, dry_run=args.dry_run)
    print(summary)
    return 0


def cmd_retry(db, settings, args) -> int:
    service = ExcelSyncService(db, settings)
    count = service.retry(
        event_id=args.event_id,
        include_dead=args.dead or bool(args.event_id),
        reset_attempts=args.reset_attempts,
    )
    print(f"re-queued {count} event(s)")
    return 0


def _submission_exists(db, **link) -> bool:
    (column_name, value), = link.items()
    column = getattr(LeadSubmission, column_name)
    return db.scalar(select(LeadSubmission.id).where(column == value).limit(1)) is not None


def cmd_backfill(db, settings, args) -> int:
    execute = args.execute and not args.dry_run
    date_from = _parse_date(getattr(args, "from"))
    date_to = _parse_date(args.to) if args.to else datetime.now(timezone.utc)
    sources = set(args.source or SOURCE_TYPES)
    capture = LeadCaptureService(db)
    summary = {"selected": 0, "created_submissions": 0, "created_outbox": 0, "skipped": 0, "failed": 0}

    def in_range(dt) -> bool:
        if dt is None:
            return False
        aware = dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        return date_from <= aware <= date_to

    def record(*, lead_id, source_type, created_at, summary_text, **links) -> None:
        summary["selected"] += 1
        lead = db.get(Lead, lead_id) if lead_id else None
        if lead is None or source_type not in sources:
            summary["skipped"] += 1
            return
        if not execute:
            return
        created = capture.record_submission(
            lead=lead,
            source_type=source_type,
            objective_summary=summary_text,
            submitted_at=created_at,
            **links,
        )
        if created is None:
            summary["skipped"] += 1
        else:
            summary["created_submissions"] += 1
            summary["created_outbox"] += 1

    # (a) Historical operational records without a submission row.
    for request in db.scalars(select(ContactRequest)):
        if not in_range(request.created_at) or _submission_exists(db, contact_request_id=request.id):
            continue
        record(
            lead_id=request.lead_id,
            source_type=INTENT_SOURCE_TYPES.get(request.intent, "contact"),
            created_at=request.created_at,
            summary_text=request.message,
            contact_request_id=request.id,
        )

    for booking in db.scalars(select(ConsultationBooking)):
        if not in_range(booking.created_at) or _submission_exists(db, consultation_booking_id=booking.id):
            continue
        record(
            lead_id=booking.lead_id,
            source_type="workshop" if booking.consultation_type == "executive_workshop" else "consultation",
            created_at=booking.created_at,
            summary_text=booking.notes,
            consultation_booking_id=booking.id,
        )

    for handoff in db.scalars(select(HandoffRequest)):
        if not in_range(handoff.created_at) or _submission_exists(db, handoff_request_id=handoff.id):
            continue
        record(
            lead_id=handoff.lead_id,
            source_type=HANDOFF_SOURCE_TYPES.get(handoff.handoff_type, "human_handoff"),
            created_at=handoff.created_at,
            summary_text=handoff.summary,
            chat_session_id=handoff.chat_session_id,
            blueprint_result_id=handoff.blueprint_result_id,
            handoff_request_id=handoff.id,
        )

    for request in db.scalars(select(BlueprintRequest)):
        if not in_range(request.created_at) or _submission_exists(db, blueprint_request_id=request.id):
            continue
        result_id = db.scalar(
            select(BlueprintResult.id).where(BlueprintResult.request_id == request.id).limit(1)
        )
        record(
            lead_id=request.lead_id,
            source_type="blueprint",
            created_at=request.created_at,
            summary_text="; ".join(request.top_priorities or []),
            blueprint_request_id=request.id,
            blueprint_result_id=result_id,
        )

    # (b) Submissions that are missing an outbox event entirely.
    for submission in db.scalars(select(LeadSubmission)):
        if not in_range(submission.submitted_at) or submission.source_type not in sources:
            continue
        exists = db.scalar(
            select(ExcelSyncOutbox.id).where(ExcelSyncOutbox.event_id == submission.id).limit(1)
        )
        if exists:
            continue
        summary["selected"] += 1
        if not execute:
            continue
        rebuilt = rebuild_row(db, submission)
        if rebuilt is None:
            summary["failed"] += 1
            continue
        sheet_key, payload = rebuilt
        db.add(
            ExcelSyncOutbox(
                event_id=submission.id,
                sheet_key=sheet_key,
                payload=payload,
                status="pending",
            )
        )
        summary["created_outbox"] += 1

    if execute:
        db.commit()
    mode = "EXECUTED" if execute else "DRY RUN (pass --execute to apply)"
    print(f"backfill {mode}: {summary}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="lead_excel_sync", description="Supabase -> Excel lead sync operations")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("status", help="Show outbox counts by sheet and status")

    run_once = sub.add_parser("run-once", help="Process due outbox events now")
    run_once.add_argument("--batch-size", type=int, default=None)
    run_once.add_argument("--dry-run", action="store_true")

    retry = sub.add_parser("retry", help="Re-queue failed/dead events")
    retry.add_argument("--event-id")
    retry.add_argument("--failed", action="store_true", help="Re-queue all failed events (default)")
    retry.add_argument("--dead", action="store_true", help="Also re-queue dead events")
    retry.add_argument("--reset-attempts", action="store_true")

    backfill = sub.add_parser("backfill", help="Create missing submissions/outbox events for historical records")
    backfill.add_argument("--from", required=True, help="YYYY-MM-DD (inclusive, UTC)")
    backfill.add_argument("--to", help="YYYY-MM-DD (inclusive, UTC; default now)")
    backfill.add_argument("--source", action="append", choices=list(SOURCE_TYPES))
    backfill.add_argument("--batch-size", type=int, default=500)
    backfill.add_argument("--dry-run", action="store_true", help="Default behaviour; kept for explicitness")
    backfill.add_argument("--execute", action="store_true", help="Apply changes (otherwise dry run)")

    args = parser.parse_args(argv)
    settings = get_settings()
    create_db_and_tables()

    handlers = {
        "status": cmd_status,
        "run-once": cmd_run_once,
        "retry": cmd_retry,
        "backfill": cmd_backfill,
    }
    with get_session_factory()() as db:
        return handlers[args.command](db, settings, args)


if __name__ == "__main__":
    sys.exit(main())
