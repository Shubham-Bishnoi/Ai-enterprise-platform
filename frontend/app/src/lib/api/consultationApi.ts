import { apiRequest } from '@/lib/api/client';

export interface ConsultationBookingInput {
  name?: string;
  email: string;
  company?: string;
  consultationType:
    | 'discovery_call'
    | 'automation_audit'
    | 'ai_blueprint_review'
    | 'executive_workshop'
    | 'technical_architecture_session'
    | 'governance_review'
    | 'partnership_call';
  preferredDate?: string;
  preferredTime?: string;
  timezone?: string;
  notes?: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface ConsultationBookingResult {
  bookingId: string;
  leadId: string | null;
  status: string;
  message: string;
}

export async function bookConsultation(input: ConsultationBookingInput): Promise<ConsultationBookingResult> {
  const data = await apiRequest<{
    booking_id: string;
    lead_id: string | null;
    status: string;
    message: string;
  }>('/api/v1/consultation/book', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name || null,
      email: input.email,
      company: input.company || null,
      consultation_type: input.consultationType,
      preferred_date: input.preferredDate || null,
      preferred_time: input.preferredTime || null,
      timezone: input.timezone || null,
      notes: input.notes || null,
      source: input.source,
      metadata: input.metadata ?? {},
    }),
  });

  return {
    bookingId: data.booking_id,
    leadId: data.lead_id,
    status: data.status,
    message: data.message,
  };
}
