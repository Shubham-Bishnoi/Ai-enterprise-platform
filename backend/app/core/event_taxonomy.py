"""Centralized analytics event taxonomy.

Every event the website may record is declared here — the ingestion endpoint
rejects anything else, so arbitrary event-name strings can never accumulate in
the database. The frontend mirrors this list in
`frontend/app/lib/analytics/events.ts`; change both together.

LEGACY_EVENTS are names already emitted by earlier frontend builds (and already
present in production rows). They stay accepted so old bundles keep working,
and the daily report counts them alongside their canonical successors.
"""

# General website
GENERAL_EVENTS = {
    "session_started",
    "page_viewed",
    "cta_clicked",
    "contact_details_submitted",
    "form_submission_failed",
}

# Talk to an AI Agent
AGENT_EVENTS = {
    "talk_to_agent_opened",
    "starter_chip_selected",
    "agent_conversation_started",
    "industry_identified",
    "role_identified",
    "objective_identified",
    "recommendation_shown",
    "agent_conversation_completed",
    "agent_conversation_abandoned",
}

# Blueprint Generator
BLUEPRINT_EVENTS = {
    "blueprint_opened",
    "blueprint_started",
    "blueprint_step_completed",
    "blueprint_generation_attempted",
    "blueprint_generation_succeeded",
    "blueprint_generation_failed",
    "blueprint_abandoned",
    "blueprint_downloaded",
    "blueprint_emailed",
}

# Sales and conversion
CONVERSION_EVENTS = {
    "contact_form_started",
    "contact_form_submitted",
    "enquiry_submitted",
    "demo_booking_started",
    "demo_booking_submitted",
    "consultation_requested",
    "proposal_requested",
    "workshop_booking_started",
    "workshop_booking_submitted",
    "human_handoff_requested",
    "newsletter_subscribed",
}

# Emitted by earlier frontend builds; kept for backward compatibility.
LEGACY_EVENTS = {
    "talk_to_agent_message_sent",
    "blueprint_generate_submitted",
    "blueprint_generate_completed",
    "contact_submitted",
    "human_expert_requested",
    "hero_generate_blueprint_clicked",
}

ALLOWED_EVENTS: frozenset[str] = frozenset(
    GENERAL_EVENTS | AGENT_EVENTS | BLUEPRINT_EVENTS | CONVERSION_EVENTS | LEGACY_EVENTS
)


def is_allowed_event(event_name: str) -> bool:
    return event_name in ALLOWED_EVENTS
