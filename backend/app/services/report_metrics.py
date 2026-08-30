"""Daily report metrics.

Computes everything the daily activity email needs for one calendar day in
the report timezone (Asia/Kolkata by default). The IST day is converted to a
UTC window and applied to the stored (UTC) timestamps — never a naive "UTC
midnight" cut.

Aggregation runs in Python over the day's rows: a single marketing site
produces a small daily volume, and this keeps every query portable between
the SQLite test database and Supabase Postgres.
"""

from __future__ import annotations

from collections import Counter
from datetime import date, datetime, time, timedelta, timezone
from urllib.parse import urlparse
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analytics import AnalyticsEvent, AnalyticsSession
from app.models.consultation import ConsultationBooking
from app.models.contact import ContactRequest
from app.models.daily_report import DailyReportRun
from app.models.handoff import HandoffRequest
from app.models.lead import Lead
from app.models.lead_capture import ExcelSyncOutbox, LeadSubmission

# Canonical client names + the authoritative server-side names recorded by
# the blueprint/chat services. The legacy client `blueprint_generate_submitted`
# is deliberately NOT counted as an attempt: the server records
# `blueprint_generate_started` for the same generation, and counting both
# would double every attempt.
BLUEPRINT_ATTEMPT_EVENTS = {"blueprint_generation_attempted", "blueprint_generate_started"}
BLUEPRINT_SUCCESS_EVENTS = {"blueprint_generation_succeeded", "blueprint_generate_completed"}
BLUEPRINT_FAILURE_EVENTS = {"blueprint_generation_failed", "blueprint_generate_failed"}
AGENT_STARTED_EVENTS = {"agent_conversation_started", "talk_to_agent_message_sent"}
RECOMMENDATION_EVENTS = {"recommendation_shown", "talk_to_agent_recommendation_shown"}

SOURCE_TYPE_LABELS = {
    "blueprint": "Blueprint",
    "talk_to_agent": "Talk to Agent",
    "contact": "Contact enquiry",
    "consultation": "Demo / consultation",
    "workshop": "Workshop",
    "proposal": "Proposal",
    "human_handoff": "Human handoff",
}


def day_window_utc(report_date: date, tz_name: str) -> tuple[datetime, datetime]:
    tz = ZoneInfo(tz_name)
    start_local = datetime.combine(report_date, time.min, tzinfo=tz)
    end_local = start_local + timedelta(days=1)
    return start_local.astimezone(timezone.utc), end_local.astimezone(timezone.utc)


def _as_utc(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _in_window(value: datetime | None, start: datetime, end: datetime) -> bool:
    normalized = _as_utc(value)
    return normalized is not None and start <= normalized < end


def _pct(part: int, whole: int) -> float:
    if whole <= 0:
        return 0.0
    return round(100.0 * part / whole, 1)


def _top(counter: Counter, limit: int = 5) -> list[dict]:
    return [{"label": label, "count": count} for label, count in counter.most_common(limit) if label]


def _traffic_source(session: AnalyticsSession) -> str:
    if session.utm_source:
        return session.utm_source
    if session.referrer:
        host = urlparse(session.referrer).netloc
        return host or session.referrer
    return "direct"


def compute_report_metrics(db: Session, report_date: date, tz_name: str) -> dict:
    start, end = day_window_utc(report_date, tz_name)
    tz = ZoneInfo(tz_name)

    # ---- raw rows for the day (Python-side windowing for portability) ----
    events = [
        e
        for e in db.scalars(select(AnalyticsEvent).order_by(AnalyticsEvent.created_at.asc()))
        if _in_window(e.created_at, start, end)
    ]
    sessions = [
        s
        for s in db.scalars(select(AnalyticsSession))
        if _as_utc(s.last_seen_at) is not None
        and _as_utc(s.last_seen_at) >= start
        and _as_utc(s.first_seen_at) is not None
        and _as_utc(s.first_seen_at) < end
    ]
    submissions = [
        s for s in db.scalars(select(LeadSubmission)) if _in_window(s.submitted_at, start, end)
    ]

    def events_named(names: set[str]) -> list[AnalyticsEvent]:
        return [e for e in events if e.event_name in names]

    def distinct_actor_count(names: set[str]) -> int:
        """Count events by distinct actor so per-message events don't overcount.

        The chat session id comes first: client- and server-side events for
        the same conversation share it, so the conversation counts once.
        """
        actors = {(e.session_id or e.visitor_session_id or e.anonymous_id or e.id) for e in events_named(names)}
        return len(actors)

    # ---- sessions ----
    page_views = len(events_named({"page_viewed"}))
    session_keys = {s.session_key for s in sessions} | {
        e.visitor_session_id for e in events if e.visitor_session_id
    }
    unique_sessions = len(session_keys)

    day_anon_ids = {s.anonymous_id for s in sessions if s.anonymous_id}
    returning_sessions = 0
    if day_anon_ids:
        earlier = db.scalars(
            select(AnalyticsSession).where(AnalyticsSession.anonymous_id.in_(day_anon_ids))
        ).all()
        prior_anon = {
            s.anonymous_id
            for s in earlier
            if _as_utc(s.first_seen_at) is not None and _as_utc(s.first_seen_at) < start
        }
        returning_sessions = sum(1 for s in sessions if s.anonymous_id in prior_anon)

    # ---- conversions from the authoritative lead_submissions table ----
    by_type = Counter(s.source_type for s in submissions)
    contact_enquiries = by_type.get("contact", 0)
    demo_consultations = by_type.get("consultation", 0)
    workshops = by_type.get("workshop", 0)
    proposals = by_type.get("proposal", 0)
    handoffs = by_type.get("human_handoff", 0)
    website_leads = by_type.get("blueprint", 0) + by_type.get("talk_to_agent", 0)
    identified_lead_ids = {s.lead_id for s in submissions}

    # ---- blueprint + agent journey events ----
    blueprint_opened = distinct_actor_count({"blueprint_opened"})
    blueprint_started = distinct_actor_count({"blueprint_started"})
    blueprint_attempts = len(events_named(BLUEPRINT_ATTEMPT_EVENTS))
    blueprint_successes = len(events_named(BLUEPRINT_SUCCESS_EVENTS))
    blueprint_failures = len(events_named(BLUEPRINT_FAILURE_EVENTS))
    blueprint_abandoned = len(events_named({"blueprint_abandoned"})) + max(
        0, blueprint_started - blueprint_attempts
    )

    agent_opened = distinct_actor_count({"talk_to_agent_opened"})
    agent_started = distinct_actor_count(AGENT_STARTED_EVENTS)
    agent_completed = distinct_actor_count({"agent_conversation_completed"})
    recommendations_shown = len(events_named(RECOMMENDATION_EVENTS))

    contact_details_submitted = len(submissions)
    conversion_actions = len(submissions)

    # ---- funnel ----
    funnel = [
        {"stage": "Website sessions", "count": unique_sessions, "pct_of_sessions": _pct(unique_sessions, unique_sessions)},
        {"stage": "Talk to Agent opened", "count": agent_opened, "pct_of_sessions": _pct(agent_opened, unique_sessions)},
        {"stage": "Agent conversations started", "count": agent_started, "pct_of_sessions": _pct(agent_started, unique_sessions)},
        {"stage": "Recommendations shown", "count": recommendations_shown, "pct_of_sessions": _pct(recommendations_shown, unique_sessions)},
        {"stage": "Blueprint started", "count": blueprint_started, "pct_of_sessions": _pct(blueprint_started, unique_sessions)},
        {"stage": "Blueprint attempted", "count": blueprint_attempts, "pct_of_sessions": _pct(blueprint_attempts, unique_sessions)},
        {"stage": "Blueprint generated", "count": blueprint_successes, "pct_of_sessions": _pct(blueprint_successes, unique_sessions)},
        {"stage": "Contact details submitted", "count": contact_details_submitted, "pct_of_sessions": _pct(contact_details_submitted, unique_sessions)},
        {
            "stage": "Demo / proposal / workshop requested",
            "count": demo_consultations + proposals + workshops,
            "pct_of_sessions": _pct(demo_consultations + proposals + workshops, unique_sessions),
        },
    ]

    # ---- top activity ----
    top_pages = _top(Counter(e.page_path for e in events_named({"page_viewed"}) if e.page_path))
    top_landing = _top(Counter(s.landing_page for s in sessions if s.landing_page))
    top_ctas = _top(
        Counter(
            str(e.payload.get("cta") or e.component or "unknown")
            for e in events_named({"cta_clicked"})
        )
    )
    top_sources = _top(Counter(_traffic_source(s) for s in sessions))
    top_campaigns = _top(Counter(s.utm_campaign for s in sessions if s.utm_campaign))

    industry_counter: Counter = Counter()
    for e in events_named(BLUEPRINT_ATTEMPT_EVENTS | {"industry_identified"}):
        industry = e.payload.get("industry")
        if industry:
            industry_counter[str(industry)] += 1
    top_industries = _top(industry_counter)

    objective_counter: Counter = Counter()
    for submission in submissions:
        if submission.consultation_booking_id:
            booking = db.get(ConsultationBooking, submission.consultation_booking_id)
            if booking is not None and booking.consultation_type:
                objective_counter[booking.consultation_type] += 1
        elif submission.handoff_request_id:
            handoff = db.get(HandoffRequest, submission.handoff_request_id)
            if handoff is not None and handoff.handoff_type:
                objective_counter[handoff.handoff_type] += 1
    for e in events_named({"objective_identified"}):
        objective = e.payload.get("objective")
        if objective:
            objective_counter[str(objective)] += 1
    top_objectives = _top(objective_counter)

    devices = _top(Counter(s.device_category or "unknown" for s in sessions))

    # ---- identifiable lead details (voluntary submissions only) ----
    leads_out: list[dict] = []
    for submission in sorted(submissions, key=lambda s: _as_utc(s.submitted_at) or start):
        lead = db.get(Lead, submission.lead_id)
        if lead is None:
            continue
        follow_up = "new"
        if submission.contact_request_id:
            record = db.get(ContactRequest, submission.contact_request_id)
            follow_up = getattr(record, "status", None) or follow_up
        elif submission.consultation_booking_id:
            record = db.get(ConsultationBooking, submission.consultation_booking_id)
            follow_up = getattr(record, "status", None) or follow_up
        elif submission.handoff_request_id:
            record = db.get(HandoffRequest, submission.handoff_request_id)
            follow_up = getattr(record, "status", None) or follow_up

        submitted_local = (_as_utc(submission.submitted_at) or start).astimezone(tz)
        leads_out.append(
            {
                "time_local": submitted_local.strftime("%H:%M"),
                "name": lead.name or "",
                "email": lead.normalized_email or (lead.email or "").lower(),
                "phone": lead.phone or "",
                "company": lead.company or "",
                "role": lead.role or "",
                "country": lead.country or "",
                "industry": lead.industry or "",
                "type": SOURCE_TYPE_LABELS.get(submission.source_type, submission.source_type),
                "source_page": submission.source_page or "",
                "blueprint_id": submission.blueprint_result_id or submission.blueprint_request_id or "",
                "agent_session_id": submission.chat_session_id or "",
                "utm_source": submission.utm_source or "",
                "utm_campaign": submission.utm_campaign or "",
                "summary": (submission.objective_summary or "")[:200],
                "follow_up_status": follow_up,
            }
        )

    # ---- operational health ----
    failed_forms = len(events_named({"form_submission_failed"}))
    outbox_rows = [o for o in db.scalars(select(ExcelSyncOutbox)) if _in_window(o.created_at, start, end)]
    excel_failed = sum(1 for o in outbox_rows if o.status == "failed")
    excel_dead = sum(1 for o in outbox_rows if o.status == "dead")
    failed_report_runs = sum(
        1
        for r in db.scalars(select(DailyReportRun))
        if r.status in {"failed", "dead"} and r.report_date != report_date
    )

    summary = {
        "page_views": page_views,
        "unique_sessions": unique_sessions,
        "returning_sessions": returning_sessions,
        "identified_leads": len(identified_lead_ids),
        "conversion_actions": conversion_actions,
        "blueprint_attempts": blueprint_attempts,
        "blueprint_successes": blueprint_successes,
        "blueprint_failures": blueprint_failures,
        "blueprint_opened": blueprint_opened,
        "blueprint_started": blueprint_started,
        "blueprint_abandoned": blueprint_abandoned,
        "agent_opened": agent_opened,
        "agent_conversations_started": agent_started,
        "agent_conversations_completed": agent_completed,
        "recommendations_shown": recommendations_shown,
        "website_leads": website_leads,
        "contact_enquiries": contact_enquiries,
        "demo_consultation_requests": demo_consultations,
        "proposal_requests": proposals,
        "workshop_requests": workshops,
        "handoff_requests": handoffs,
        "newsletter_subscriptions": len(events_named({"newsletter_subscribed"})),
    }

    has_activity = page_views > 0 or unique_sessions > 0 or conversion_actions > 0 or bool(events)

    return {
        "report_date": report_date.isoformat(),
        "timezone": tz_name,
        "window_start_utc": start.isoformat(),
        "window_end_utc": end.isoformat(),
        "summary": summary,
        "funnel": funnel,
        "top": {
            "pages": top_pages,
            "landing_pages": top_landing,
            "ctas": top_ctas,
            "sources": top_sources,
            "utm_campaigns": top_campaigns,
            "industries": top_industries,
            "objectives": top_objectives,
            "devices": devices,
        },
        "leads": leads_out,
        "health": {
            "failed_form_submissions": failed_forms,
            "failed_blueprint_generations": blueprint_failures,
            "excel_sync_failed": excel_failed,
            "excel_sync_dead": excel_dead,
            "failed_report_runs": failed_report_runs,
        },
        "has_activity": has_activity,
    }
