import { apiRequest } from '@/lib/api/client';

export interface HandoffRequestInput {
  handoffType:
    | 'human_expert'
    | 'proposal'
    | 'workshop'
    | 'blueprint_review'
    | 'architecture_review'
    | 'governance_review'
    | 'pilot_program';
  email?: string;
  name?: string;
  company?: string;
  chatSessionId?: string;
  blueprintResultId?: string;
  source: string;
  recommendedSpecialist?: string;
  summary: string;
  context?: Record<string, unknown>;
}

export interface HandoffRequestResult {
  handoffId: string;
  leadId: string | null;
  status: string;
  nextStepMessage: string;
}

export async function createHandoffRequest(input: HandoffRequestInput): Promise<HandoffRequestResult> {
  const data = await apiRequest<{
    handoff_id: string;
    lead_id: string | null;
    status: string;
    next_step_message: string;
  }>('/api/v1/handoff', {
    method: 'POST',
    body: JSON.stringify({
      handoff_type: input.handoffType,
      email: input.email || null,
      name: input.name || null,
      company: input.company || null,
      chat_session_id: input.chatSessionId || null,
      blueprint_result_id: input.blueprintResultId || null,
      source: input.source,
      recommended_specialist: input.recommendedSpecialist || null,
      summary: input.summary,
      context: input.context ?? {},
    }),
  });

  return {
    handoffId: data.handoff_id,
    leadId: data.lead_id,
    status: data.status,
    nextStepMessage: data.next_step_message,
  };
}
