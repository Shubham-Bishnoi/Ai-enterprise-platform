/**
 * Structured blueprint model.
 *
 * The homepage generator calls the live backend (see lib/api/blueprint.ts). That
 * response is prose-oriented; this module derives the richer, *structured*
 * decision-document shape the redesigned result renders (summary, priorities,
 * timeline roadmap, an architecture graph, and a governance matrix).
 *
 * Everything here is DERIVED from the submitted form (and the API result when
 * available) — nothing is a fixed, hard-coded blueprint. Different industry,
 * size, challenge, or outcome selections produce a different blueprint. Industry
 * templates supply the *structure* the API does not return (architecture graph,
 * governance columns, roadmap gates); the API supplies content when reachable.
 *
 * No fabricated financial figures or percentage improvements are produced.
 */

import type { BlueprintFormInput, BlueprintResult } from '@/lib/api/blueprint'
import { resolveIndustryVisual, type IndustryVisualKey } from './industry-visuals'

/* -------------------------------------------------------------------------- */
/* Types (mirrors the Part 5 data contract)                                    */
/* -------------------------------------------------------------------------- */

export type Complexity = 'Low' | 'Medium' | 'High'

export type Priority = {
  title: string
  problem: string
  outcome: string
  dataRequired: string[]
  complexity: Complexity
  timeToValue: string
  /** Relative business impact / implementation effort, for the 2-D view. */
  impact: Complexity
  effort: Complexity
}

export type RoadmapPhase = {
  phase: '0-30' | '31-60' | '61-90'
  title: string
  objective: string
  deliverables: string[]
  owners: string[]
  decisionGate: string
  successSignal: string
  dependencies: string[]
}

export type ArchLayerId = 'sources' | 'ingestion' | 'intelligence' | 'applications' | 'governance'
export type ArchNodeType = 'source' | 'ingestion' | 'intelligence' | 'application' | 'governance' | 'human'

export type ArchLayer = { id: ArchLayerId; label: string }
export type ArchNode = { id: string; label: string; layer: ArchLayerId; type: ArchNodeType; description: string }
export type ArchEdge = { source: string; target: string; label?: string }

export type ArchitectureModel = {
  layers: ArchLayer[]
  nodes: ArchNode[]
  edges: ArchEdge[]
}

export type GovernanceControl = {
  control: string
  reason: string
  implementation: string
  owner: string
  stage: string
}

export type NextAction = {
  key: 'workshop' | 'refine' | 'specialist' | 'download'
  label: string
  description: string
}

export type PriorityIndicator = { label: string; value: string }

export type StructuredBlueprint = {
  blueprintTitle: string
  executiveSummary: string
  industryVisualKey: IndustryVisualKey
  industryVisualSrc: string
  industryVisualAlt: string
  industryLabel: string
  companySizeLabel: string
  indicators: {
    primaryOpportunity: PriorityIndicator
    timeToValue: PriorityIndicator
    firstPhase: PriorityIndicator
  }
  priorities: Priority[]
  whyItFits: string[]
  roadmap: RoadmapPhase[]
  architecture: ArchitectureModel
  governanceControls: GovernanceControl[]
  nextActions: NextAction[]
  isDemo: boolean
}

/* -------------------------------------------------------------------------- */
/* Architecture templates (structure the API does not return)                  */
/* -------------------------------------------------------------------------- */

const ARCH_LAYERS: ArchLayer[] = [
  { id: 'sources', label: 'Data sources' },
  { id: 'ingestion', label: 'Ingestion & integration' },
  { id: 'intelligence', label: 'AI & intelligence' },
  { id: 'applications', label: 'Applications & agents' },
  { id: 'governance', label: 'Governance & monitoring' },
]

type NodeSeed = [id: string, label: string, layer: ArchLayerId, type: ArchNodeType, description: string]

function buildArchitecture(seeds: NodeSeed[]): ArchitectureModel {
  const nodes: ArchNode[] = seeds.map(([id, label, layer, type, description]) => ({
    id,
    label,
    layer,
    type,
    description,
  }))

  // Connect every node to the nearest node(s) in the next flow layer, so the
  // graph reads left→right with no manual crossing edges.
  const order: ArchLayerId[] = ['sources', 'ingestion', 'intelligence', 'applications']
  const byLayer = (l: ArchLayerId) => nodes.filter((n) => n.layer === l)
  const edges: ArchEdge[] = []
  for (let i = 0; i < order.length - 1; i++) {
    const from = byLayer(order[i])
    const to = byLayer(order[i + 1])
    if (!to.length) continue
    from.forEach((f, idx) => {
      const t = to[Math.min(idx, to.length - 1)]
      edges.push({ source: f.id, target: t.id })
    })
    // Ensure every downstream node has at least one incoming edge.
    to.forEach((t, idx) => {
      if (!edges.some((e) => e.target === t.id)) {
        edges.push({ source: from[Math.min(idx, from.length - 1)].id, target: t.id })
      }
    })
  }
  // Applications hand off to the human-review checkpoint when present.
  const human = nodes.find((n) => n.type === 'human')
  if (human) {
    byLayer('applications').forEach((a) => edges.push({ source: a.id, target: human.id, label: 'review' }))
  }
  return { layers: ARCH_LAYERS, nodes, edges }
}

const ARCHITECTURES: Record<IndustryVisualKey, () => ArchitectureModel> = {
  healthcare: () =>
    buildArchitecture([
      ['ehr', 'EHR / EMR', 'sources', 'source', 'Clinical records, encounters, and orders.'],
      ['sched', 'Scheduling', 'sources', 'source', 'Appointments, capacity, and referrals.'],
      ['docs', 'Clinical documents', 'sources', 'source', 'Notes, discharge summaries, and PDFs.'],
      ['fhir', 'Integration (HL7 / FHIR)', 'ingestion', 'ingestion', 'Standards-based interoperability layer.'],
      ['retrieval', 'Retrieval & knowledge', 'intelligence', 'intelligence', 'Grounded clinical context for every request.'],
      ['orch', 'AI orchestration', 'intelligence', 'intelligence', 'Planning, tool use, and safe model routing.'],
      ['clin', 'Clinician workflow', 'applications', 'application', 'Summaries and drafting inside existing tools.'],
      ['patient', 'Patient communication', 'applications', 'application', 'Governed, reviewed patient-facing messaging.'],
      ['audit', 'Audit & policy', 'governance', 'governance', 'Traceability, access control, and retention.'],
      ['approve', 'Clinician sign-off', 'governance', 'human', 'Human approval before any clinical action.'],
    ]),
  mining: () =>
    buildArchitecture([
      ['fleet', 'Fleet telemetry', 'sources', 'source', 'Haul-truck and vehicle position and status.'],
      ['geo', 'Geological data', 'sources', 'source', 'Block models, grades, and survey data.'],
      ['sensors', 'Equipment sensors', 'sources', 'source', 'Vibration, temperature, and load signals.'],
      ['edge', 'Edge / IoT ingestion', 'ingestion', 'ingestion', 'Resilient collection from remote sites.'],
      ['predict', 'Predictive models', 'intelligence', 'intelligence', 'Failure, throughput, and grade prediction.'],
      ['orch', 'AI orchestration', 'intelligence', 'intelligence', 'Coordinates models and operational tools.'],
      ['ops', 'Operations control', 'applications', 'application', 'Dispatch and throughput optimisation.'],
      ['maint', 'Maintenance workflow', 'applications', 'application', 'Work orders driven by predicted failures.'],
      ['safety', 'Safety & governance', 'governance', 'governance', 'Safety rules, monitoring, and audit trail.'],
      ['approve', 'Control-room approval', 'governance', 'human', 'Human sign-off for high-impact actions.'],
    ]),
  manufacturing: () =>
    buildArchitecture([
      ['mes', 'MES', 'sources', 'source', 'Manufacturing execution and line events.'],
      ['erp', 'ERP', 'sources', 'source', 'Orders, inventory, and planning data.'],
      ['machine', 'Machine sensors', 'sources', 'source', 'Telemetry from lines and equipment.'],
      ['quality', 'Quality images', 'sources', 'source', 'Vision data from inspection stations.'],
      ['platform', 'Data platform', 'ingestion', 'ingestion', 'Unified, contextualised operational data.'],
      ['pdm', 'Predictive maintenance', 'intelligence', 'intelligence', 'Anticipates failures before downtime.'],
      ['inspect', 'Quality inspection', 'intelligence', 'intelligence', 'Automated defect detection with review.'],
      ['prod', 'Production control', 'applications', 'application', 'Throughput and scheduling support.'],
      ['maint', 'Maintenance workflow', 'applications', 'application', 'Prioritised, evidence-backed work orders.'],
      ['monitor', 'Monitoring & governance', 'governance', 'governance', 'Drift monitoring, access, and audit.'],
      ['approve', 'Supervisor approval', 'governance', 'human', 'Human approval on flagged decisions.'],
    ]),
  financial: () =>
    buildArchitecture([
      ['core', 'Core & transactions', 'sources', 'source', 'Accounts, payments, and transaction history.'],
      ['crm', 'Customer data (CRM)', 'sources', 'source', 'Relationships, KYC, and interactions.'],
      ['docs', 'Documents & policy', 'sources', 'source', 'Statements, contracts, and policy text.'],
      ['platform', 'Integration & data platform', 'ingestion', 'ingestion', 'Governed access with lineage preserved.'],
      ['retrieval', 'Retrieval & knowledge', 'intelligence', 'intelligence', 'Grounded answers from authoritative sources.'],
      ['risk', 'Risk & fraud models', 'intelligence', 'intelligence', 'Scoring with explainability retained.'],
      ['advisor', 'Advisor / agent workflow', 'applications', 'application', 'Draft, summarise, and recommend with review.'],
      ['service', 'Customer service', 'applications', 'application', 'Governed, auditable customer responses.'],
      ['modelrisk', 'Model risk & audit', 'governance', 'governance', 'Model risk, access control, and audit log.'],
      ['approve', 'Analyst review', 'governance', 'human', 'Human review before customer-facing actions.'],
    ]),
  retail: () =>
    buildArchitecture([
      ['pos', 'POS & transactions', 'sources', 'source', 'Sales, baskets, and channel activity.'],
      ['catalog', 'Product catalog', 'sources', 'source', 'Products, attributes, and content.'],
      ['signals', 'Customer signals', 'sources', 'source', 'Behaviour, loyalty, and preferences.'],
      ['platform', 'Integration & data platform', 'ingestion', 'ingestion', 'Unified customer and product data.'],
      ['reco', 'Recommendation', 'intelligence', 'intelligence', 'Personalisation grounded in real catalog data.'],
      ['forecast', 'Demand forecast', 'intelligence', 'intelligence', 'Inventory and demand planning support.'],
      ['merch', 'Merchandising workflow', 'applications', 'application', 'Assortment and pricing decision support.'],
      ['cx', 'Customer experience', 'applications', 'application', 'Governed, on-brand customer interactions.'],
      ['monitor', 'Monitoring & governance', 'governance', 'governance', 'Content controls, access, and audit.'],
      ['approve', 'Merch approval', 'governance', 'human', 'Human review on customer-facing changes.'],
    ]),
  energy: () =>
    buildArchitecture([
      ['scada', 'Grid telemetry (SCADA)', 'sources', 'source', 'Real-time grid and substation signals.'],
      ['assets', 'Asset sensors', 'sources', 'source', 'Condition data from field assets.'],
      ['weather', 'Weather & demand', 'sources', 'source', 'External demand and generation drivers.'],
      ['edge', 'Edge / IoT ingestion', 'ingestion', 'ingestion', 'Resilient collection across the network.'],
      ['forecast', 'Load & generation forecast', 'intelligence', 'intelligence', 'Balancing supply and demand.'],
      ['pdm', 'Predictive maintenance', 'intelligence', 'intelligence', 'Anticipates asset failures.'],
      ['gridops', 'Grid operations', 'applications', 'application', 'Operator decision support.'],
      ['field', 'Field maintenance', 'applications', 'application', 'Prioritised field work orders.'],
      ['safety', 'Safety & regulatory', 'governance', 'governance', 'Safety rules, monitoring, and audit.'],
      ['approve', 'Control-room approval', 'governance', 'human', 'Human approval for grid actions.'],
    ]),
  neutral: () =>
    buildArchitecture([
      ['core', 'Core systems', 'sources', 'source', 'Systems of record and operational data.'],
      ['docs', 'Documents & knowledge', 'sources', 'source', 'Policies, documents, and reference content.'],
      ['ops', 'Operational data', 'sources', 'source', 'Process, ticketing, and activity data.'],
      ['platform', 'Integration & data platform', 'ingestion', 'ingestion', 'Governed access with lineage preserved.'],
      ['retrieval', 'Knowledge & retrieval', 'intelligence', 'intelligence', 'Grounded context for every request.'],
      ['orch', 'AI orchestration', 'intelligence', 'intelligence', 'Planning, tool use, and model routing.'],
      ['agent', 'Agent workflow', 'applications', 'application', 'Governed automation with human checkpoints.'],
      ['experience', 'Employee / customer experience', 'applications', 'application', 'Assistive, reviewed interactions.'],
      ['monitor', 'Governance & monitoring', 'governance', 'governance', 'Policy, access control, and audit.'],
      ['approve', 'Human approval', 'governance', 'human', 'Human sign-off before consequential actions.'],
    ]),
}

/* -------------------------------------------------------------------------- */
/* Governance templates                                                        */
/* -------------------------------------------------------------------------- */

function baseGovernance(): GovernanceControl[] {
  return [
    {
      control: 'Data privacy',
      reason: 'Sensitive data must stay protected and used within its permitted purpose.',
      implementation: 'Recommended: classify data, minimise collection, and enforce purpose limits.',
      owner: 'Data protection lead',
      stage: 'Days 0–30',
    },
    {
      control: 'Human approval',
      reason: 'Consequential actions need a person accountable before execution.',
      implementation: 'Required review: define human-in-the-loop thresholds per use case.',
      owner: 'Process owner',
      stage: 'Days 0–30',
    },
    {
      control: 'Model evaluation',
      reason: 'Quality and safety should be measured before and after release.',
      implementation: 'Recommended: an evaluation harness with pass criteria before go-live.',
      owner: 'AI engineering',
      stage: 'Days 31–60',
    },
    {
      control: 'Security & access',
      reason: 'Only authorised users and services should reach data and models.',
      implementation: 'Recommended: least-privilege access, secrets management, and reviews.',
      owner: 'Security',
      stage: 'Days 31–60',
    },
    {
      control: 'Audit logging',
      reason: 'Decisions and actions must be reconstructable after the fact.',
      implementation: 'Recommended: capture inputs, outputs, and approvals with retention.',
      owner: 'Platform',
      stage: 'Days 31–60',
    },
    {
      control: 'Monitoring',
      reason: 'Behaviour drifts; production needs continuous observation.',
      implementation: 'Recommended: quality, drift, and cost monitoring with alerting.',
      owner: 'Operations',
      stage: 'Days 61–90',
    },
  ]
}

const GOVERNANCE_ADDITIONS: Partial<Record<IndustryVisualKey, GovernanceControl[]>> = {
  healthcare: [
    {
      control: 'Clinical safety review',
      reason: 'Patient-facing outputs carry clinical risk.',
      implementation: 'Required review: clinical governance sign-off on in-scope use cases.',
      owner: 'Clinical governance',
      stage: 'Days 0–30',
    },
    {
      control: 'Regulatory review',
      reason: 'Health data handling is regulated and jurisdiction-specific.',
      implementation: 'Validate applicability with legal and compliance before deployment.',
      owner: 'Compliance',
      stage: 'Days 0–30',
    },
  ],
  financial: [
    {
      control: 'Model risk management',
      reason: 'Models influencing financial decisions need formal oversight.',
      implementation: 'Required review: document, validate, and independently review models.',
      owner: 'Model risk',
      stage: 'Days 31–60',
    },
    {
      control: 'Bias & fairness',
      reason: 'Customer-impacting decisions must be assessed for unfair outcomes.',
      implementation: 'Recommended: fairness testing on in-scope decisions; validate applicability.',
      owner: 'Risk & compliance',
      stage: 'Days 31–60',
    },
    {
      control: 'Regulatory review',
      reason: 'Financial services obligations are jurisdiction-specific.',
      implementation: 'Validate applicability with compliance before customer-facing use.',
      owner: 'Compliance',
      stage: 'Days 0–30',
    },
  ],
  mining: [
    {
      control: 'Operational safety',
      reason: 'Automated actions can affect physical safety on site.',
      implementation: 'Required review: safety sign-off and fail-safe limits on actions.',
      owner: 'HSE lead',
      stage: 'Days 0–30',
    },
  ],
  energy: [
    {
      control: 'Operational safety',
      reason: 'Grid actions carry safety and reliability risk.',
      implementation: 'Required review: safety limits and control-room approval on actions.',
      owner: 'HSE lead',
      stage: 'Days 0–30',
    },
    {
      control: 'Regulatory review',
      reason: 'Utilities operate under sector-specific regulation.',
      implementation: 'Validate applicability with regulatory affairs before deployment.',
      owner: 'Regulatory affairs',
      stage: 'Days 0–30',
    },
  ],
  manufacturing: [
    {
      control: 'Operational safety',
      reason: 'Line-level automation can affect worker safety.',
      implementation: 'Required review: safety limits and supervisor approval on actions.',
      owner: 'HSE lead',
      stage: 'Days 0–30',
    },
  ],
  retail: [
    {
      control: 'Consumer data & consent',
      reason: 'Personalisation relies on consented customer data.',
      implementation: 'Recommended: consent tracking and preference enforcement.',
      owner: 'Data protection lead',
      stage: 'Days 0–30',
    },
    {
      control: 'Bias & fairness',
      reason: 'Pricing and targeting can create unfair outcomes.',
      implementation: 'Recommended: review targeting logic; validate applicability.',
      owner: 'Risk & compliance',
      stage: 'Days 31–60',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* Priority derivation                                                         */
/* -------------------------------------------------------------------------- */

const COMPLEXITY_MAP: Record<string, Complexity> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function normaliseComplexity(value: string | undefined, fallback: Complexity): Complexity {
  return COMPLEXITY_MAP[(value ?? '').trim().toLowerCase()] ?? fallback
}

function impactFromLabel(value: string | undefined, fallback: Complexity): Complexity {
  const v = (value ?? '').toLowerCase()
  if (v.includes('high')) return 'High'
  if (v.includes('low')) return 'Low'
  if (v.includes('medium') || v.includes('mid')) return 'Medium'
  return fallback
}

/** Top data-source labels for an industry, used as "data required" hints. */
function dataSourcesFor(key: IndustryVisualKey): string[] {
  return ARCHITECTURES[key]()
    .nodes.filter((n) => n.layer === 'sources')
    .slice(0, 3)
    .map((n) => n.label)
}

function derivePriorities(form: BlueprintFormInput, key: IndustryVisualKey, api: BlueprintResult | null): Priority[] {
  const data = dataSourcesFor(key)
  const challenge = form.biggestChallenge || 'operational inefficiency'

  // Prefer the model's opportunities when the backend is reachable.
  if (api?.opportunities?.length) {
    return api.opportunities.slice(0, 5).map((o, i) => ({
      title: o.title,
      problem: o.whyItMatters || `Addresses ${challenge.toLowerCase()} in ${form.industry || 'the business'}.`,
      outcome: o.description,
      dataRequired: data.length ? data : ['Core systems', 'Documents'],
      complexity: normaliseComplexity(o.complexity, i === 0 ? 'Medium' : 'High'),
      timeToValue: o.timeToValue || '8–12 weeks',
      impact: impactFromLabel(o.impact, i === 0 ? 'High' : 'Medium'),
      effort: normaliseComplexity(o.complexity, i === 0 ? 'Medium' : 'High'),
    }))
  }

  // Otherwise derive three opportunities from the selected inputs.
  const outcomes = form.topPriorities?.length ? form.topPriorities : ['operational efficiency']
  const primaryOutcome = outcomes[0]
  return [
    {
      title: 'Agentic workflow automation',
      problem: `${challenge} slows high-volume work in ${form.industry || 'the organisation'}.`,
      outcome: `Automate the highest-volume workflows with human approval, targeting ${primaryOutcome.toLowerCase()}.`,
      dataRequired: data.slice(0, 2),
      complexity: 'Medium',
      timeToValue: '8–12 weeks',
      impact: 'High',
      effort: 'Medium',
    },
    {
      title: 'Grounded knowledge & retrieval',
      problem: 'Answers and decisions depend on context trapped across systems and documents.',
      outcome: 'Unify authoritative sources into a governed retrieval layer that grounds every agent.',
      dataRequired: data,
      complexity: 'High',
      timeToValue: '3–6 months',
      impact: 'High',
      effort: 'High',
    },
    {
      title: 'Governed AI operations',
      problem: 'Scaling without controls creates risk and rework.',
      outcome: 'Stand up monitoring, approvals, and audit before scaling beyond the first use case.',
      dataRequired: ['Access & identity', 'Audit log'],
      complexity: 'Medium',
      timeToValue: '6–10 weeks',
      impact: 'Medium',
      effort: 'Medium',
    },
  ]
}

/* -------------------------------------------------------------------------- */
/* Roadmap derivation                                                          */
/* -------------------------------------------------------------------------- */

function deriveRoadmap(form: BlueprintFormInput, priorities: Priority[], api: BlueprintResult | null): RoadmapPhase[] {
  const lead = priorities[0]?.title ?? 'the priority use case'
  const apiPhases = api?.roadmap ?? []

  const base: RoadmapPhase[] = [
    {
      phase: '0-30',
      title: 'Discover & validate',
      objective: apiPhases[0]?.objective || `Confirm and sequence the highest-value opportunities for ${form.industry || 'the business'}.`,
      deliverables: apiPhases[0]?.deliverables?.length
        ? apiPhases[0].deliverables.slice(0, 4)
        : ['Prioritised opportunity backlog', 'Value & feasibility scoring', 'Target data-source inventory'],
      owners: ['Transformation lead', 'Domain sponsor'],
      decisionGate: 'Approve the lead use case and its success metric.',
      successSignal: 'A signed-off, sequenced backlog with an owner per opportunity.',
      dependencies: ['Stakeholder access', 'Data-source owners identified'],
    },
    {
      phase: '31-60',
      title: 'Build & pilot',
      objective: apiPhases[1]?.objective || `Architect and pilot ${lead} with governance designed in.`,
      deliverables: apiPhases[1]?.deliverables?.length
        ? apiPhases[1].deliverables.slice(0, 4)
        : ['Reference architecture', 'Working pilot behind approval gates', 'Evaluation harness'],
      owners: ['AI engineering', 'Process owner'],
      decisionGate: 'Pilot meets evaluation criteria and approval design.',
      successSignal: 'Pilot passes evaluation with a human-in-the-loop path.',
      dependencies: ['Data access provisioned', 'Governance thresholds agreed'],
    },
    {
      phase: '61-90',
      title: 'Deploy & measure',
      objective: apiPhases[2]?.objective || 'Move the validated pilot into governed production and measure impact.',
      deliverables: apiPhases[2]?.deliverables?.length
        ? apiPhases[2].deliverables.slice(0, 4)
        : ['Production deployment', 'Monitoring & audit trail', 'Operating runbook'],
      owners: ['Operations', 'AI engineering'],
      decisionGate: 'Go / no-go for scaling to the next opportunity.',
      successSignal: 'Stable production use with monitoring and a measured baseline.',
      dependencies: ['Security review complete', 'Support model in place'],
    },
  ]
  return base
}

/* -------------------------------------------------------------------------- */
/* Governance derivation                                                       */
/* -------------------------------------------------------------------------- */

function deriveGovernance(key: IndustryVisualKey): GovernanceControl[] {
  const additions = GOVERNANCE_ADDITIONS[key] ?? []
  // Industry-specific controls first, then the shared base — de-duplicated.
  const seen = new Set<string>()
  return [...additions, ...baseGovernance()].filter((c) => {
    const id = c.control.toLowerCase()
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

/* -------------------------------------------------------------------------- */
/* Summary + assembly                                                          */
/* -------------------------------------------------------------------------- */

function titleCaseIndustry(industry: string): string {
  return industry || 'Enterprise'
}

function deriveSummary(form: BlueprintFormInput, priorities: Priority[]) {
  const industry = titleCaseIndustry(form.industry)
  const sizeLabel = SIZE_CONTEXT[form.companySize] ?? form.companySize ?? 'Enterprise'
  const stage = form.aiJourneyStage || 'exploring AI'
  const challenge = form.biggestChallenge || 'manual, disconnected processes'
  const lead = priorities[0]

  const blueprintTitle = `${industry} enterprise AI blueprint`
  // Lead with the size label (a noun phrase) to avoid awkward a/an articles.
  const executiveSummary =
    `${sizeLabel} ${industry.toLowerCase()} organisation, currently at the "${stage.toLowerCase()}" stage and ` +
    `focused on ${challenge.toLowerCase()}. This blueprint sequences ${priorities.length} governed opportunities, ` +
    `leading with ${lead.title.toLowerCase()}, and lands them through a 90-day Garage → Foundry → Factory path.`

  return { blueprintTitle, executiveSummary }
}

function deriveWhyItFits(form: BlueprintFormInput, priorities: Priority[]): string[] {
  const points: string[] = []
  if (form.industry) points.push(`Shaped around ${form.industry} data sources and workflows.`)
  if (form.biggestChallenge) points.push(`Targets your stated challenge: ${form.biggestChallenge.toLowerCase()}.`)
  if (form.topPriorities?.length) points.push(`Aligned to your priorities: ${form.topPriorities.join(', ').toLowerCase()}.`)
  points.push(`Leads with a ${priorities[0].complexity.toLowerCase()}-complexity opportunity to show value early.`)
  return points
}

function deriveNextActions(): NextAction[] {
  return [
    { key: 'workshop', label: 'Start a discovery workshop', description: 'Pressure-test these opportunities and sequencing with your team.' },
    { key: 'refine', label: 'Refine this blueprint', description: 'Adjust your inputs and regenerate with different priorities.' },
    { key: 'specialist', label: 'Talk to an AI specialist', description: 'Discuss the architecture and governance with a GFF AI specialist.' },
    { key: 'download', label: 'Download blueprint', description: 'Save a text summary of this blueprint to share internally.' },
  ]
}

const SIZE_CONTEXT: Record<string, string> = {
  Startup: 'Startup',
  SMB: 'Small & mid-size',
  Enterprise: 'Enterprise',
  'Large Enterprise': 'Large enterprise',
}

/**
 * Build the structured blueprint from the submitted form and the API result
 * (when reachable). `isDemo` marks a blueprint derived without the backend.
 */
export function deriveStructuredBlueprint(
  form: BlueprintFormInput,
  api: BlueprintResult | null,
): StructuredBlueprint {
  const visual = resolveIndustryVisual(form.industry)
  const priorities = derivePriorities(form, visual.key, api)
  const roadmap = deriveRoadmap(form, priorities, api)
  const governanceControls = deriveGovernance(visual.key)
  const architecture = ARCHITECTURES[visual.key]()
  const { blueprintTitle, executiveSummary } = deriveSummary(form, priorities)

  const lead = priorities[0]

  return {
    blueprintTitle,
    executiveSummary,
    industryVisualKey: visual.key,
    industryVisualSrc: visual.src,
    industryVisualAlt: visual.label,
    industryLabel: form.industry || 'Enterprise',
    companySizeLabel: SIZE_CONTEXT[form.companySize] ?? form.companySize ?? 'Enterprise',
    indicators: {
      primaryOpportunity: { label: 'Primary opportunity', value: lead.title },
      timeToValue: { label: 'Expected time-to-value', value: lead.timeToValue },
      firstPhase: { label: 'Recommended first phase', value: 'Days 0–30: Discover & validate' },
    },
    priorities,
    whyItFits: deriveWhyItFits(form, priorities),
    roadmap,
    architecture,
    governanceControls,
    nextActions: deriveNextActions(),
    isDemo: api === null || api?.isDemo === true,
  }
}

/* -------------------------------------------------------------------------- */
/* Defensive validation — never let malformed data crash the result view      */
/* -------------------------------------------------------------------------- */

export function isRenderableBlueprint(b: StructuredBlueprint | null | undefined): b is StructuredBlueprint {
  return Boolean(
    b &&
      typeof b.blueprintTitle === 'string' &&
      Array.isArray(b.priorities) &&
      b.priorities.length > 0 &&
      Array.isArray(b.roadmap) &&
      b.roadmap.length > 0 &&
      b.architecture &&
      Array.isArray(b.architecture.nodes) &&
      b.architecture.nodes.length > 0,
  )
}
