"""Daily report email rendering: responsive HTML + plain-text fallback.

Inline styles only (email clients strip stylesheets). Brand colors follow the
site: brand blue #155DFC on a light ground, navy #07162F for text.
"""

from __future__ import annotations

import html
from datetime import date

NAVY = "#07162F"
BLUE = "#155DFC"
MUTED = "#5B6B84"
BORDER = "#E3E9F4"
BG = "#F4F7FD"

ZERO_ACTIVITY_SENTENCE = "No website activity or lead submissions were recorded today."


def report_subject(report_date: date, lead_count: int) -> str:
    formatted = report_date.strftime("%d %b %Y")
    if lead_count > 0:
        plural = "Lead" if lead_count == 1 else "Leads"
        return f"GFF AI Daily Report — {lead_count} New {plural} — {formatted}"
    return f"GFF AI Daily Website Report — {formatted}"


def _esc(value) -> str:
    return html.escape(str(value if value is not None else ""))


def _card(label: str, value) -> str:
    return (
        f'<td style="padding:6px;" width="25%"><div style="background:#ffffff;border:1px solid {BORDER};'
        f'border-radius:12px;padding:14px 12px;text-align:center;">'
        f'<div style="font-size:22px;font-weight:700;color:{NAVY};line-height:1.2;">{_esc(value)}</div>'
        f'<div style="font-size:11px;color:{MUTED};margin-top:4px;text-transform:uppercase;'
        f'letter-spacing:0.04em;">{_esc(label)}</div></div></td>'
    )


def _section_title(title: str) -> str:
    return (
        f'<h2 style="font-size:15px;color:{NAVY};margin:28px 0 10px;font-weight:700;">{_esc(title)}</h2>'
    )


def _table(headers: list[str], rows: list[list[str]]) -> str:
    if not rows:
        return f'<p style="font-size:13px;color:{MUTED};margin:4px 0;">None recorded.</p>'
    head = "".join(
        f'<th align="left" style="padding:8px 10px;font-size:11px;color:{MUTED};'
        f'text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid {BORDER};">{_esc(h)}</th>'
        for h in headers
    )
    body = ""
    for row in rows:
        cells = "".join(
            f'<td style="padding:8px 10px;font-size:13px;color:{NAVY};'
            f'border-bottom:1px solid {BORDER};vertical-align:top;">{_esc(c)}</td>'
            for c in row
        )
        body += f"<tr>{cells}</tr>"
    return (
        '<div style="overflow-x:auto;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="border-collapse:collapse;background:#ffffff;border:1px solid {BORDER};border-radius:12px;">'
        f"<tr>{head}</tr>{body}</table></div>"
    )


def _top_rows(items: list[dict]) -> list[list[str]]:
    return [[item["label"], str(item["count"])] for item in items]


def render_report_html(metrics: dict, *, dashboard_url: str | None = None) -> str:
    summary = metrics["summary"]
    report_date = date.fromisoformat(metrics["report_date"])
    formatted_date = report_date.strftime("%d %B %Y")

    zero_banner = ""
    if not metrics["has_activity"]:
        zero_banner = (
            f'<div style="background:#FFF7E6;border:1px solid #F5D48F;border-radius:12px;'
            f'padding:14px 16px;margin:16px 0;font-size:14px;color:{NAVY};">{ZERO_ACTIVITY_SENTENCE}</div>'
        )

    cards_primary = "".join(
        [
            _card("Page views", summary["page_views"]),
            _card("Unique sessions", summary["unique_sessions"]),
            _card("Identified leads", summary["identified_leads"]),
            _card("Conversion actions", summary["conversion_actions"]),
        ]
    )
    cards_secondary = "".join(
        [
            _card("Blueprint attempts", summary["blueprint_attempts"]),
            _card("Blueprints generated", summary["blueprint_successes"]),
            _card("Agent chats started", summary["agent_conversations_started"]),
            _card("Returning sessions", summary["returning_sessions"]),
        ]
    )
    cards_enquiries = "".join(
        [
            _card("Contact enquiries", summary["contact_enquiries"]),
            _card("Demo / consultation", summary["demo_consultation_requests"]),
            _card("Proposals", summary["proposal_requests"]),
            _card("Workshops", summary["workshop_requests"]),
        ]
    )

    funnel_rows = [
        [stage["stage"], str(stage["count"]), f'{stage["pct_of_sessions"]}%'] for stage in metrics["funnel"]
    ]

    lead_rows = [
        [
            lead["time_local"],
            lead["name"],
            lead["email"],
            lead["phone"],
            lead["company"],
            lead["type"],
            lead["source_page"],
            lead["utm_source"] or "-",
            lead["summary"],
            lead["follow_up_status"],
        ]
        for lead in metrics["leads"]
    ]

    health = metrics["health"]
    health_rows = [
        ["Failed form submissions", str(health["failed_form_submissions"])],
        ["Failed blueprint generations", str(health["failed_blueprint_generations"])],
        ["Excel sync events retrying", str(health["excel_sync_failed"])],
        ["Excel sync events dead (manual retry needed)", str(health["excel_sync_dead"])],
        ["Earlier report runs failed", str(health["failed_report_runs"])],
    ]

    top = metrics["top"]
    dashboard_link = ""
    if dashboard_url:
        dashboard_link = (
            f'<p style="margin:24px 0 0;"><a href="{_esc(dashboard_url)}" '
            f'style="color:{BLUE};font-size:13px;">Open the admin dashboard →</a></p>'
        )

    return f"""<div style="margin:0;padding:0;background:{BG};">
<div style="max-width:720px;margin:0 auto;padding:28px 16px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="background:{NAVY};border-radius:16px 16px 0 0;padding:24px 28px;">
    <div style="font-size:18px;font-weight:700;color:#ffffff;">GFF AI</div>
    <div style="font-size:13px;color:#B9C6DD;margin-top:4px;">Daily Website Activity Report</div>
    <div style="font-size:13px;color:#B9C6DD;margin-top:2px;">{_esc(formatted_date)} · {_esc(metrics["timezone"])}</div>
  </div>
  <div style="background:{BG};border:1px solid {BORDER};border-top:0;border-radius:0 0 16px 16px;padding:20px 22px 28px;">
    {zero_banner}
    {_section_title("Executive summary")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>{cards_primary}</tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>{cards_secondary}</tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>{cards_enquiries}</tr></table>

    {_section_title("Conversion funnel")}
    {_table(["Stage", "Count", "% of sessions"], funnel_rows)}

    {_section_title(f'New leads ({len(metrics["leads"])})')}
    {_table(
        ["Time (IST)", "Name", "Email", "Phone", "Company", "Type", "Source page", "UTM", "Summary", "Status"],
        lead_rows,
    )}

    {_section_title("Top pages")}
    {_table(["Page", "Views"], _top_rows(top["pages"]))}

    {_section_title("Traffic sources")}
    {_table(["Source", "Sessions"], _top_rows(top["sources"]))}

    {_section_title("Top landing pages")}
    {_table(["Landing page", "Sessions"], _top_rows(top["landing_pages"]))}

    {_section_title("Top CTAs")}
    {_table(["CTA", "Clicks"], _top_rows(top["ctas"]))}

    {_section_title("UTM campaigns")}
    {_table(["Campaign", "Sessions"], _top_rows(top["utm_campaigns"]))}

    {_section_title("Industries & objectives")}
    {_table(["Industry", "Count"], _top_rows(top["industries"]))}
    {_table(["Business objective", "Count"], _top_rows(top["objectives"]))}

    {_section_title("Device distribution")}
    {_table(["Device", "Sessions"], _top_rows(top["devices"]))}

    {_section_title("Operational health")}
    {_table(["Check", "Count"], health_rows)}
    {dashboard_link}

    <p style="font-size:11px;color:{MUTED};margin:28px 0 0;line-height:1.5;">
      Automated report generated by the GFF AI backend. Anonymous visitors are counted by
      first-party session identifiers only — no IP addresses are stored, and lead details appear
      only when a visitor voluntarily submitted them.
    </p>
  </div>
</div>
</div>"""


def render_report_text(metrics: dict) -> str:
    summary = metrics["summary"]
    report_date = date.fromisoformat(metrics["report_date"])
    lines = [
        "GFF AI Daily Website Activity Report",
        f"Date: {report_date.strftime('%d %B %Y')} ({metrics['timezone']})",
        "",
    ]
    if not metrics["has_activity"]:
        lines += [ZERO_ACTIVITY_SENTENCE, ""]

    lines += [
        "EXECUTIVE SUMMARY",
        f"  Page views: {summary['page_views']}",
        f"  Unique anonymous sessions: {summary['unique_sessions']}",
        f"  Returning sessions: {summary['returning_sessions']}",
        f"  Identified leads: {summary['identified_leads']}",
        f"  Conversion actions: {summary['conversion_actions']}",
        f"  Blueprint attempts / generated / failed: "
        f"{summary['blueprint_attempts']} / {summary['blueprint_successes']} / {summary['blueprint_failures']}",
        f"  Contact enquiries: {summary['contact_enquiries']}",
        f"  Demo/consultation requests: {summary['demo_consultation_requests']}",
        f"  Proposal requests: {summary['proposal_requests']}",
        f"  Workshop requests: {summary['workshop_requests']}",
        f"  Human handoff requests: {summary['handoff_requests']}",
        "",
        "CONVERSION FUNNEL",
    ]
    for stage in metrics["funnel"]:
        lines.append(f"  {stage['stage']}: {stage['count']} ({stage['pct_of_sessions']}% of sessions)")

    lines += ["", f"NEW LEADS ({len(metrics['leads'])})"]
    if not metrics["leads"]:
        lines.append("  None recorded.")
    for lead in metrics["leads"]:
        lines.append(
            f"  {lead['time_local']} IST | {lead['name']} <{lead['email']}> | {lead['company']} | "
            f"{lead['type']} | {lead['source_page']} | {lead['summary']}"
        )

    def top_block(title: str, items: list[dict]) -> list[str]:
        block = ["", title.upper()]
        if not items:
            block.append("  None recorded.")
        for item in items:
            block.append(f"  {item['label']}: {item['count']}")
        return block

    top = metrics["top"]
    lines += top_block("Top pages", top["pages"])
    lines += top_block("Traffic sources", top["sources"])
    lines += top_block("Device distribution", top["devices"])

    health = metrics["health"]
    lines += [
        "",
        "OPERATIONAL HEALTH",
        f"  Failed form submissions: {health['failed_form_submissions']}",
        f"  Failed blueprint generations: {health['failed_blueprint_generations']}",
        f"  Excel sync retrying/dead: {health['excel_sync_failed']}/{health['excel_sync_dead']}",
        f"  Earlier report runs failed: {health['failed_report_runs']}",
        "",
        "Automated report generated by the GFF AI backend.",
    ]
    return "\n".join(lines)
