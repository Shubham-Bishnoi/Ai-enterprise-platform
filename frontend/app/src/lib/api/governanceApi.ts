import { apiRequest } from '@/lib/api/client';

export interface GovernanceFramework {
  key: string;
  label: string;
  description: string;
}

export interface GovernanceControl {
  id: string;
  control_key: string;
  title: string;
  category: string;
  description?: string | null;
  implemented: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GovernanceAssessment {
  id: string;
  framework: string;
  score: number;
  risk_level: string;
  notes?: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export async function fetchFrameworks(): Promise<GovernanceFramework[]> {
  return apiRequest<GovernanceFramework[]>('/api/v1/governance/frameworks');
}

export async function fetchControls(): Promise<GovernanceControl[]> {
  return apiRequest<GovernanceControl[]>('/api/v1/governance/controls');
}

export async function fetchAssessments(): Promise<GovernanceAssessment[]> {
  return apiRequest<GovernanceAssessment[]>('/api/v1/governance/assessments');
}

export async function createAssessment(payload?: { framework?: string; notes?: string; payload?: Record<string, unknown> }): Promise<GovernanceAssessment> {
  return apiRequest<GovernanceAssessment>('/api/v1/governance/assessment', {
    method: 'POST',
    body: JSON.stringify({
      framework: payload?.framework || 'gff_ai',
      notes: payload?.notes || null,
      payload: payload?.payload || {},
    }),
  });
}

