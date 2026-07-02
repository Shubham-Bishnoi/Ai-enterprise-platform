import { apiRequest } from '@/lib/api/client';

export interface Platform {
  id: string;
  slug: string;
  name: string;
  description: string;
  ui_color?: string | null;
  ui_icon?: string | null;
  tags: string[];
  status: string;
  sort_order: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function fetchPlatforms(): Promise<Platform[]> {
  return apiRequest<Platform[]>('/api/v1/platforms');
}

export async function fetchPlatform(slug: string): Promise<Platform> {
  return apiRequest<Platform>(`/api/v1/platforms/${slug}`);
}

