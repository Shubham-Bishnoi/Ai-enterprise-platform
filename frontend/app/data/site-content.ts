export const contact = {
  email: 'hello@gffai.ai',
}

export const legalText =
  'The information on this website is provided for general informational purposes only. Product features, demonstrations, use cases, and roadmap items are illustrative and subject to change without notice. All intellectual property, including trademarks, content, methodologies, software, and designs, is the exclusive property of GFF AI PTE. LTD. Unauthorized use, reproduction, or distribution is prohibited. Third-party trademarks remain the property of their respective owners.'

export type JourneyStage = {
  name: string
  purpose: string
  deliverables: string
  outcome: string
  accent: 'red' | 'purple' | 'blue'
}

export const journeyStages: JourneyStage[] = [
  {
    name: 'Garage',
    purpose: 'Discover high-value AI opportunities and create rapid prototypes.',
    deliverables: 'Opportunity maps, use case portfolio, working prototypes',
    outcome: 'A validated AI direction grounded in business value',
    accent: 'red',
  },
  {
    name: 'Foundry',
    purpose: 'Architect resilient multi-agent systems and enterprise AI foundations.',
    deliverables: 'Reference architectures, agent platforms, knowledge graph foundation',
    outcome: 'Engineered systems ready for enterprise deployment',
    accent: 'purple',
  },
  {
    name: 'Factory',
    purpose: 'Deploy robust AI workloads into production-ready operating systems.',
    deliverables: 'Production deployments, integration layers, operating runbooks',
    outcome: 'AI running inside the enterprise, not beside it',
    accent: 'blue',
  },
  {
    name: 'Operate',
    purpose: 'Monitor execution, governance, agent behavior, and model performance.',
    deliverables: 'Control center, governance dashboards, observability pipelines',
    outcome: 'Governed, observable, human-in-the-loop AI operations',
    accent: 'blue',
  },
  {
    name: 'Optimize',
    purpose: 'Improve accuracy, cost, workflows, and business outcomes.',
    deliverables: 'Evaluation loops, cost optimization, workflow refinement',
    outcome: 'Continuously improving AI performance and economics',
    accent: 'purple',
  },
  {
    name: 'Scale',
    purpose: 'Expand AI capability across business units, regions, and products.',
    deliverables: 'Scaling playbooks, capability academies, reusable asset libraries',
    outcome: 'An AI operating model that compounds across the enterprise',
    accent: 'red',
  },
]

export type Capability = {
  name: string
  description: string
  outcome: string
  problem: string
  deliverables: string[]
  platforms: string[]
}

export const capabilities: Capability[] = [
  {
    name: 'AI Strategy',
    description: 'Transformation roadmaps, operating models, and use case prioritization.',
    outcome: 'A clear, board-ready path from AI ambition to enterprise value.',
    problem: 'AI investment without direction — scattered pilots and unclear priorities.',
    deliverables: ['AI transformation roadmap', 'Operating model design', 'Use case portfolio'],
    platforms: ['Blueprint', 'Garage'],
  },
  {
    name: 'AI Engineering',
    description: 'Custom AI systems, agent platforms, integrations, and production-grade applications.',
    outcome: 'Production-grade AI systems engineered for enterprise reliability.',
    problem: 'Prototypes that never survive contact with enterprise infrastructure.',
    deliverables: ['Custom AI applications', 'Platform integrations', 'Production pipelines'],
    platforms: ['Foundry', 'Factory'],
  },
  {
    name: 'Agentic AI',
    description: 'Autonomous and assisted agents that plan, reason, execute, and collaborate across workflows.',
    outcome: 'Agent systems that take real work off human teams — with oversight.',
    problem: 'Manual workflows that scale linearly with headcount.',
    deliverables: ['Agent mesh architecture', 'Multi-agent workflows', 'Human-in-the-loop controls'],
    platforms: ['Foundry', 'Marketplace'],
  },
  {
    name: 'AI Governance',
    description: 'Responsible AI, risk controls, compliance, model oversight, and approval workflows.',
    outcome: 'Compliance and audit readiness built into every AI workload.',
    problem: 'AI adoption blocked by risk, regulation, and lack of oversight.',
    deliverables: ['Governance frameworks', 'Model oversight', 'Approval workflows'],
    platforms: ['Control Center'],
  },
  {
    name: 'AI Labs',
    description: 'Innovation environments for prototyping, experimentation, and capability building.',
    outcome: 'A permanent innovation engine inside your organization.',
    problem: 'No safe environment to experiment, learn, and build AI capability.',
    deliverables: ['Lab environments', 'Experimentation frameworks', 'Capability programs'],
    platforms: ['Garage', 'AI Academy'],
  },
  {
    name: 'AI Factory',
    description: 'Repeatable systems for building, deploying, and operating AI at scale.',
    outcome: 'AI delivery that gets faster and cheaper with every deployment.',
    problem: 'Every AI project starting from zero — no reuse, no repeatability.',
    deliverables: ['Delivery playbooks', 'Reusable components', 'Deployment automation'],
    platforms: ['Factory'],
  },
  {
    name: 'AI Marketplace',
    description: 'A catalog of agents, accelerators, templates, and reusable AI assets.',
    outcome: 'Weeks of build time replaced by proven, reusable assets.',
    problem: 'Rebuilding what already exists across teams and projects.',
    deliverables: ['Agent catalog', 'Accelerator library', 'Template collections'],
    platforms: ['Marketplace'],
  },
  {
    name: 'AI Operations',
    description: 'Managed operations for monitoring, governance, performance, and continuous evolution.',
    outcome: 'Governed AI operations without building an internal ops function.',
    problem: 'AI in production with no one accountable for how it behaves.',
    deliverables: ['Managed monitoring', 'Performance management', 'Continuous evolution'],
    platforms: ['Control Center', 'Factory'],
  },
]

export const experiences = [
  {
    name: 'Talk to Agent',
    description: 'Have a conversation with a GFF AI enterprise agent about your transformation goals.',
    cta: 'Start Conversation',
    href: '#talk-to-agent',
    accent: 'blue' as const,
  },
  {
    name: 'Blueprint Generator',
    description: 'Generate a tailored AI transformation blueprint for your organization.',
    cta: 'Generate Blueprint',
    href: '#blueprint',
    accent: 'purple' as const,
  },
  {
    name: 'AI Readiness',
    description: 'Assess where your enterprise stands on the path to AI-native operations.',
    cta: 'Assess Readiness',
    href: '/contact',
    accent: 'red' as const,
  },
  {
    name: 'ROI Calculator',
    description: 'Model the value of moving workflows from manual execution to agentic AI.',
    cta: 'Model Value',
    href: '/contact',
    accent: 'blue' as const,
  },
  {
    name: 'Marketplace',
    description: 'Browse agents, accelerators, and reusable AI assets built for the enterprise.',
    cta: 'Explore Marketplace',
    href: '/platforms',
    accent: 'purple' as const,
  },
  {
    name: 'Foundry Studio',
    description: 'See how multi-agent systems are architected, tested, and hardened.',
    cta: 'Enter Studio',
    href: '/platforms',
    accent: 'red' as const,
  },
]

export const locations = {
  active: [
    {
      city: 'Singapore',
      role: 'Global hub',
      lead: 'Ashish Chandra',
    },
    {
      city: 'India',
      role: 'Engineering and delivery',
      lead: 'Malvika Singh — Chief Operating Officer',
    },
    {
      city: 'Australia',
      role: 'Risk and governance',
      lead: 'Meenakshi Arekar — Chief Risk Officer',
    },
  ],
  future: [
    { city: 'London', role: 'Enterprise advisory' },
    { city: 'USA', role: 'Expansion' },
    { city: 'Middle East', role: 'Expansion' },
  ],
}

export const outcomes = [
  'Faster AI opportunity discovery',
  'Production-ready agent systems',
  'Governed AI operations',
  'Better knowledge reuse',
  'Reduced manual workflows',
  'AI program visibility',
  'Compliance and audit readiness',
  'Scalable operating model',
]

export const dashboardMetrics = [
  { label: 'Active Clients', value: 8, suffix: '+' },
  { label: 'Agents Running', value: 60, suffix: '+' },
  { label: 'AI Projects', value: 20, suffix: '+' },
  { label: 'Countries', value: 2, suffix: '' },
  { label: 'Industries', value: 5, suffix: '' },
  { label: 'Blueprint Requests', value: 107, suffix: '+' },
  { label: 'Governance Checks', value: 1400, suffix: '+' },
  { label: 'Platform Deployments', value: 15, suffix: '+' },
]

export const searchSuggestions = [
  'Build AI for Banking',
  'Create University AI Lab',
  'Insurance AI',
  'Mining AI',
  'Retail AI',
  'Build AI GCC',
]
