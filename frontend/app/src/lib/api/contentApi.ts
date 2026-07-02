import { apiRequest } from '@/lib/api/client';

export interface NavigationItem {
  label: string;
  to: string;
  end?: boolean;
  mobileOnly?: boolean;
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; to: string }>;
}

export interface HomeSection {
  id: string;
  section_key: string;
  title: string;
  subtitle?: string | null;
  content: Record<string, unknown>;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  content: Record<string, unknown>;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function fetchNavigation(): Promise<NavigationItem[]> {
  const data = await apiRequest<{ items: NavigationItem[] }>('/api/v1/content/navigation');
  return data.items || [];
}

export async function fetchFooter(): Promise<FooterColumn[]> {
  const data = await apiRequest<{ columns: FooterColumn[] }>('/api/v1/content/footer');
  return data.columns || [];
}

export async function fetchHomeSections(): Promise<HomeSection[]> {
  return apiRequest<HomeSection[]>('/api/v1/content/home/sections');
}

export async function fetchHomeSection(sectionKey: string): Promise<HomeSection> {
  return apiRequest<HomeSection>(`/api/v1/content/home/sections/${sectionKey}`);
}

export async function fetchContentPage(slug: string): Promise<ContentPage> {
  return apiRequest<ContentPage>(`/api/v1/content/pages/${slug}`);
}

