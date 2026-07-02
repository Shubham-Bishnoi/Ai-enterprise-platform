import { apiRequest } from '@/lib/api/client';

export interface ContactSubmissionInput {
  name: string;
  company?: string;
  email: string;
  intent?: string;
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface ContactSubmissionResult {
  contactRequestId: string;
  leadId: string | null;
  status: string;
  message: string;
}

const CONTACT_INTENT_MAP: Record<string, string> = {
  'Book Workshop': 'book_workshop',
  'Book Consultation': 'book_consultation',
  Sales: 'sales',
  Support: 'support',
  Partnership: 'partnership',
  Media: 'media',
  University: 'university',
  Investors: 'investors',
};

export function normalizeContactIntent(value?: string): string {
  if (!value) return 'general';
  return CONTACT_INTENT_MAP[value] ?? (value.trim().toLowerCase().replace(/\s+/g, '_') || 'general');
}

export async function submitContact(input: ContactSubmissionInput): Promise<ContactSubmissionResult> {
  const data = await apiRequest<{
    contact_request_id: string;
    lead_id: string | null;
    status: string;
    message: string;
  }>('/api/v1/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      company: input.company || null,
      email: input.email,
      intent: normalizeContactIntent(input.intent),
      message: input.message,
      source: input.source,
      metadata: input.metadata ?? {},
    }),
  });

  return {
    contactRequestId: data.contact_request_id,
    leadId: data.lead_id,
    status: data.status,
    message: data.message,
  };
}
