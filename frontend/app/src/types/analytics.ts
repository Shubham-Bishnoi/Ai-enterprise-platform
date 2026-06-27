// Analytics Event Types - API-ready for FastAPI integration

export type AnalyticsEventType =
  | 'page_view'
  | 'section_view'
  | 'blueprint_start'
  | 'blueprint_generate'
  | 'blueprint_result_view'
  | 'blueprint_cta_click'
  | 'talk_to_agent_open'
  | 'talk_to_agent_message'
  | 'talk_to_agent_recommendation'
  | 'talk_to_agent_cta_click'
  | 'contact_submit'
  | 'cta_click';

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  eventName: string;
  timestamp: string;
  sessionId: string;
  pageUrl: string;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsEventRequest {
  events: AnalyticsEvent[];
}

export interface AnalyticsEventResponse {
  success: boolean;
  tracked: number;
  error?: string;
}
