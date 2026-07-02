import { apiRequest } from '@/lib/api/client';

export type ClientType = 'enterprise' | 'university' | 'government' | 'manufacturing' | 'banking' | 'startup';

export interface User {
  id: string;
  email: string;
  display_name: string;
  client_type: string;
  organization_name: string;
  status: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export function getPortalToken(): string | null {
  return typeof window !== 'undefined' ? window.localStorage.getItem('gff_portal_token') : null;
}

export function setPortalToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (!token) {
    window.localStorage.removeItem('gff_portal_token');
    return;
  }
  window.localStorage.setItem('gff_portal_token', token);
}

export async function demoLogin(clientType: ClientType): Promise<AuthToken> {
  const data = await apiRequest<AuthToken>('/api/v1/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ client_type: clientType }),
  });
  setPortalToken(data.access_token);
  return data;
}

export async function fetchMe(): Promise<User> {
  return apiRequest<User>('/api/v1/auth/me');
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/v1/auth/logout', { method: 'POST' });
  } finally {
    setPortalToken(null);
  }
}

