import { Blocks, Building2, Compass, GraduationCap, ShieldCheck, type LucideIcon } from 'lucide-react'

/**
 * Display definitions for the five GFF AI specialists shown in the
 * "Talk to GFF AI" motion stage. The `id` values match the backend agent ids
 * (and FALLBACK_AGENTS in lib/api/agents.ts), so selecting a card launches the
 * existing chat experience for that agent.
 */

export type AgentDisplay = {
  id: 'strategy' | 'architect' | 'governance' | 'industry' | 'training'
  name: string
  description: string
  icon: LucideIcon
  /** Accent hex — used for icon chip, glow, and status dot. */
  accent: string
  /** Very soft wash used behind the stage near this agent's typical region. */
  wash: string
  /** Supplied agent artwork (subject composed right, pale left). */
  image: string
}

export const AGENT_DISPLAY: AgentDisplay[] = [
  {
    id: 'strategy',
    name: 'Strategy Agent',
    description: 'Prioritize AI opportunities and build a practical transformation roadmap.',
    icon: Compass,
    accent: '#FF4D6D',
    wash: 'rgba(255, 77, 109, 0.05)',
    image: '/images/agents/strategy.png',
  },
  {
    id: 'architect',
    name: 'AI Architect Agent',
    description: 'Design secure AI architecture, data flows, integrations and orchestration.',
    icon: Blocks,
    accent: '#0EA5E9',
    wash: 'rgba(14, 165, 233, 0.05)',
    image: '/images/agents/architect.png',
  },
  {
    id: 'governance',
    name: 'Governance Agent',
    description: 'Shape policies, oversight, approvals and responsible AI controls.',
    icon: ShieldCheck,
    accent: '#10B981',
    wash: 'rgba(16, 185, 129, 0.05)',
    image: '/images/agents/governance.png',
  },
  {
    id: 'industry',
    name: 'Industry Agent',
    description: 'Explore industry use cases, reference solutions and measurable value.',
    icon: Building2,
    accent: '#F97316',
    wash: 'rgba(249, 115, 22, 0.05)',
    image: '/images/agents/industry.png',
  },
  {
    id: 'training',
    name: 'Training Advisor',
    description: 'Create learning paths and AI capability programs for your teams.',
    icon: GraduationCap,
    accent: '#8B5CF6',
    wash: 'rgba(139, 92, 246, 0.05)',
    image: '/images/agents/training.png',
  },
]
