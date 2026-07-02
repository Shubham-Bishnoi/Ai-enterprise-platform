import { apiRequest } from '@/lib/api/client';

export interface DashboardMetric {
  id: string;
  metric_key: string;
  label: string;
  value: string;
  unit?: string | null;
  trend?: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardActivityItem {
  label: string;
  time: string;
  activity_type: string;
  payload?: Record<string, unknown>;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetric[]> {
  return apiRequest<DashboardMetric[]>('/api/v1/dashboard/metrics');
}

export async function fetchDashboardActivity(): Promise<{ activity: DashboardActivityItem[] }> {
  return apiRequest<{ activity: DashboardActivityItem[] }>('/api/v1/dashboard/activity');
}

