"""Reporting endpoints.

All routes require the `X-Report-Secret` header matching DAILY_REPORT_SECRET.
They exist for two callers only:
- an external cron (backup trigger for the in-process scheduler, since the
  free Render instance can be asleep at 23:55 IST), and
- a future admin dashboard (summary endpoint), which can be built on top
  without further backend work.
"""

import hmac
from datetime import date, timedelta

from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import ApiException
from app.db.base import utcnow
from app.db.session import get_db
from app.models.daily_report import DailyReportRun
from app.schemas.common import APIResponse
from app.services.daily_report_service import DailyReportService, local_today
from app.services.report_metrics import compute_report_metrics

router = APIRouter(prefix="/reports", tags=["reports"])


def require_report_secret(x_report_secret: str | None = Header(default=None)) -> None:
    secret = get_settings().daily_report_secret
    if not secret:
        raise ApiException(code="reports_disabled", message="Reporting API is not configured.", status_code=404)
    if not x_report_secret or not hmac.compare_digest(x_report_secret, secret):
        raise ApiException(code="unauthorized", message="Invalid report secret.", status_code=401)


class TriggerReportRequest(BaseModel):
    # ISO date in the report timezone; defaults to yesterday (the completed day).
    report_date: str | None = None
    force: bool = False
    # When set, the report goes ONLY to this address (must equal the configured
    # REPORT_TEST_RECIPIENT) — production recipients are never mixed into tests.
    test_recipient: str | None = None


class ReportRunOut(BaseModel):
    report_date: str
    timezone: str
    status: str
    attempt_count: int
    provider_message_id: str | None = None
    error_message: str | None = None
    sent_at: str | None = None


def _run_out(run: DailyReportRun) -> ReportRunOut:
    return ReportRunOut(
        report_date=run.report_date.isoformat(),
        timezone=run.timezone,
        status=run.status,
        attempt_count=run.attempt_count,
        provider_message_id=run.provider_message_id,
        error_message=run.error_message,
        sent_at=run.sent_at.isoformat() if run.sent_at else None,
    )


@router.post("/daily/trigger", response_model=APIResponse[ReportRunOut], dependencies=[Depends(require_report_secret)])
def trigger_daily_report(payload: TriggerReportRequest, db: Session = Depends(get_db)) -> APIResponse[ReportRunOut]:
    settings = get_settings()
    service = DailyReportService(db, settings)

    if payload.report_date:
        try:
            report_date = date.fromisoformat(payload.report_date)
        except ValueError:
            raise ApiException(code="invalid_date", message="report_date must be YYYY-MM-DD.", status_code=422)
    else:
        report_date = local_today(settings) - timedelta(days=1)

    recipients: list[str] | None = None
    if payload.test_recipient:
        if not settings.report_test_recipient or payload.test_recipient != settings.report_test_recipient:
            raise ApiException(
                code="invalid_test_recipient",
                message="test_recipient must match the configured REPORT_TEST_RECIPIENT.",
                status_code=422,
            )
        recipients = [payload.test_recipient]
    elif not settings.report_recipient_list():
        raise ApiException(code="no_recipients", message="REPORT_RECIPIENTS is not configured.", status_code=422)

    run = service.run_for_date(report_date, recipients=recipients, force=payload.force or bool(recipients))
    return APIResponse(success=True, data=_run_out(run), error=None)


@router.get("/daily/status", response_model=APIResponse[list[ReportRunOut]], dependencies=[Depends(require_report_secret)])
def daily_report_status(db: Session = Depends(get_db)) -> APIResponse[list[ReportRunOut]]:
    runs = list(
        db.scalars(select(DailyReportRun).order_by(DailyReportRun.report_date.desc()).limit(30))
    )
    return APIResponse(success=True, data=[_run_out(run) for run in runs], error=None)


@router.get("/summary", response_model=APIResponse[dict], dependencies=[Depends(require_report_secret)])
def report_summary(days: int = 1, db: Session = Depends(get_db)) -> APIResponse[dict]:
    """Metrics for the last N local days (default: today), for a future dashboard."""
    settings = get_settings()
    days = max(1, min(days, 31))
    today = local_today(settings)
    out: dict = {"timezone": settings.report_timezone, "generated_at": utcnow().isoformat(), "days": {}}
    for offset in range(days):
        target = today - timedelta(days=offset)
        metrics = compute_report_metrics(db, target, settings.report_timezone)
        out["days"][target.isoformat()] = {
            "summary": metrics["summary"],
            "funnel": metrics["funnel"],
            "leads": metrics["leads"],
            "health": metrics["health"],
        }
    return APIResponse(success=True, data=out, error=None)
