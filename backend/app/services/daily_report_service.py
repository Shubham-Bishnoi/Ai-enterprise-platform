"""Daily report orchestration.

One `daily_report_runs` row per (report_date, timezone) is the idempotency
anchor: a `sent` row is never re-sent, a `failed` row is retried with backoff
until `report_max_attempts`, then parks as `dead` with the error recorded.
"""

from __future__ import annotations

import logging
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.db.base import utcnow
from app.models.daily_report import (
    REPORT_STATUS_DEAD,
    REPORT_STATUS_FAILED,
    REPORT_STATUS_RUNNING,
    REPORT_STATUS_SENT,
    DailyReportRun,
)
from app.services.notification_providers import EmailDeliveryError, build_email_provider
from app.services.report_email import render_report_html, render_report_text, report_subject
from app.services.report_metrics import compute_report_metrics

logger = logging.getLogger("app.daily_report")

# Backoff between failed attempts: 2m, 4m, 8m, ... capped at 30m.
BACKOFF_BASE_SECONDS = 120
BACKOFF_CAP_SECONDS = 1800


def is_report_configured(settings: Settings) -> bool:
    return bool(settings.report_enabled and settings.report_recipient_list())


def local_today(settings: Settings, now: datetime | None = None) -> date:
    tz = ZoneInfo(settings.report_timezone)
    return (now or utcnow()).astimezone(tz).date()


class DailyReportService:
    def __init__(self, db: Session, settings: Settings) -> None:
        self.db = db
        self.settings = settings

    def get_run(self, report_date: date) -> DailyReportRun | None:
        return self.db.scalar(
            select(DailyReportRun)
            .where(DailyReportRun.report_date == report_date)
            .where(DailyReportRun.timezone == self.settings.report_timezone)
        )

    def run_for_date(
        self,
        report_date: date,
        *,
        recipients: list[str] | None = None,
        force: bool = False,
    ) -> DailyReportRun:
        """Compute, render and send the report for one local calendar day.

        Never raises for delivery problems — the outcome lives on the returned
        run row. `recipients` overrides the configured list (test sends only).
        """
        to_emails = recipients or self.settings.report_recipient_list()
        if not to_emails:
            raise ValueError("No report recipients configured.")

        run = self.get_run(report_date)
        if run is not None and run.status == REPORT_STATUS_SENT and not force:
            return run
        if run is not None and run.status == REPORT_STATUS_DEAD and not force:
            return run

        if run is None:
            run = DailyReportRun(
                report_date=report_date,
                timezone=self.settings.report_timezone,
                status=REPORT_STATUS_RUNNING,
                recipients={"to": to_emails},
                totals={},
                attempt_count=0,
                started_at=utcnow(),
            )
            self.db.add(run)
        else:
            run.status = REPORT_STATUS_RUNNING
            run.recipients = {"to": to_emails}
            run.started_at = utcnow()
        run.attempt_count = (run.attempt_count or 0) + 1
        self.db.flush()

        try:
            metrics = compute_report_metrics(self.db, report_date, self.settings.report_timezone)
            subject = report_subject(report_date, len(metrics["leads"]))
            html = render_report_html(metrics, dashboard_url=self.settings.admin_dashboard_url)
            text = render_report_text(metrics)

            provider = build_email_provider(self.settings)
            message_id = provider.send_email(
                from_email=self.settings.report_from_email,
                to_emails=to_emails,
                subject=subject,
                html=html,
                text=text,
            )
        except EmailDeliveryError as exc:
            self._mark_failure(run, str(exc), retryable=exc.retryable)
        except Exception as exc:  # metric/render bugs must also surface as failed runs
            logger.exception("daily report run failed date=%s", report_date)
            self._mark_failure(run, f"{type(exc).__name__}: {exc}", retryable=True)
        else:
            run.status = REPORT_STATUS_SENT
            run.totals = metrics["summary"]
            run.provider_message_id = message_id
            run.sent_at = utcnow()
            run.error_message = None
            run.next_attempt_at = None
            logger.info(
                "daily report sent date=%s recipients=%s message_id=%s",
                report_date,
                len(to_emails),
                message_id,
            )

        self.db.commit()
        return run

    def _mark_failure(self, run: DailyReportRun, error: str, *, retryable: bool) -> None:
        run.error_message = error[:500]
        exhausted = run.attempt_count >= self.settings.report_max_attempts
        if retryable and not exhausted:
            delay = min(BACKOFF_BASE_SECONDS * (2 ** (run.attempt_count - 1)), BACKOFF_CAP_SECONDS)
            run.status = REPORT_STATUS_FAILED
            run.next_attempt_at = utcnow() + timedelta(seconds=delay)
        else:
            run.status = REPORT_STATUS_DEAD
            run.next_attempt_at = None
        logger.warning(
            "daily report failed date=%s attempt=%s status=%s error=%s",
            run.report_date,
            run.attempt_count,
            run.status,
            error,
        )

    def due_report_dates(self, now: datetime | None = None) -> list[date]:
        """Report dates that should be (re)tried right now.

        - Today's date once the local send time has passed.
        - Yesterday, if it was never sent (covers restarts/sleeps past 23:55).
        - Any failed run whose backoff has elapsed.
        """
        now = now or utcnow()
        tz = ZoneInfo(self.settings.report_timezone)
        local_now = now.astimezone(tz)
        due: list[date] = []

        send_time_passed = (local_now.hour, local_now.minute) >= (
            self.settings.report_send_hour,
            self.settings.report_send_minute,
        )

        candidates = [local_now.date() - timedelta(days=1)]
        if send_time_passed:
            candidates.append(local_now.date())

        for candidate in candidates:
            run = self.get_run(candidate)
            if run is None:
                due.append(candidate)
            elif run.status == REPORT_STATUS_FAILED and (
                run.next_attempt_at is None or self._as_utc(run.next_attempt_at) <= now
            ):
                due.append(candidate)
        return due

    @staticmethod
    def _as_utc(value: datetime) -> datetime:
        from datetime import timezone

        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value
