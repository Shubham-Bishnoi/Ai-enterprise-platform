import { apiRequest } from '@/lib/api/client';

export interface SupportTicket {
  id: string;
  request_type: string;
  title: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  return apiRequest<SupportTicket[]>('/api/v1/support');
}

export async function createSupportTicket(payload: {
  request_type: string;
  title: string;
  message: string;
}): Promise<{ ticket_id: string; status: string; message: string }> {
  return apiRequest<{ ticket_id: string; status: string; message: string }>('/api/v1/support', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

