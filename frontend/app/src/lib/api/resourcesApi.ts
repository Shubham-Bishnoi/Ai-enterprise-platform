import { apiRequest } from '@/lib/api/client';

export interface Resource {
  id: string;
  slug: string;
  title: string;
  resource_type: string;
  description: string;
  link?: string | null;
  published_at?: string | null;
  read_time?: string | null;
  featured: boolean;
  tags: string[];
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function fetchResources(): Promise<Resource[]> {
  return apiRequest<Resource[]>('/api/v1/resources');
}

export async function fetchFeaturedResources(): Promise<Resource[]> {
  return apiRequest<Resource[]>('/api/v1/resources/featured');
}

export async function fetchResourceTypes(): Promise<string[]> {
  return apiRequest<string[]>('/api/v1/resources/types');
}

