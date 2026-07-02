import { apiRequest } from '@/lib/api/client';

export interface TrackAnalyticsEventInput {
  eventName: string;
  source: string;
  pagePath?: string;
  component?: string;
  sessionId?: string | null;
  leadId?: string | null;
  payload?: Record<string, unknown>;
}

export async function trackAnalyticsEvent(input: TrackAnalyticsEventInput): Promise<void> {
  try {
    await apiRequest('/api/v1/analytics/events', {
      method: 'POST',
      body: JSON.stringify({
        event_name: input.eventName,
        source: input.source,
        page_path: input.pagePath ?? window.location.pathname + window.location.hash,
        component: input.component ?? null,
        session_id: input.sessionId ?? null,
        lead_id: input.leadId ?? null,
        payload: input.payload ?? {},
      }),
    });
  } catch {
    // Analytics is best-effort only and must never break UI interactions.
  }
}
