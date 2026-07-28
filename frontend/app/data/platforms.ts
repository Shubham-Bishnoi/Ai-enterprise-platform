export type Platform = {
  name: string
  tagline: string
  description: string
  accent: 'red' | 'purple' | 'blue'
  category: 'Core' | 'Vertical' | 'Enablement'
}

export const platforms: Platform[] = [
  {
    name: 'Garage',
    tagline: 'Discover',
    description: 'The discovery environment where high-value AI opportunities are identified and rapidly prototyped.',
    accent: 'red',
    category: 'Core',
  },
  {
    name: 'Foundry',
    tagline: 'Engineer',
    description: 'The engineering platform for architecting resilient multi-agent systems and AI foundations.',
    accent: 'purple',
    category: 'Core',
  },
  {
    name: 'Factory',
    tagline: 'Operate at scale',
    description: 'The production system for deploying and operating AI workloads across the enterprise.',
    accent: 'blue',
    category: 'Core',
  },
  {
    name: 'Blueprint',
    tagline: 'Plan',
    description: 'The AI transformation planning engine — generating tailored roadmaps and operating models.',
    accent: 'blue',
    category: 'Core',
  },
  {
    name: 'Marketplace',
    tagline: 'Reuse',
    description: 'A catalog of agents, accelerators, templates, and reusable enterprise AI assets.',
    accent: 'purple',
    category: 'Core',
  },
  {
    name: 'Control Center',
    tagline: 'Govern',
    description: 'The governance cockpit for monitoring agent behavior, model performance, and compliance.',
    accent: 'red',
    category: 'Core',
  },
  {
    name: 'AI Academy',
    tagline: 'Learn',
    description: 'Structured AI capability programs for enterprise teams, leaders, and practitioners.',
    accent: 'blue',
    category: 'Enablement',
  },
  {
    name: 'University OneVerse',
    tagline: 'Educate',
    description: 'A platform for universities to build AI labs, learning environments, and research capability.',
    accent: 'purple',
    category: 'Enablement',
  },
  {
    name: 'Assessment Mesh',
    tagline: 'Evaluate',
    description: 'AI-driven assessment infrastructure for skills, readiness, and organizational capability.',
    accent: 'red',
    category: 'Enablement',
  },
  {
    name: 'OREMesh',
    tagline: 'Mining intelligence',
    description: 'Operations intelligence for mining — safety monitoring, asset reliability, and site awareness.',
    accent: 'blue',
    category: 'Vertical',
  },
  {
    name: 'RetailMesh',
    tagline: 'Retail intelligence',
    description: 'Retail agents for merchandising, demand forecasting, and customer experience intelligence.',
    accent: 'purple',
    category: 'Vertical',
  },
  {
    name: 'TelecomVerse',
    tagline: 'Telecom intelligence',
    description: 'Network operations, service assurance, and customer intelligence for telecom operators.',
    accent: 'red',
    category: 'Vertical',
  },
]
