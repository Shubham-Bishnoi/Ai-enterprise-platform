/**
 * Best-effort analytics. Every call is fire-and-forget and swallows its own
 * errors — analytics must never break or block a user interaction.
 */

import { apiRequest, endpoints, isApiConfigured } from './client'

export type AnalyticsEvent = {
  eventName: string
  source: string
  component?: string
  sessionId?: string | null
  payload?: Record<string, unknown>
}

export function trackEvent(event: AnalyticsEvent): void {
  if (!isApiConfigured() || typeof window === 'undefined') return

  void apiRequest(endpoints.analyticsEvents, {
    method: 'POST',
    timeoutMs: 8_000,
    body: JSON.stringify({
      event_name: event.eventName,
      source: event.source,
      page_path: window.location.pathname,
      component: event.component ?? null,
      session_id: event.sessionId ?? null,
      lead_id: null,
      payload: event.payload ?? {},
    }),
  }).catch(() => {
    // Intentionally ignored.
  })
}
