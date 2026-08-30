"""Operational CLI for the daily activity report.

Run from the backend directory (same environment as the API):

    PYTHONPATH=".:../ai" python -m app.cli.daily_report status
    PYTHONPATH=".:../ai" python -m app.cli.daily_report seed-fake
    PYTHONPATH=".:../ai" python -m app.cli.daily_report send-test
    PYTHONPATH=".:../ai" python -m app.cli.daily_report send-test --date 2026-08-29
    PYTHONPATH=".:../ai" python -m app.cli.daily_report preview --date 2026-08-29

`seed-fake` writes clearly-labelled fake analytics events and one fake lead so
the report has content to render. `send-test` sends ONLY to
REPORT_TEST_RECIPIENT — it refuses to run when that variable is unset, so a
test can never reach the production recipients. `preview` writes the rendered
HTML/text to local files without sending anything.
"""

import argparse
import sys
import uuid
from datetime import date, timedelta

from sqlalchemy import select

from app.core.config import get_settings
from app.db.base import utcnow
from app.db.session import create_db_and_tables, get_session_factory
from app.models.daily_report import DailyReportRun
from app.models.lead import Lead
from app.repositories.analytics import AnalyticsRepository
from app.services.daily_report_service import DailyReportService, local_today
from app.services.lead_capture_service import LeadCaptureService
from app.services.report_email import render_report_html, render_report_text
from app.services.report_metrics import compute_report_metrics

FAKE_MARKER = {"seeded": "daily_report_cli_fake"}


def cmd_status(db, settings, _args) -> int:
    print(f"report_enabled: {settings.report_enabled}")
    print(f"recipients: {settings.report_recipient_list() or '(none configured)'}")
    print(f"test recipient: {settings.report_test_recipient or '(none configured)'}")
    print(f"timezone: {settings.report_timezone}")
    print(f"send at: {settings.report_send_hour:02d}:{settings.report_send_minute:02d}")
    runs = list(db.scalars(select(DailyReportRun).order_by(DailyReportRun.report_date.desc()).limit(10)))
    if not runs:
        print("runs: none yet")
    for run in runs:
        print(
            f"  {run.report_date} [{run.timezone}] {run.status} attempts={run.attempt_count} "
            f"message_id={run.provider_message_id or '-'} error={run.error_message or '-'}"
        )
    return 0


def cmd_seed_fake(db, _settings, _args) -> int:
    repo = AnalyticsRepository(db)
    session_key = f"fake-session-{uuid.uuid4().hex[:8]}"
    anon = f"fake-anon-{uuid.uuid4().hex[:8]}"

    def event(name: str, page: str, payload: dict | None = None) -> None:
        repo.create(
            event_id=str(uuid.uuid4()),
            event_name=name,
            source="seed_script",
            page_path=page,
            anonymous_id=anon,
            visitor_session_id=session_key,
            payload={**FAKE_MARKER, **(payload or {})},
        )

    event("session_started", "/")
    event("page_viewed", "/")
    event("page_viewed", "/contact")
    event("cta_clicked", "/", {"cta": "hero_generate_blueprint"})
    event("talk_to_agent_opened", "/")
    event("agent_conversation_started", "/")
    event("blueprint_opened", "/")
    event("blueprint_started", "/")
    event("blueprint_generation_attempted", "/", {"industry": "banking-financial-services"})
    event("blueprint_generation_succeeded", "/", {"industry": "banking-financial-services"})

    lead = Lead(
        email="fake.lead@example.test",
        name="Fake Lead (seed script)",
        company="Example Test Co",
        source="seed_script",
        metadata_json=dict(FAKE_MARKER),
    )
    db.add(lead)
    db.flush()
    LeadCaptureService(db).record_submission(
        lead=lead,
        source_type="contact",
        metadata={"source_page": "/contact", "consent_status": "privacy_policy_acknowledged"},
        objective_summary="Fake enquiry created by the daily-report seed script.",
    )
    db.commit()
    print(f"Seeded fake session {session_key} with 10 events and 1 fake lead (email fake.lead@example.test).")
    return 0


def _resolve_date(settings, value: str | None) -> date:
    if value:
        return date.fromisoformat(value)
    return local_today(settings) - timedelta(days=1)


def cmd_send_test(db, settings, args) -> int:
    if not settings.report_test_recipient:
        print("REPORT_TEST_RECIPIENT is not set — refusing to send a test report.", file=sys.stderr)
        return 1
    report_date = _resolve_date(settings, args.date)
    run = DailyReportService(db, settings).run_for_date(
        report_date, recipients=[settings.report_test_recipient], force=True
    )
    print(f"{run.report_date}: {run.status} (message_id={run.provider_message_id or '-'}, error={run.error_message or '-'})")
    return 0 if run.status == "sent" else 1


def cmd_preview(db, settings, args) -> int:
    report_date = _resolve_date(settings, args.date)
    metrics = compute_report_metrics(db, report_date, settings.report_timezone)
    html_path = f"daily_report_preview_{report_date}.html"
    text_path = f"daily_report_preview_{report_date}.txt"
    with open(html_path, "w", encoding="utf-8") as fh:
        fh.write(render_report_html(metrics, dashboard_url=settings.admin_dashboard_url))
    with open(text_path, "w", encoding="utf-8") as fh:
        fh.write(render_report_text(metrics))
    print(f"Wrote {html_path} and {text_path} (leads={len(metrics['leads'])}, activity={metrics['has_activity']}).")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Daily activity report operations.")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("status")
    sub.add_parser("seed-fake")
    p_test = sub.add_parser("send-test")
    p_test.add_argument("--date", default=None, help="Report date (YYYY-MM-DD, report timezone). Default: yesterday.")
    p_preview = sub.add_parser("preview")
    p_preview.add_argument("--date", default=None, help="Report date (YYYY-MM-DD, report timezone). Default: yesterday.")
    args = parser.parse_args()

    settings = get_settings()
    create_db_and_tables()
    handlers = {
        "status": cmd_status,
        "seed-fake": cmd_seed_fake,
        "send-test": cmd_send_test,
        "preview": cmd_preview,
    }
    with get_session_factory()() as db:
        return handlers[args.command](db, settings, args)


if __name__ == "__main__":
    raise SystemExit(main())
