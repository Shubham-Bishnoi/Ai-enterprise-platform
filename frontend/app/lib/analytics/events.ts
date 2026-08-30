/**
 * Centralized analytics event taxonomy — the frontend mirror of
 * `backend/app/core/event_taxonomy.py`. The backend rejects anything not in
 * its allowlist, so add new names in both places together.
 */

export type GeneralEvent =
  | 'session_started'
  | 'page_viewed'
  | 'cta_clicked'
  | 'contact_details_submitted'
  | 'form_submission_failed'

export type AgentEvent =
  | 'talk_to_agent_opened'
  | 'starter_chip_selected'
  | 'agent_conversation_started'
  | 'industry_identified'
  | 'role_identified'
  | 'objective_identified'
  | 'recommendation_shown'
  | 'agent_conversation_completed'
  | 'agent_conversation_abandoned'

export type BlueprintEvent =
  | 'blueprint_opened'
  | 'blueprint_started'
  | 'blueprint_step_completed'
  | 'blueprint_generation_attempted'
  | 'blueprint_generation_succeeded'
  | 'blueprint_generation_failed'
  | 'blueprint_abandoned'
  | 'blueprint_downloaded'
  | 'blueprint_emailed'

export type ConversionEvent =
  | 'contact_form_started'
  | 'contact_form_submitted'
  | 'enquiry_submitted'
  | 'demo_booking_started'
  | 'demo_booking_submitted'
  | 'consultation_requested'
  | 'proposal_requested'
  | 'workshop_booking_started'
  | 'workshop_booking_submitted'
  | 'human_handoff_requested'
  | 'newsletter_subscribed'

export type AnalyticsEventName = GeneralEvent | AgentEvent | BlueprintEvent | ConversionEvent
