/**
 * Lead capture: contact, consultation booking, and handoff.
 * Payload shapes mirrored exactly from the previous frontend's API clients.
 */

import { apiRequest, endpoints } from './client'

/* ------------------------------------------------------------------ contact */

const CONTACT_INTENT_MAP: Record<string, string> = {
  'Book Workshop': 'book_workshop',
  'Book Consultation': 'book_consultation',
  Sales: 'sales',
  Support: 'support',
  Partnership: 'partnership',
  Media: 'media',
  University: 'university',
  Investors: 'investors',
}

export function normalizeContactIntent(value?: string): string {
  if (!value) return 'general'
  return CONTACT_INTENT_MAP[value] ?? (value.trim().toLowerCase().replace(/\s+/g, '_') || 'general')
}

export type ContactInput = {
  name: string
  email: string
  company?: string
  intent?: string
  message: string
  source: string
  metadata?: Record<string, unknown>
}

export async function submitContact(input: ContactInput): Promise<{ status: string; message: string }> {
  const data = await apiRequest<{
    contact_request_id: string
    lead_id: string | null
    status: string
    message: string
  }>(endpoints.contact, {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      company: input.company || null,
      email: input.email,
      intent: normalizeContactIntent(input.intent),
      message: input.message,
      source: input.source,
      metadata: input.metadata ?? {},
    }),
  })

  return { status: data.status, message: data.message }
}

/* ------------------------------------------------------- consultation booking */

export type ConsultationType =
  | 'discovery_call'
  | 'automation_audit'
  | 'ai_blueprint_review'
  | 'executive_workshop'
  | 'technical_architecture_session'
  | 'governance_review'
  | 'partnership_call'

export type ConsultationInput = {
  name?: string
  email: string
  company?: string
  consultationType: ConsultationType
  notes?: string
  source: string
  metadata?: Record<string, unknown>
}

export async function bookConsultation(input: ConsultationInput): Promise<{ status: string; message: string }> {
  const data = await apiRequest<{
    booking_id: string
    lead_id: string | null
    status: string
    message: string
  }>(endpoints.consultationBook, {
    method: 'POST',
    body: JSON.stringify({
      name: input.name || null,
      email: input.email,
      company: input.company || null,
      consultation_type: input.consultationType,
      preferred_date: null,
      preferred_time: null,
      timezone: null,
      notes: input.notes || null,
      source: input.source,
      metadata: input.metadata ?? {},
    }),
  })

  return { status: data.status, message: data.message }
}

/* ------------------------------------------------------------------ handoff */

export type HandoffType =
  | 'human_expert'
  | 'proposal'
  | 'workshop'
  | 'blueprint_review'
  | 'architecture_review'
  | 'governance_review'
  | 'pilot_program'

export type HandoffInput = {
  handoffType: HandoffType
  summary: string
  source: string
  email?: string
  name?: string
  company?: string
  chatSessionId?: string
  blueprintResultId?: string
  metadata?: Record<string, unknown>
}

export async function createHandoff(input: HandoffInput): Promise<{ status: string; nextStepMessage: string }> {
  const data = await apiRequest<{
    handoff_id: string
    lead_id: string | null
    status: string
    next_step_message: string
  }>(endpoints.handoff, {
    method: 'POST',
    body: JSON.stringify({
      handoff_type: input.handoffType,
      email: input.email || null,
      name: input.name || null,
      company: input.company || null,
      chat_session_id: input.chatSessionId || null,
      blueprint_result_id: input.blueprintResultId || null,
      source: input.source,
      recommended_specialist: null,
      summary: input.summary,
      context: input.metadata ?? {},
    }),
  })

  return { status: data.status, nextStepMessage: data.next_step_message }
}
