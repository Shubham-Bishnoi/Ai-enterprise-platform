import { ApiClientError, apiRequest } from '@/lib/api/client';
import type {
  AgentMessage,
  AgentRecommendation,
  InlineAgentIdentity,
  NextStepAction,
  QuickActionChip,
  RelevantLab,
  RelevantSolution,
  RecommendedPath,
  TalkToAgentSession,
  TalkToAgentState,
} from '@/types/talkToAgent';

export const TALK_TO_AGENT_BACKEND_UNAVAILABLE_MESSAGE =
  'Unable to connect to GFF AI backend right now. Please try again or continue with the current page.';

export const LEGACY_TALK_TO_AGENT_QUICK_ACTIONS: QuickActionChip[] = [
  {
    id: 'banking',
    label: 'Build AI for Banking',
    prompt:
      'I want to build AI solutions for my banking organization. We need help with fraud detection, credit scoring, and customer experience.',
  },
  {
    id: 'university',
    label: 'Create University AI Lab',
    prompt:
      'We want to set up an AI lab at our university for research, student training, and industry collaboration.',
  },
  {
    id: 'manufacturing',
    label: 'Improve Manufacturing Operations',
    prompt:
      'Looking to improve our manufacturing operations with AI-powered predictive maintenance, quality control, and supply chain optimization.',
  },
  {
    id: 'compliance',
    label: 'Reduce Compliance Cost',
    prompt:
      'Need to reduce compliance costs while maintaining regulatory standards. Interested in AI governance and automated compliance.',
  },
  {
    id: 'explore',
    label: 'Explore AI Opportunities',
    prompt:
      'Want to explore AI opportunities for our enterprise. Not sure where to start, need guidance on use cases and ROI.',
  },
  {
    id: 'blueprint',
    label: 'Generate My Enterprise AI Blueprint',
    prompt: 'I want to generate a comprehensive enterprise AI blueprint for our organization.',
  },
];

interface BackendQuickAction {
  id: string;
  label: string;
  prompt: string;
}

export interface BackendTalkToAgentAgent {
  id: string;
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  greeting: string;
  icon: string;
  image_url: string | null;
  status: string;
  quick_actions: BackendQuickAction[];
}

interface BackendMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  structured_payload: Record<string, unknown> | null;
  created_at: string;
}

interface BackendExtractedProfile {
  industry: string | null;
  role: string | null;
  objective: string | null;
  geography: string | null;
  ai_maturity: string | null;
  constraints: string[];
}

interface BackendRecommendationPath {
  id: string;
  title: string;
  description: string;
  agent_id: string;
}

interface BackendRecommendedSolution {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface BackendSuggestedQuestion {
  id: string;
  question: string;
}

interface BackendNextAction {
  type: string;
  label: string;
  payload: Record<string, unknown>;
}

interface BackendSessionStartResponse {
  session_id: string;
  state: string;
  selected_agent: BackendTalkToAgentAgent | null;
  messages: BackendMessage[];
  quick_actions: BackendQuickAction[];
}

interface BackendChatResponse {
  session_id: string;
  state: string;
  assistant_message: string;
  extracted_profile: BackendExtractedProfile;
  confidence_score: number;
  recommended_paths: BackendRecommendationPath[];
  recommended_solutions: BackendRecommendedSolution[];
  suggested_questions: BackendSuggestedQuestion[];
  next_actions: BackendNextAction[];
}

interface BackendHandoffResponse {
  session_id: string;
  state: string;
  handoff_summary: string;
  payload: Record<string, unknown>;
}

const LABS_BY_AGENT: Record<string, RelevantLab[]> = {
  strategy: [
    { id: 'lab-agentic', name: 'Agentic AI Lab', description: 'Multi-agent strategy design and operating model experiments.' },
    { id: 'lab-transformation', name: 'Transformation Lab', description: 'Roadmap design, business case framing, and pilot planning.' },
  ],
  architect: [
    { id: 'lab-platform', name: 'Platform Architecture Lab', description: 'Enterprise data, orchestration, and integration patterns.' },
    { id: 'lab-generative', name: 'Generative AI Lab', description: 'LLM systems, RAG pipelines, and secure deployment patterns.' },
  ],
  governance: [
    { id: 'lab-governance', name: 'AI Governance Lab', description: 'Controls, audit workflows, and responsible AI policies.' },
    { id: 'lab-risk', name: 'Risk & Compliance Lab', description: 'Risk controls, compliance automation, and assurance flows.' },
  ],
  industry: [
    { id: 'lab-sector', name: 'Sector Innovation Lab', description: 'Industry-specific use cases, benchmarks, and ROI framing.' },
    { id: 'lab-reference', name: 'Reference Solutions Lab', description: 'Reference architectures and deployable patterns by sector.' },
  ],
  training: [
    { id: 'lab-academy', name: 'AI Academy Lab', description: 'Role-based learning paths and enablement programs.' },
    { id: 'lab-workforce', name: 'Workforce Readiness Lab', description: 'Capability assessment and adoption planning for teams.' },
  ],
};

const NEXT_ACTION_COPY: Record<string, { cta: string; href?: string }> = {
  generate_blueprint: { cta: 'Get Started', href: '#blueprint' },
  book_workshop: { cta: 'Book Now', href: '#contact' },
  request_handoff: { cta: 'Connect', href: '#contact' },
  clarify_route: { cta: 'Refine', href: '#talk-to-agent' },
};

function titleCase(value: string | null | undefined): string {
  if (!value) return 'Enterprise';
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mapRole(role: BackendMessage['role']): AgentMessage['role'] {
  return role === 'user' ? 'user' : 'agent';
}

function mapState(state: string): TalkToAgentState {
  if (state === 'recommendation_ready' || state === 'handoff_ready') {
    return 'recommendations';
  }
  if (state === 'clarifying') {
    return 'clarifying';
  }
  if (state === 'error') {
    return 'error';
  }
  return 'welcome';
}

function mapMessage(message: BackendMessage): AgentMessage {
  return {
    id: message.id,
    role: mapRole(message.role),
    text: message.content,
    timestamp: message.created_at,
  };
}

function buildRoleObjective(profile: BackendExtractedProfile): string {
  const parts = [
    profile.role ? `${profile.role}` : null,
    profile.objective ? `focused on ${profile.objective}` : null,
    profile.ai_maturity ? `AI maturity: ${profile.ai_maturity}` : null,
    profile.constraints.length ? `Constraints: ${profile.constraints.join(', ')}` : null,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(' | ')
    : 'AI transformation discovery across goals, constraints, and next-step priorities.';
}

function mapRecommendedPaths(paths: BackendRecommendationPath[]): RecommendedPath[] {
  return paths.map((path) => ({
    id: path.id,
    title: path.title,
    description: path.description,
    icon: path.agent_id,
  }));
}

function mapRelevantSolutions(solutions: BackendRecommendedSolution[]): RelevantSolution[] {
  return solutions.map((solution) => ({
    id: solution.id,
    name: solution.name,
    description: solution.description,
    category: solution.category,
  }));
}

function mapNextActions(actions: BackendNextAction[]): NextStepAction[] {
  return actions.map((action) => ({
    title: action.label,
    cta: NEXT_ACTION_COPY[action.type]?.cta || 'Open',
    href: NEXT_ACTION_COPY[action.type]?.href,
    type: action.type,
    payload: action.payload,
  }));
}

function buildRelevantLabs(route: string, profile: BackendExtractedProfile): RelevantLab[] {
  const labs = LABS_BY_AGENT[route] || LABS_BY_AGENT.strategy;
  if (profile.industry && route === 'industry') {
    return [
      {
        id: `lab-${profile.industry}`,
        name: `${titleCase(profile.industry)} AI Lab`,
        description: `Sector-focused discovery and reference solutions for ${titleCase(profile.industry)} teams.`,
      },
      ...labs.slice(0, 1),
    ];
  }
  return labs;
}

export function buildIntroMessage(selectedAgent?: InlineAgentIdentity): AgentMessage {
  const text = selectedAgent
    ? selectedAgent.greeting ||
      `Hello! I'm your ${selectedAgent.name}. ${selectedAgent.subtitle || selectedAgent.desc}. Tell me about your challenge and I will guide your next steps.`
    : "Hello! I'm GFF AI, your enterprise transformation advisor. How can I help you today? Select a quick action below or type your question.";

  return {
    id: `intro_${Date.now()}`,
    role: 'agent',
    text,
    timestamp: new Date().toISOString(),
  };
}

export function buildOfflineMessage(): AgentMessage {
  return {
    id: `offline_${Date.now()}`,
    role: 'agent',
    text: TALK_TO_AGENT_BACKEND_UNAVAILABLE_MESSAGE,
    timestamp: new Date().toISOString(),
  };
}

export function createLocalSession(
  selectedAgent?: InlineAgentIdentity,
  quickActions: QuickActionChip[] = [],
): TalkToAgentSession {
  const now = new Date().toISOString();
  return {
    id: `local_${Date.now()}`,
    state: 'welcome',
    selectedAgentId: selectedAgent?.id ?? null,
    messages: [buildIntroMessage(selectedAgent)],
    quickActions,
    createdAt: now,
    updatedAt: now,
  };
}

export function appendLocalMessage(
  session: TalkToAgentSession,
  role: AgentMessage['role'],
  text: string,
): TalkToAgentSession {
  const message: AgentMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    timestamp: new Date().toISOString(),
  };

  return {
    ...session,
    messages: [...session.messages, message],
    updatedAt: new Date().toISOString(),
  };
}

export function adaptAgentQuickActions(actions: BackendQuickAction[]): QuickActionChip[] {
  return actions.map((action) => ({
    id: action.id,
    label: action.label,
    prompt: action.prompt,
  }));
}

export function adaptSessionStart(
  data: BackendSessionStartResponse,
  selectedAgent?: InlineAgentIdentity,
): TalkToAgentSession {
  const introMessage = buildIntroMessage(selectedAgent);
  const mappedMessages = data.messages.map(mapMessage);

  return {
    id: data.session_id,
    state: mapState(data.state),
    selectedAgentId: data.selected_agent?.id || selectedAgent?.id || null,
    messages: mappedMessages.length > 0 ? mappedMessages : [introMessage],
    quickActions: adaptAgentQuickActions(data.quick_actions),
    createdAt: introMessage.timestamp,
    updatedAt: mappedMessages.at(-1)?.timestamp || introMessage.timestamp,
  };
}

export function adaptChatRecommendation(
  data: BackendChatResponse,
  selectedAgentId?: string | null,
): AgentRecommendation {
  const labs = buildRelevantLabs(data.recommended_paths[0]?.agent_id || selectedAgentId || 'strategy', data.extracted_profile);

  return {
    detectedIndustry: {
      name: titleCase(data.extracted_profile.industry),
      confidence: data.confidence_score,
    },
    roleObjective: buildRoleObjective(data.extracted_profile),
    recommendedPaths: mapRecommendedPaths(data.recommended_paths),
    relevantSolutions: mapRelevantSolutions(data.recommended_solutions),
    relevantLabs: labs,
    nextStepActions: mapNextActions(data.next_actions),
    suggestedQuestions: data.suggested_questions.map((item) => item.question),
  };
}

export async function fetchTalkToAgentAgents(): Promise<BackendTalkToAgentAgent[]> {
  return apiRequest<BackendTalkToAgentAgent[]>('/api/v1/agents');
}

export async function createTalkToAgentSession(
  selectedAgent?: InlineAgentIdentity,
  sourceSurface = 'homepage_inline_chat',
): Promise<TalkToAgentSession> {
  const data = await apiRequest<BackendSessionStartResponse>('/api/v1/agents/session', {
    method: 'POST',
    body: JSON.stringify({
      selected_agent_id: selectedAgent?.id || null,
      source_surface: sourceSurface,
    }),
  });

  return adaptSessionStart(data, selectedAgent);
}

export async function sendTalkToAgentMessage(args: {
  sessionId: string;
  message: string;
  selectedAgentId?: string | null;
  sourceSurface: string;
}): Promise<{ state: TalkToAgentState; assistantMessage: AgentMessage; recommendation: AgentRecommendation }> {
  const data = await apiRequest<BackendChatResponse>('/api/v1/agents/chat', {
    method: 'POST',
    body: JSON.stringify({
      session_id: args.sessionId,
      message: args.message,
      selected_agent_id: args.selectedAgentId || null,
      source_surface: args.sourceSurface,
    }),
  });

  return {
    state: mapState(data.state) === 'clarifying' ? 'recommendations' : mapState(data.state),
    assistantMessage: {
      id: `assistant_${Date.now()}`,
      role: 'agent',
      text: data.assistant_message,
      timestamp: new Date().toISOString(),
    },
    recommendation: adaptChatRecommendation(data, args.selectedAgentId),
  };
}

export async function triggerTalkToAgentQuickAction(args: {
  sessionId: string;
  quickActionId: string;
  selectedAgentId?: string | null;
}): Promise<{ state: TalkToAgentState; assistantMessage: AgentMessage; recommendation: AgentRecommendation }> {
  const data = await apiRequest<BackendChatResponse>('/api/v1/agents/quick-action', {
    method: 'POST',
    body: JSON.stringify({
      session_id: args.sessionId,
      quick_action_id: args.quickActionId,
      selected_agent_id: args.selectedAgentId || null,
    }),
  });

  return {
    state: mapState(data.state) === 'clarifying' ? 'recommendations' : mapState(data.state),
    assistantMessage: {
      id: `assistant_${Date.now()}`,
      role: 'agent',
      text: data.assistant_message,
      timestamp: new Date().toISOString(),
    },
    recommendation: adaptChatRecommendation(data, args.selectedAgentId),
  };
}

export async function requestTalkToAgentHandoff(args: {
  sessionId: string;
  selectedAgentId?: string | null;
  target?: string;
  notes?: string;
}): Promise<BackendHandoffResponse> {
  return apiRequest<BackendHandoffResponse>('/api/v1/agents/handoff', {
    method: 'POST',
    body: JSON.stringify({
      session_id: args.sessionId,
      selected_agent_id: args.selectedAgentId || null,
      target: args.target || 'human_expert',
      notes: args.notes || null,
    }),
  });
}

export async function trackTalkToAgentEvent(args: {
  eventName: string;
  source: string;
  sessionId?: string | null;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    await apiRequest('/api/v1/analytics/events', {
      method: 'POST',
      body: JSON.stringify({
        session_id: args.sessionId || null,
        event_name: args.eventName,
        source: args.source,
        payload: args.payload || {},
      }),
    });
  } catch {
    // Analytics is best-effort and must never break the UI.
  }
}

export function isBackendUnavailableError(error: unknown): boolean {
  if (!(error instanceof ApiClientError)) {
    return true;
  }
  return error.status >= 500 || error.status === 0 || error.code === 'internal_error';
}
