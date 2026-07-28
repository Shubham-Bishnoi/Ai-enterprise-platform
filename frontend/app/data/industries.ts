export type Industry = {
  name: string
  group: 'Financial' | 'Health' | 'Industrial' | 'Consumer' | 'Public' | 'Professional'
  challenge: string
  solution: string
  agents: string[]
  outcomes: string[]
}

export const industries: Industry[] = [
  {
    name: 'Financial Services',
    group: 'Financial',
    challenge: 'Legacy processes, regulatory pressure, and rising expectations for intelligent client experiences.',
    solution: 'Agentic advisory workflows, governed document intelligence, and risk-aware automation.',
    agents: ['Client onboarding agent', 'Regulatory research agent', 'Credit analysis copilot'],
    outcomes: ['Faster onboarding cycles', 'Governed automation', 'Audit-ready workflows'],
  },
  {
    name: 'Insurance',
    group: 'Financial',
    challenge: 'Manual claims, underwriting bottlenecks, and fragmented policy knowledge.',
    solution: 'Claims triage agents, underwriting copilots, and a policy knowledge graph.',
    agents: ['Claims triage agent', 'Underwriting copilot', 'Policy knowledge agent'],
    outcomes: ['Reduced claims cycle time', 'Consistent underwriting', 'Knowledge reuse'],
  },
  {
    name: 'Healthcare',
    group: 'Health',
    challenge: 'Administrative burden, fragmented records, and clinician workload.',
    solution: 'Clinical documentation agents, scheduling intelligence, and governed patient workflows.',
    agents: ['Documentation agent', 'Care coordination agent', 'Admin workflow agent'],
    outcomes: ['Reduced admin workload', 'Better care coordination', 'Compliance readiness'],
  },
  {
    name: 'CSR',
    group: 'Professional',
    challenge:
      'Corporate social responsibility programs — community initiatives, giving, volunteering, and responsible sourcing — sit in scattered spreadsheets, making impact hard to measure, coordinate, and report credibly.',
    solution:
      'Agentic tracking of CSR initiatives with governed impact measurement and stakeholder reporting, backed by a knowledge graph that links programs to real-world outcomes and beneficiaries.',
    agents: ['Impact measurement agent', 'Program coordination agent', 'Stakeholder reporting agent'],
    outcomes: ['Measurable social impact', 'Coordinated programs', 'Credible, evidence-backed reporting'],
  },
  {
    name: 'ESG',
    group: 'Professional',
    challenge:
      'Environmental, social, and governance data is fragmented across systems while disclosure rules (CSRD, GRI, SASB, TCFD) move fast — leaving reporting manual, slow, and short on audit trails.',
    solution:
      'ESG data-aggregation agents, framework-aligned disclosure drafting, and supply-chain risk monitoring — governed end to end so every metric and claim is traceable and assurance-ready.',
    agents: ['ESG data aggregation agent', 'Disclosure drafting agent', 'Supply-chain risk agent'],
    outcomes: ['Audit-ready disclosures', 'Framework alignment', 'Continuous ESG visibility'],
  },
  {
    name: 'Manufacturing',
    group: 'Industrial',
    challenge: 'Operational data silos, quality escapes, and reactive maintenance.',
    solution: 'Shop-floor intelligence agents, quality inspection AI, and predictive operations.',
    agents: ['Quality inspection agent', 'Maintenance planning agent', 'Supply chain agent'],
    outcomes: ['Fewer quality escapes', 'Predictive maintenance', 'Operational visibility'],
  },
  {
    name: 'Retail',
    group: 'Consumer',
    challenge: 'Fragmented customer data, manual merchandising, and margin pressure.',
    solution: 'RetailMesh agents for merchandising, demand intelligence, and customer experience.',
    agents: ['Merchandising agent', 'Demand forecasting agent', 'CX intelligence agent'],
    outcomes: ['Sharper assortment decisions', 'Demand visibility', 'Improved margins'],
  },
  {
    name: 'Education',
    group: 'Public',
    challenge: 'Institutions need AI capability, labs, and modernized learning operations.',
    solution: 'University AI labs, OneVerse learning platforms, and academy programs.',
    agents: ['Learning support agent', 'Curriculum design agent', 'Research assistant agent'],
    outcomes: ['Institutional AI capability', 'Modern learning platforms', 'Research acceleration'],
  },
  {
    name: 'Government',
    group: 'Public',
    challenge: 'Citizen service backlogs, policy complexity, and strict governance requirements.',
    solution: 'Citizen service agents, policy intelligence, and fully governed AI operations.',
    agents: ['Citizen service agent', 'Policy research agent', 'Case management agent'],
    outcomes: ['Faster citizen services', 'Policy visibility', 'Governance by design'],
  },
  {
    name: 'Mining',
    group: 'Industrial',
    challenge: 'Remote operations, safety-critical decisions, and equipment reliability.',
    solution: 'OREMesh agents for operations intelligence, safety monitoring, and asset reliability.',
    agents: ['Operations intelligence agent', 'Safety monitoring agent', 'Asset reliability agent'],
    outcomes: ['Operational awareness', 'Safety-first automation', 'Asset uptime'],
  },
  {
    name: 'Energy',
    group: 'Industrial',
    challenge: 'Grid complexity, asset management at scale, and energy transition demands.',
    solution: 'Asset intelligence agents, grid analytics, and transition planning support.',
    agents: ['Asset intelligence agent', 'Grid analytics agent', 'Transition planning agent'],
    outcomes: ['Asset visibility', 'Grid intelligence', 'Transition readiness'],
  },
  {
    name: 'Telecom',
    group: 'Consumer',
    challenge: 'Network complexity, service assurance, and customer experience at scale.',
    solution: 'TelecomVerse agents for network operations, assurance, and customer intelligence.',
    agents: ['Network operations agent', 'Service assurance agent', 'Customer intelligence agent'],
    outcomes: ['Network reliability', 'Faster incident resolution', 'CX intelligence'],
  },
  {
    name: 'Audit',
    group: 'Professional',
    challenge: 'Manual evidence gathering, sampling limitations, and documentation load.',
    solution: 'Evidence extraction agents, full-population analysis, and workpaper automation.',
    agents: ['Evidence extraction agent', 'Analytics agent', 'Workpaper drafting agent'],
    outcomes: ['Full-population coverage', 'Faster fieldwork', 'Consistent documentation'],
  },
  {
    name: 'Tax',
    group: 'Professional',
    challenge: 'Regulatory change velocity, multi-jurisdiction complexity, and manual compliance.',
    solution: 'Regulation monitoring agents, compliance drafting, and jurisdiction intelligence.',
    agents: ['Regulation monitoring agent', 'Compliance drafting agent', 'Research agent'],
    outcomes: ['Regulatory awareness', 'Compliance efficiency', 'Research acceleration'],
  },
  {
    name: 'Legal',
    group: 'Professional',
    challenge: 'Document review at scale, precedent research, and matter management.',
    solution: 'Contract intelligence agents, precedent research, and governed drafting support.',
    agents: ['Contract review agent', 'Precedent research agent', 'Drafting assistant agent'],
    outcomes: ['Faster document review', 'Research depth', 'Drafting consistency'],
  },
]

export const industryGroups = ['All', 'Financial', 'Health', 'Industrial', 'Consumer', 'Public', 'Professional'] as const
