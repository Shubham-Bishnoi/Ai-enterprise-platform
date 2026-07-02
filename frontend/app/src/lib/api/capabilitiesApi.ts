import { apiRequest } from '@/lib/api/client';

export interface Capability {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description: string;
  ui_color?: string | null;
  ui_icon?: string | null;
  items: string[];
  deliverables: string[];
  tags: string[];
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function fetchCapabilities(): Promise<Capability[]> {
  return apiRequest<Capability[]>('/api/v1/capabilities');
}

export async function fetchCapability(slug: string): Promise<Capability> {
  return apiRequest<Capability>(`/api/v1/capabilities/${slug}`);
}

