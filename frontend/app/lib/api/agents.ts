/**
 * Talk to GFF AI — agent conversation API.
 *
 * Contracts mirrored from the live backend (verified against
 * https://gff-ai-backend.onrender.com/api/v1/agents).
 */

import { apiRequest, endpoints } from './client'

export type BackendQuickAction = {
  id: string
  label: string
  prompt: string
}

export type BackendAgent = {
  id: string
  slug: string
  name: string
  title: string
  subtitle: string
  description: string
  greeting: string
  icon: string
  image_url: string | null
  status: string
  quick_actions: BackendQuickAction[]
}

type BackendMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

type BackendSessionResponse = {
  session_id: string
  state: string
  selected_agent: BackendAgent | null
  messages: BackendMessage[]
  quick_actions: BackendQuickAction[]
}

type BackendChatResponse = {
  session_id: string
  state: string
  assistant_message: string
  confidence_score: number
  recommended_paths: { id: string; title: string; description: string; agent_id: string }[]
  recommended_solutions: { id: string; name: string; description: string; category: string }[]
  suggested_questions: { id: string; question: string }[]
  next_actions: { type: string; label: string; payload: Record<string, unknown> }[]
}

export type ChatMessage = {
  id: string
  role: 'user' | 'agent'
  text: string
}

export type ChatTurn = {
  message: ChatMessage
  suggestedQuestions: string[]
}

/**
 * Static mirror of the five live agents. Used only when the backend is
 * unreachable so the section still renders something meaningful.
 */
export const FALLBACK_AGENTS: BackendAgent[] = [
  {
    id: 'strategy',
    slug: 'strategy-agent',
    name: 'Strategy Agent',
    title: 'Enterprise AI strategy and transformation planning',
    subtitle: 'Roadmaps, operating models, and use case prioritization.',
    description: 'Builds AI transformation roadmaps and prioritizes high-value use cases.',
    greeting: 'Let us map your AI transformation roadmap and prioritize where to start.',
    icon: 'compass',
    image_url: null,
    status: 'active',
    quick_actions: [
      { id: 'create-ai-transformation-roadmap', label: 'Create AI Roadmap', prompt: 'Help me create an AI transformation roadmap.' },
      { id: 'prioritize-ai-use-cases', label: 'Prioritize Use Cases', prompt: 'Help me prioritize AI use cases by value and feasibility.' },
      { id: 'define-90-day-ai-pilot', label: 'Define 90-Day Pilot', prompt: 'Help me define a 90-day AI pilot.' },
    ],
  },
  {
    id: 'architect',
    slug: 'ai-architect-agent',
    name: 'AI Architect Agent',
    title: 'Enterprise AI architecture and solution designer',
    subtitle: 'Architecture, data, integrations, orchestration, and security.',
    description: 'Designs enterprise AI architecture, data layers, and integration patterns.',
    greeting: 'I can help shape your data layer, integrations, and agent orchestration design.',
    icon: 'blocks',
    image_url: null,
    status: 'active',
    quick_actions: [
      { id: 'design-ai-architecture', label: 'Design AI Architecture', prompt: 'Help me design an enterprise AI architecture.' },
      { id: 'map-data-intelligence-layer', label: 'Map Data Layer', prompt: 'Help me map our data and intelligence layer.' },
      { id: 'plan-agent-orchestration', label: 'Plan Orchestration', prompt: 'Help me plan multi-agent orchestration.' },
    ],
  },
  {
    id: 'governance',
    slug: 'governance-agent',
    name: 'Governance Agent',
    title: 'Responsible AI, risk controls, and compliance',
    subtitle: 'Policy, model oversight, audit, and approval workflows.',
    description: 'Assesses governance readiness and designs risk and compliance controls.',
    greeting: 'Let us assess your AI governance readiness and define the right controls.',
    icon: 'shield',
    image_url: null,
    status: 'active',
    quick_actions: [
      { id: 'assess-ai-governance-readiness', label: 'Assess Governance', prompt: 'Assess our AI governance readiness.' },
      { id: 'define-risk-controls', label: 'Define Risk Controls', prompt: 'Help me define AI risk controls.' },
      { id: 'build-compliance-framework', label: 'Build Compliance Framework', prompt: 'Help me build an AI compliance framework.' },
    ],
  },
  {
    id: 'industry',
    slug: 'industry-agent',
    name: 'Industry Agent',
    title: 'Sector-specific AI use cases and benchmarks',
    subtitle: 'Industry challenges, reference solutions, and ROI framing.',
    description: 'Finds industry AI use cases and benchmarks against sector peers.',
    greeting: 'Tell me your sector and I will map the highest-value AI opportunities.',
    icon: 'building',
    image_url: null,
    status: 'active',
    quick_actions: [
      { id: 'find-industry-ai-use-cases', label: 'Find Use Cases', prompt: 'Find AI use cases for my industry.' },
      { id: 'benchmark-my-industry', label: 'Benchmark Industry', prompt: 'Benchmark my industry on AI adoption.' },
      { id: 'identify-high-roi-opportunities', label: 'High-ROI Opportunities', prompt: 'Identify high-ROI AI opportunities.' },
    ],
  },
  {
    id: 'training',
    slug: 'training-advisor',
    name: 'Training Advisor',
    title: 'Workforce readiness and AI enablement',
    subtitle: 'Learning paths, academy programs, and team enablement.',
    description: 'Designs AI training plans and role-based learning paths.',
    greeting: 'Let us build the capability plan your teams need to adopt AI.',
    icon: 'graduation-cap',
    image_url: null,
    status: 'active',
    quick_actions: [
      { id: 'build-ai-training-plan', label: 'Build Training Plan', prompt: 'Help me build an AI training plan.' },
      { id: 'assess-workforce-readiness', label: 'Assess Readiness', prompt: 'Assess our workforce AI readiness.' },
      { id: 'design-ai-academy-program', label: 'Design Academy', prompt: 'Help me design an AI academy program.' },
    ],
  },
]

export async function fetchAgents(): Promise<BackendAgent[]> {
  return apiRequest<BackendAgent[]>(endpoints.agents)
}

export async function startAgentSession(
  selectedAgentId: string | null,
  sourceSurface = 'homepage_talk_to_agent',
): Promise<{ sessionId: string; messages: ChatMessage[]; quickActions: BackendQuickAction[] }> {
  const data = await apiRequest<BackendSessionResponse>(endpoints.agentSession, {
    method: 'POST',
    body: JSON.stringify({
      selected_agent_id: selectedAgentId,
      source_surface: sourceSurface,
    }),
  })

  return {
    sessionId: data.session_id,
    messages: data.messages.map((m) => ({
      id: m.id,
      role: m.role === 'user' ? 'user' : 'agent',
      text: m.content,
    })),
    quickActions: data.quick_actions ?? [],
  }
}

function toChatTurn(data: BackendChatResponse): ChatTurn {
  return {
    message: {
      id: `assistant_${data.session_id}_${Date.now()}`,
      role: 'agent',
      text: data.assistant_message,
    },
    suggestedQuestions: (data.suggested_questions ?? []).map((q) => q.question),
  }
}

export async function sendAgentMessage(args: {
  sessionId: string
  message: string
  selectedAgentId: string | null
  sourceSurface?: string
}): Promise<ChatTurn> {
  const data = await apiRequest<BackendChatResponse>(endpoints.agentChat, {
    method: 'POST',
    body: JSON.stringify({
      session_id: args.sessionId,
      message: args.message,
      selected_agent_id: args.selectedAgentId,
      source_surface: args.sourceSurface ?? 'homepage_talk_to_agent',
    }),
  })
  return toChatTurn(data)
}

export async function sendAgentQuickAction(args: {
  sessionId: string
  quickActionId: string
  selectedAgentId: string | null
}): Promise<ChatTurn> {
  const data = await apiRequest<BackendChatResponse>(endpoints.agentQuickAction, {
    method: 'POST',
    body: JSON.stringify({
      session_id: args.sessionId,
      quick_action_id: args.quickActionId,
      selected_agent_id: args.selectedAgentId,
    }),
  })
  return toChatTurn(data)
}
