import { apiRequest } from '@/lib/api/client';

export interface PortalWorkspaceHeader {
  workspace_name: string;
  organization_name: string;
  client_type: string;
  status: string;
  stage: string;
  current_program?: string | null;
  last_updated: string;
  demo_secure_workspace: boolean;
}

export interface PortalPersonalization {
  client_type: string;
  dashboard_subtitle: string;
  recommended_modules: string[];
  governance_focus: string[];
  suggested_next_actions: Array<Record<string, unknown>>;
}

export interface ExecutiveSnapshotCard {
  label: string;
  value: string;
  detail?: string | null;
  accent?: string | null;
}

export interface TransformationTimelineStage {
  key: string;
  label: string;
  status: string;
}

export interface TransformationTimeline {
  stages: TransformationTimelineStage[];
  current_stage: string;
}

export interface AIOperationsSummary {
  agents_running: number;
  agent_sessions: number;
  automation_runs: number;
  failed_runs: number;
  human_review_queue: number;
  governance_checks: number;
  model_health: string;
}

export interface GovernanceSummary {
  readiness_score: number;
  controls_implemented: number;
  controls_pending: number;
  risk_level: string;
  audit_trail_status: string;
  human_in_loop_coverage: string;
}

export interface PortalProject {
  id: string;
  name: string;
  phase: string;
  status: string;
  owner?: string | null;
  progress: number;
  risk_level: string;
  next_milestone?: string | null;
  related_blueprint_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortalDocument {
  id: string;
  title: string;
  document_type: string;
  status: string;
  source?: string | null;
  source_id?: string | null;
  download_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortalActivityItem {
  label: string;
  activity_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface PortalDashboard {
  header: PortalWorkspaceHeader;
  personalization: PortalPersonalization;
  executive_snapshot: ExecutiveSnapshotCard[];
  transformation: TransformationTimeline;
  ai_operations: AIOperationsSummary;
  governance: GovernanceSummary;
  projects: PortalProject[];
  documents: PortalDocument[];
  activity: PortalActivityItem[];
}

export async function fetchPortalDashboard(clientType?: string): Promise<PortalDashboard> {
  const suffix = clientType ? `?client_type=${encodeURIComponent(clientType)}` : '';
  return apiRequest<PortalDashboard>(`/api/v1/portal/dashboard${suffix}`);
}

export async function fetchPortalProjects(): Promise<PortalProject[]> {
  return apiRequest<PortalProject[]>('/api/v1/portal/projects');
}

export async function fetchPortalDocuments(): Promise<PortalDocument[]> {
  return apiRequest<PortalDocument[]>('/api/v1/portal/documents');
}

export async function fetchPortalActivity(): Promise<PortalActivityItem[]> {
  return apiRequest<PortalActivityItem[]>('/api/v1/portal/activity');
}

export async function fetchPortalSupportTickets(): Promise<any[]> {
  return apiRequest<any[]>('/api/v1/portal/support');
}

export async function createPortalSupportTicket(payload: {
  request_type: string;
  title: string;
  message: string;
}): Promise<{ ticket_id: string; status: string; message: string }> {
  return apiRequest<{ ticket_id: string; status: string; message: string }>('/api/v1/portal/support', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

