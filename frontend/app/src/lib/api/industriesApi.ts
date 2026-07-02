import { apiRequest } from '@/lib/api/client';

export interface Industry {
  slug: string;
  name: string;
  description: string;
  common_challenges: string[];
  business_outcomes: string[];
  recommended_use_cases: string[];
  recommended_agents: string[];
  architecture_hints: string[];
  governance_priorities: string[];
  roadmap_bias?: Record<string, unknown> | null;
  ui: Record<string, unknown>;
  created_at: string;
}

export async function fetchIndustries(): Promise<Industry[]> {
  return apiRequest<Industry[]>('/api/v1/industries');
}

export async function fetchIndustry(slug: string): Promise<Industry> {
  return apiRequest<Industry>(`/api/v1/industries/${slug}`);
}

