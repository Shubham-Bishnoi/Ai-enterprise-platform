import { apiRequest } from '@/lib/api/client';
import type { PortalDocument } from '@/lib/api/portalApi';

export async function fetchDocuments(): Promise<PortalDocument[]> {
  return apiRequest<PortalDocument[]>('/api/v1/documents');
}

export async function generateDocument(payload: {
  document_type: string;
  title: string;
  payload?: Record<string, unknown>;
}): Promise<{ document_id: string; status: string }> {
  return apiRequest<{ document_id: string; status: string }>('/api/v1/documents/generate', {
    method: 'POST',
    body: JSON.stringify({ ...payload, payload: payload.payload || {} }),
  });
}

export async function downloadDocument(documentId: string): Promise<{ document_id: string; status: string; download_url?: string | null }> {
  return apiRequest<{ document_id: string; status: string; download_url?: string | null }>(
    `/api/v1/documents/${documentId}/download`,
  );
}

