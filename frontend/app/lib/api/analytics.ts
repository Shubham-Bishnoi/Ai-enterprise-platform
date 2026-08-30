/**
 * Best-effort analytics. Every call is fire-and-forget and swallows its own
 * errors — analytics must never break or block a user interaction.
 *
 * Each event carries a client-generated `event_id` (server-side idempotency:
 * retries and strict-mode double effects can never store twice), the
 * privacy-safe anonymous/session identifiers, and — when a session has just
 * started — the first-touch attribution context for the session record.
 */

import { API_BASE_URL, endpoints, isApiConfigured } from './client'
import type { AnalyticsEventName } from '@/lib/analytics/events'
import {
  browserCategory,
  deviceCategory,
  getAnonymousId,
  markSessionStarted,
  touchSession,
} from '@/lib/analytics/session'
import { getStoredAttribution } from '@/lib/attribution'

export type AnalyticsEvent = {
  eventName: AnalyticsEventName
  source: string
  component?: string
  /** Chat session id (talk-to-agent), when relevant. */
  sessionId?: string | null
  entityType?: string
  entityId?: string
  payload?: Record<string, unknown>
}

function uuid(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  }
}

function sessionContext(): Record<string, unknown> {
  const attribution = getStoredAttribution()
  return {
    landing_page: attribution.landing_page ?? window.location.pathname,
    referrer: attribution.referrer ?? null,
    utm_source: attribution.utm_source ?? null,
    utm_medium: attribution.utm_medium ?? null,
    utm_campaign: attribution.utm_campaign ?? null,
    device_category: deviceCategory(),
    browser_category: browserCategory(),
    consent_status: 'essential_analytics',
  }
}

function post(body: Record<string, unknown>): void {
  try {
    // keepalive lets events sent right before navigation still complete;
    // no response handling — analytics is invisible to the user experience.
    void fetch(`${API_BASE_URL}${endpoints.analyticsEvents}`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {})
  } catch {
    /* intentionally ignored */
  }
}

function buildBody(event: AnalyticsEvent, visitorSessionId: string, extra?: Record<string, unknown>) {
  return {
    event_id: uuid(),
    event_name: event.eventName,
    source: event.source,
    page_path: window.location.pathname,
    component: event.component ?? null,
    session_id: event.sessionId ?? null,
    anonymous_id: getAnonymousId(),
    visitor_session_id: visitorSessionId,
    entity_type: event.entityType ?? null,
    entity_id: event.entityId ?? null,
    lead_id: null,
    occurred_at: new Date().toISOString(),
    payload: event.payload ?? {},
    ...extra,
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  if (!isApiConfigured() || typeof window === 'undefined') return

  try {
    const { sessionId: visitorSessionId, isNew } = touchSession()

    // A fresh session announces itself first, carrying the attribution
    // context that seeds the anonymous analytics_sessions row.
    if (isNew && markSessionStarted(visitorSessionId)) {
      post(
        buildBody(
          { eventName: 'session_started', source: 'website', component: 'AnalyticsInit' },
          visitorSessionId,
          { session_context: sessionContext() },
        ),
      )
    }

    post(buildBody(event, visitorSessionId))
  } catch {
    /* analytics must never throw into user flows */
  }
}

/** Convenience wrapper for CTA instrumentation. */
export function trackCta(cta: string, source: string, component?: string): void {
  trackEvent({ eventName: 'cta_clicked', source, component, payload: { cta } })
}
