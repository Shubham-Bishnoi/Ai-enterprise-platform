/**
 * Enterprise Intelligence Engineering — GFF AI's central methodology.
 *
 * Single source of truth for the lifecycle, principles, seven steps and the
 * delivery-model mapping. Shared by the compact homepage section and the
 * canonical /how-gff-ai-works page so the story never drifts.
 *
 * Copy uses UK/Singapore English (organisations, prioritise, optimise).
 */

export const LIFECYCLE = [
  { name: 'Discover', description: 'Understand objectives, decisions, problems and opportunities.' },
  { name: 'Design', description: 'Create the intelligence blueprint, architecture and governance model.' },
  { name: 'Engineer', description: 'Build enterprise memory, specialist agents and reasoning systems.' },
  { name: 'Integrate', description: 'Connect intelligence to applications, data and workflows.' },
  { name: 'Operate', description: 'Monitor security, quality, adoption, governance and outcomes.' },
  { name: 'Scale', description: 'Expand across departments, regions and use cases.' },
] as const

export const PRINCIPLES = [
  'Understand the enterprise',
  'Create enterprise memory',
  'Engineer digital teams',
  'Connect intelligence',
  'Integrate operations',
  'Build trust',
  'Continuously improve',
] as const

export type EngineeringStep = {
  number: number
  title: string
  description: string
  takeaway: string
  /** Supplied methodology artwork — one dedicated illustration per step. */
  image: string
  imageAlt: string
  /** object-position crop for the wide card frame (sources are 4:3). */
  imagePosition: string
}

const IMG = '/images/how-we-work'

export const SEVEN_STEPS: EngineeringStep[] = [
  {
    number: 1,
    image: `${IMG}/01-understand-enterprise.webp`,
    imageAlt: 'Enterprise decision pathways being translated into an intelligence blueprint',
    imagePosition: '50% 48%',
    title: 'Understand How the Enterprise Thinks',
    description:
      'Study strategic objectives, knowledge sources, decision pathways, operational bottlenecks and regulatory obligations. Convert the findings into an Enterprise Intelligence Blueprint.',
    takeaway: 'Understand the organisation before building anything.',
  },
  {
    number: 2,
    image: `${IMG}/02-enterprise-memory.webp`,
    imageAlt: 'Enterprise knowledge sources connected to an organised memory layer',
    imagePosition: '50% 45%',
    title: 'Create an Enterprise Memory Layer',
    description:
      'Connect knowledge from documents, databases, policies, applications, employees and historical decisions. Organise relationships between people, assets, customers, rules and operational events.',
    takeaway: 'Give AI organised access to enterprise knowledge and context.',
  },
  {
    number: 3,
    image: `${IMG}/03-digital-teams.webp`,
    imageAlt: 'Specialist AI agents organised as a digital business team',
    imagePosition: '50% 50%',
    title: 'Engineer Digital Teams',
    description:
      'Build specialist agents for functions such as finance, procurement, legal, manufacturing, customer service, ESG and risk. Give each agent an approved role, knowledge boundary, tools and permissions.',
    takeaway: 'Build AI specialists with defined business responsibilities.',
  },
  {
    number: 4,
    image: `${IMG}/04-connected-intelligence.webp`,
    imageAlt: 'Business functions coordinating intelligence through a human approval point',
    imagePosition: '50% 48%',
    title: 'Connect Intelligence Across the Organisation',
    description:
      'Allow specialist agents to share context, review outputs and coordinate work across functions while preserving human accountability.',
    takeaway: 'Make AI specialists work together like a coordinated business team.',
  },
  {
    number: 5,
    image: `${IMG}/05-integrated-operations.webp`,
    imageAlt: 'Enterprise intelligence connected to existing operational systems',
    imagePosition: '50% 45%',
    title: 'Integrate Intelligence into Existing Operations',
    description:
      'Connect intelligence to the applications and processes employees already use, including enterprise data platforms, ERP, CRM, service management and custom operational systems.',
    takeaway: 'Bring AI into existing systems and workflows.',
  },
  {
    number: 6,
    image: `${IMG}/06-trust-before-scale.webp`,
    imageAlt: 'Governance layers protecting access approvals and audit records',
    imagePosition: '50% 52%',
    title: 'Build Trust Before Scale',
    description:
      'Engineer human approvals, access controls, security, explainability, policy enforcement, audit logs and regulatory requirements from the beginning.',
    takeaway: 'Make AI controlled, accountable and auditable before expanding it.',
  },
  {
    number: 7,
    image: `${IMG}/07-continuous-improvement.webp`,
    imageAlt: 'A continuous measurement and improvement loop around enterprise intelligence',
    imagePosition: '50% 48%',
    title: 'Continuously Improve Enterprise Intelligence',
    description:
      'Measure business outcomes, accuracy, adoption, cost, speed, security, governance and model quality. Improve the system as the enterprise and its operating environment change.',
    takeaway: 'Treat deployment as the beginning of continuous improvement.',
  },
]

export const DELIVERY_MAPPING = [
  { lifecycle: 'Discover and Design', delivery: 'Garage' },
  { lifecycle: 'Engineer and Integrate', delivery: 'Foundry' },
  { lifecycle: 'Production deployment', delivery: 'Factory' },
  { lifecycle: 'Operate and continuously improve', delivery: 'Operate and Optimize' },
  { lifecycle: 'Organisational expansion', delivery: 'Scale' },
] as const

export const COMPARISON = {
  traditional: {
    heading: 'Traditional AI project',
    points: [
      'Begins with a model or tool',
      'Automates an isolated task',
      'Uses fragmented knowledge',
      'Adds integration later',
      'Introduces governance near deployment',
      'Treats deployment as completion',
    ],
  },
  eie: {
    heading: 'Enterprise Intelligence Engineering',
    points: [
      'Begins with enterprise outcomes and decisions',
      'Connects knowledge and context',
      'Engineers specialist governed agents',
      'Integrates with existing operations',
      'Builds trust from the beginning',
      'Continuously measures and improves',
    ],
  },
} as const
