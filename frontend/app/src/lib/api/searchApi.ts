import { apiRequest } from '@/lib/api/client';

export interface SearchResult {
  title: string;
  category: string;
  description: string;
  link: string;
  tags: string[];
  source_type: string;
  relevance_score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
}

export interface SearchIndexEntry {
  id: string;
  title: string;
  category: string;
  description: string;
  link: string;
  tags: string[];
  source_type: string;
  featured: boolean;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SearchIndexData {
  chips: string[];
  featured: SearchIndexEntry[];
}

export async function search(q: string): Promise<SearchResponse> {
  return apiRequest<SearchResponse>(`/api/v1/search?q=${encodeURIComponent(q)}`);
}

export async function searchSuggestions(q: string): Promise<{ suggestions: string[]; query: string }> {
  return apiRequest<{ suggestions: string[]; query: string }>(`/api/v1/search/suggestions?q=${encodeURIComponent(q)}`);
}

export async function fetchSearchIndex(): Promise<SearchIndexData> {
  return apiRequest<SearchIndexData>('/api/v1/search/index');
}

