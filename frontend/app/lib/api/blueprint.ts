/**
 * Enterprise AI Blueprint API.
 *
 * Request/response shapes mirrored from the live backend
 * (GET /api/v1/blueprint/options, POST /api/v1/blueprint/generate).
 */

import { apiRequest, endpoints } from './client'

type BackendOptionItem = {
  label: string
  value: string
  description?: string | null
}

type BackendBlueprintOptions = {
  industries: BackendOptionItem[]
  company_sizes: BackendOptionItem[]
  top_priorities: BackendOptionItem[]
  ai_journey_stages: BackendOptionItem[]
  biggest_challenges: BackendOptionItem[]
  advanced_options: {
    data_readiness: BackendOptionItem[]
    existing_systems: BackendOptionItem[]
    leadership_commitment: BackendOptionItem[]
    risk_appetite: BackendOptionItem[]
  }
}

export type BlueprintOptions = {
  industries: string[]
  companySizes: string[]
  topPriorities: string[]
  aiJourneyStages: string[]
  biggestChallenges: string[]
  dataReadiness: string[]
  leadershipCommitment: string[]
  riskAppetite: string[]
}

export type BlueprintFormInput = {
  industry: string
  companySize: string
  topPriorities: string[]
  aiJourneyStage: string
  biggestChallenge: string
  email: string
  dataReadiness?: string
  leadershipCommitment?: string
  riskAppetite?: string
}

export type BlueprintResult = {
  id: string
  profileSummary: string
  readinessScore: number
  readinessCategory: string
  readinessBreakdown: { label: string; value: number }[]
  opportunities: {
    title: string
    description: string
    impact: string
    complexity: string
    timeToValue: string
    whyItMatters: string
    firstStep: string
  }[]
  roadmap: {
    phase: number
    name: string
    objective: string
    timeline: string
    activities: string[]
    deliverables: string[]
  }[]
  architecture: { name: string; description: string; technologies: string[] }[]
  governance: { name: string; controls: string[] }[]
  nextActions: { title: string; description: string }[]
  assumptions: string[]
  isDemo?: boolean
}

type BackendBlueprintResult = {
  id: string
  profile_summary: string
  readiness_score: number
  readiness_category: string
  readiness_breakdown: {
    ai_maturity: number
    business_need: number
    data_readiness: number
    process_complexity: number
    transformation_readiness: number
  }
  top_opportunities: {
    title: string
    description: string
    impact: string
    complexity: string
    time_to_value: string
    why_it_matters: string
    suggested_first_step: string
  }[]
  roadmap_phases: {
    phase_number: number
    name: string
    objective: string
    timeline: string
    activities: string[]
    deliverables: string[]
  }[]
  architecture_layers: { name: string; description: string; technologies: string[] }[]
  governance_framework: { name: string; controls: string[] }[]
  next_actions: { action_key: string; label: string; description: string }[]
  assumptions: string[]
}

export const FALLBACK_BLUEPRINT_OPTIONS: BlueprintOptions = {
  industries: [
    'Banking', 'Financial Services', 'Insurance', 'Healthcare', 'Life Sciences',
    'Manufacturing', 'Retail', 'Education', 'Government', 'Mining',
    'Energy', 'Telecom', 'Audit', 'Tax', 'Legal', 'Other',
  ],
  companySizes: ['Startup', 'SMB', 'Enterprise', 'Large Enterprise'],
  topPriorities: [
    'Cost Reduction', 'Productivity', 'Customer Experience', 'Revenue Growth',
    'Compliance', 'AI Transformation', 'Automate Processes', 'Faster Decision Making',
  ],
  aiJourneyStages: ['No AI', 'Just Starting', 'Exploring AI', 'Running Pilots', 'Scaling AI', 'AI-Native'],
  biggestChallenges: [
    'Data Quality', 'Manual Processes', 'Knowledge Silos', 'Compliance Risk',
    'Legacy Systems', 'Workforce Readiness', 'High Operating Cost', 'Slow Decision Making',
  ],
  dataReadiness: ['Highly fragmented', 'Partially connected', 'Mostly integrated', 'Fully integrated'],
  leadershipCommitment: ['Not Discussed', 'Exploring', 'Budget Approved', 'Executive Mandate'],
  riskAppetite: ['Conservative', 'Balanced', 'Aggressive', 'Highly Regulated'],
}

function values(items: BackendOptionItem[] | undefined): string[] {
  return (items ?? []).map((i) => i.value)
}

export async function fetchBlueprintOptions(): Promise<BlueprintOptions> {
  const data = await apiRequest<BackendBlueprintOptions>(endpoints.blueprintOptions)
  return {
    industries: values(data.industries),
    companySizes: values(data.company_sizes),
    topPriorities: values(data.top_priorities),
    aiJourneyStages: values(data.ai_journey_stages),
    biggestChallenges: values(data.biggest_challenges),
    dataReadiness: values(data.advanced_options?.data_readiness),
    leadershipCommitment: values(data.advanced_options?.leadership_commitment),
    riskAppetite: values(data.advanced_options?.risk_appetite),
  }
}

export async function generateBlueprint(form: BlueprintFormInput): Promise<BlueprintResult> {
  const data = await apiRequest<BackendBlueprintResult>(endpoints.blueprintGenerate, {
    method: 'POST',
    // Blueprint generation runs an LLM synthesis pass — allow extra headroom.
    timeoutMs: 90_000,
    body: JSON.stringify({
      industry: form.industry,
      company_size: form.companySize,
      top_priorities: form.topPriorities,
      ai_journey_stage: form.aiJourneyStage,
      biggest_challenge: form.biggestChallenge,
      email: form.email,
      data_readiness: form.dataReadiness || null,
      existing_systems: [],
      leadership_commitment: form.leadershipCommitment || null,
      risk_appetite: form.riskAppetite || null,
      source: 'homepage_blueprint',
    }),
  })

  const b = data.readiness_breakdown
  return {
    id: data.id,
    profileSummary: data.profile_summary,
    readinessScore: data.readiness_score,
    readinessCategory: data.readiness_category,
    readinessBreakdown: [
      { label: 'AI Maturity', value: b?.ai_maturity ?? 0 },
      { label: 'Business Need', value: b?.business_need ?? 0 },
      { label: 'Data Readiness', value: b?.data_readiness ?? 0 },
      { label: 'Process Complexity', value: b?.process_complexity ?? 0 },
      { label: 'Transformation Readiness', value: b?.transformation_readiness ?? 0 },
    ],
    opportunities: (data.top_opportunities ?? []).map((o) => ({
      title: o.title,
      description: o.description,
      impact: o.impact,
      complexity: o.complexity,
      timeToValue: o.time_to_value,
      whyItMatters: o.why_it_matters,
      firstStep: o.suggested_first_step,
    })),
    roadmap: (data.roadmap_phases ?? []).map((p) => ({
      phase: p.phase_number,
      name: p.name,
      objective: p.objective,
      timeline: p.timeline,
      activities: p.activities ?? [],
      deliverables: p.deliverables ?? [],
    })),
    architecture: (data.architecture_layers ?? []).map((a) => ({
      name: a.name,
      description: a.description,
      technologies: a.technologies ?? [],
    })),
    governance: (data.governance_framework ?? []).map((g) => ({
      name: g.name,
      controls: g.controls ?? [],
    })),
    nextActions: (data.next_actions ?? []).map((n) => ({
      title: n.label,
      description: n.description,
    })),
    assumptions: data.assumptions ?? [],
  }
}

/**
 * Shown when the backend cannot be reached. Explicitly flagged via `isDemo`
 * so the UI can label it as illustrative rather than passing it off as a
 * real generated result.
 */
export function buildDemoBlueprint(form: BlueprintFormInput): BlueprintResult {
  const industry = form.industry || 'your industry'
  return {
    id: 'demo',
    isDemo: true,
    profileSummary: `Illustrative blueprint for a ${form.companySize || 'enterprise'} organisation in ${industry}, currently at the "${form.aiJourneyStage || 'exploring'}" stage.`,
    readinessScore: 62,
    readinessCategory: 'Emerging',
    readinessBreakdown: [
      { label: 'AI Maturity', value: 55 },
      { label: 'Business Need', value: 78 },
      { label: 'Data Readiness', value: 58 },
      { label: 'Process Complexity', value: 64 },
      { label: 'Transformation Readiness', value: 60 },
    ],
    opportunities: [
      {
        title: 'Agentic workflow automation',
        description: `Automate high-volume manual workflows in ${industry} using supervised agents with human approval gates.`,
        impact: 'High',
        complexity: 'Medium',
        timeToValue: '8–12 weeks',
        whyItMatters: 'Removes repetitive effort while keeping a governed audit trail.',
        firstStep: 'Map the three highest-volume manual workflows and their approval points.',
      },
      {
        title: 'Knowledge graph foundation',
        description: 'Unify fragmented documents and systems into a queryable enterprise knowledge layer.',
        impact: 'High',
        complexity: 'High',
        timeToValue: '3–6 months',
        whyItMatters: 'Most AI accuracy problems trace back to missing context, not model choice.',
        firstStep: 'Inventory the top ten authoritative data sources and their owners.',
      },
      {
        title: 'Governed AI operations',
        description: 'Establish monitoring, policy controls, and model oversight before scaling.',
        impact: 'Medium',
        complexity: 'Medium',
        timeToValue: '6–10 weeks',
        whyItMatters: 'Governance retrofitted after scale costs materially more than governance designed in.',
        firstStep: 'Define approval workflows and risk tiers for AI use cases.',
      },
    ],
    roadmap: [
      {
        phase: 1,
        name: 'Garage — Discover',
        objective: 'Identify and validate high-value AI opportunities.',
        timeline: 'Weeks 1–4',
        activities: ['Opportunity workshops', 'Use case scoring', 'Data source review'],
        deliverables: ['Prioritised use case backlog', 'Value hypothesis'],
      },
      {
        phase: 2,
        name: 'Foundry — Build',
        objective: 'Architect and prototype the first agentic system.',
        timeline: 'Weeks 5–10',
        activities: ['Reference architecture', 'Prototype build', 'Evaluation harness'],
        deliverables: ['Working prototype', 'Architecture decision record'],
      },
      {
        phase: 3,
        name: 'Factory — Operate',
        objective: 'Move the validated system into governed production.',
        timeline: 'Weeks 11–16',
        activities: ['Production hardening', 'Governance controls', 'Operational runbooks'],
        deliverables: ['Production deployment', 'Monitoring and audit trail'],
      },
    ],
    architecture: [
      {
        name: 'Data & Knowledge Layer',
        description: 'Unified access to enterprise data with lineage and permissions preserved.',
        technologies: ['Knowledge graph', 'Vector store', 'Data catalog'],
      },
      {
        name: 'Agent Orchestration Layer',
        description: 'Planning, tool use, and multi-agent coordination with human checkpoints.',
        technologies: ['Agent runtime', 'Tool registry', 'Workflow engine'],
      },
      {
        name: 'Governance & Observability Layer',
        description: 'Policy enforcement, evaluation, and full traceability of agent behaviour.',
        technologies: ['Policy engine', 'Evaluation suite', 'Audit log'],
      },
    ],
    governance: [
      { name: 'Responsible AI Policy', controls: ['Use case risk tiering', 'Human-in-the-loop thresholds', 'Disclosure standards'] },
      { name: 'Model Oversight', controls: ['Evaluation before release', 'Drift monitoring', 'Rollback procedure'] },
      { name: 'Audit & Compliance', controls: ['Decision traceability', 'Access controls', 'Retention policy'] },
    ],
    nextActions: [
      { title: 'Book a discovery workshop', description: 'Pressure-test these opportunities with your team and validate the sequencing.' },
      { title: 'Run a 90-day pilot', description: 'Take the highest-value opportunity from prototype to governed production.' },
    ],
    assumptions: [
      'This is an illustrative sample generated offline, not a live analysis of your organisation.',
      'Scores and timelines are directional and should be validated in a discovery workshop.',
    ],
  }
}
