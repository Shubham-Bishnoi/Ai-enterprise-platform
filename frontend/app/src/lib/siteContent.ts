import type { ReactNode } from 'react';

export const siteContainerClass =
  'mx-auto w-full max-w-[1740px] px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20';

export type NavItem = {
  label: string;
  to: string;
  end?: boolean;
  mobileOnly?: boolean;
};

export const primaryNavItems: NavItem[] = [
  { label: 'Home', to: '/', end: true, mobileOnly: true },
  { label: 'Why GFF AI', to: '/why-gff-ai' },
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Industries', to: '/industries' },
  { label: 'Platforms', to: '/platforms' },
  { label: 'Build With GFF', to: '/build' },
  { label: 'Resources', to: '/resources' },
  { label: 'Company', to: '/company' },
  { label: 'Contact', to: '/contact' },
];

export type FooterLink = {
  label: string;
  to: string;
};

export const footerColumns: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: 'Solutions',
    links: [
      { label: 'AI Strategy', to: '/capabilities#ai-strategy' },
      { label: 'Agentic AI', to: '/capabilities#agentic-ai' },
      { label: 'AI Engineering', to: '/capabilities#ai-engineering' },
      { label: 'Governance', to: '/capabilities#ai-governance' },
      { label: 'Data Platforms', to: '/platforms#control-center' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Banking', to: '/industries#financial-services' },
      { label: 'Insurance', to: '/industries#insurance' },
      { label: 'Healthcare', to: '/industries#healthcare' },
      { label: 'Education', to: '/industries#education' },
      { label: 'Energy', to: '/industries#energy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Mission', to: '/why-gff-ai#mission' },
      { label: 'Leadership', to: '/company#leadership' },
      { label: 'Careers', to: '/company#careers' },
      { label: 'Partners', to: '/company#partners' },
      { label: 'Investors', to: '/company#investors' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/portal#governance' },
      { label: 'NDA', to: '/contact' },
      { label: 'Terms', to: '/portal#documents' },
      { label: 'Investor Relations', to: '/company#investors' },
      { label: 'Client Portal', to: '/portal' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Book Workshop', to: '/contact#book-workshop' },
      { label: 'Book Consultation', to: '/contact#book-consultation' },
      { label: 'Sales', to: '/contact#sales' },
      { label: 'Support', to: '/contact#support' },
      { label: 'Partnership', to: '/contact#partnership' },
    ],
  },
];

export type PageCardData = {
  title: string;
  description: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaTo?: string;
};

export type ContentPageData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  cards: PageCardData[];
  actions?: Array<{
    label: string;
    to: string;
    variant?: 'primary' | 'secondary';
  }>;
  bottomNote?: ReactNode;
};

export const whyGffAiPage: ContentPageData = {
  eyebrow: 'Why GFF AI',
  title: 'Why GFF AI',
  subtitle:
    'A Garage-Foundry-Factory model for building, deploying, and operating AI-native enterprises.',
  intro:
    'GFF AI combines strategy, engineering, delivery, governance, and operating rigor into one enterprise transformation system designed for the agentic era.',
  actions: [
    { label: 'Book a Consultation', to: '/contact', variant: 'primary' },
    { label: 'Explore Platforms', to: '/platforms', variant: 'secondary' },
  ],
  cards: [
    {
      title: 'Mission',
      description: 'Build intelligent enterprises that can design, deploy, and govern AI at scale.',
      bullets: ['Enterprise transformation', 'Agentic operating systems', 'Responsible deployment'],
    },
    {
      title: 'Vision',
      description: 'Create the reference model for AI-native enterprises across industries and markets.',
      bullets: ['Global scale delivery', 'Composable platforms', 'Measurable business outcomes'],
    },
    {
      title: 'Garage Foundry Factory',
      description: 'Move from idea incubation to industrialized delivery using a staged innovation model.',
      bullets: ['Garage for experimentation', 'Foundry for productization', 'Factory for scaled operations'],
    },
    {
      title: 'Operating Model',
      description: 'Blend advisory, engineering, governance, and managed operations into one operating cadence.',
      bullets: ['Executive steering', 'Cross-functional squads', 'Continuous value realization'],
    },
    {
      title: 'Leadership',
      description: 'Bring together strategy, architecture, data, AI operations, and domain leadership teams.',
      bullets: ['Advisory depth', 'Execution ownership', 'Global delivery alignment'],
    },
    {
      title: 'Global Model',
      description: 'Deliver programs through a distributed model that balances proximity, speed, and specialist talent.',
      bullets: ['Regional engagement', 'Follow-the-sun support', 'Reusable delivery assets'],
    },
    {
      title: 'Technology Philosophy',
      description: 'Design modular AI ecosystems that integrate agents, knowledge, data, and human oversight.',
      bullets: ['Platform-first architecture', 'Interoperable systems', 'Security by design'],
    },
    {
      title: 'Differentiator',
      description: 'Unify blueprinting, platforms, delivery, talent, and AI operations instead of treating them as separate programs.',
      bullets: ['Single transformation spine', 'Reusable accelerators', 'Outcome-led governance'],
    },
  ],
};

export const capabilitiesPage: ContentPageData = {
  eyebrow: 'Capabilities',
  title: 'AI Capabilities',
  subtitle:
    'Strategy, engineering, governance, operations, and agentic AI systems for enterprise transformation.',
  intro:
    'The capability stack spans advisory through industrialized delivery so enterprises can move from exploration to managed AI operations with one partner.',
  actions: [
    { label: 'Talk to GFF AI', to: '/#talk-to-agent', variant: 'primary' },
    { label: 'Generate a Blueprint', to: '/#blueprint-generator', variant: 'secondary' },
  ],
  cards: [
    {
      title: 'AI Strategy',
      description: 'Define the transformation thesis, portfolio roadmap, and investment sequencing.',
      bullets: ['Executive alignment', 'Use-case prioritization', 'Value case design'],
    },
    {
      title: 'AI Engineering',
      description: 'Build enterprise-grade data, model, integration, and application systems.',
      bullets: ['Reference architectures', 'Integration patterns', 'Production delivery'],
    },
    {
      title: 'Agentic AI',
      description: 'Design and orchestrate agents that work across workflows, knowledge, and enterprise systems.',
      bullets: ['Agent design', 'Human-in-loop controls', 'Task orchestration'],
    },
    {
      title: 'AI Governance',
      description: 'Establish trust, risk, compliance, and control frameworks for scaled deployment.',
      bullets: ['Policy controls', 'Responsible AI', 'Operational guardrails'],
    },
    {
      title: 'AI Operations',
      description: 'Run AI systems with monitoring, observability, cost control, and continuous improvement.',
      bullets: ['Model operations', 'Prompt and agent monitoring', 'Service management'],
    },
    {
      title: 'AI Labs',
      description: 'Accelerate experimentation, prototyping, and applied innovation programs.',
      bullets: ['Rapid pilots', 'Concept validation', 'Innovation transfer'],
    },
    {
      title: 'Knowledge Graph',
      description: 'Connect enterprise knowledge, systems, and context for more reliable AI outcomes.',
      bullets: ['Semantic layers', 'Knowledge assets', 'Reasoning context'],
    },
    {
      title: 'Managed Services',
      description: 'Provide the operating capacity to sustain enterprise AI after initial deployment.',
      bullets: ['Run and support', 'Platform reliability', 'Continuous optimization'],
    },
  ],
};

export const industriesPage: ContentPageData = {
  eyebrow: 'Industries',
  title: 'Industries',
  subtitle:
    'Industry-specific AI transformation systems, agents, architectures, and operating models.',
  intro:
    'Each industry playbook combines domain challenges, target architectures, reference solutions, AI agents, business outcomes, and demo pathways.',
  actions: [
    { label: 'See Capabilities', to: '/capabilities', variant: 'primary' },
    { label: 'Book an Industry Workshop', to: '/contact#book-workshop', variant: 'secondary' },
  ],
  cards: [
    { title: 'Financial Services', description: 'Modernize decisioning, servicing, risk, and operating resilience.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Insurance', description: 'Accelerate underwriting, claims, fraud analytics, and service operations.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Healthcare', description: 'Enable care coordination, operations, documentation, and intelligent support.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Life Sciences', description: 'Support research workflows, compliance operations, and commercial insight systems.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Manufacturing', description: 'Improve planning, quality, maintenance, and connected factory operations.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Retail', description: 'Transform merchandising, demand planning, service, and store intelligence.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Education', description: 'Reimagine student support, academic operations, and digital learning systems.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Government', description: 'Drive secure service delivery, analytics, and mission operations with guardrails.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Mining', description: 'Connect field operations, asset intelligence, safety, and planning systems.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Energy', description: 'Advance network operations, maintenance, workforce enablement, and risk controls.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Telecom', description: 'Improve network assurance, customer operations, and service delivery automation.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Audit', description: 'Speed audit planning, evidence workflows, and control review processes.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Tax', description: 'Strengthen research, workflow automation, and client delivery productivity.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
    { title: 'Legal', description: 'Support matter intelligence, contract workflows, and knowledge-heavy operations.', bullets: ['Challenges', 'Architecture', 'Reference Solution', 'AI Agents', 'Business Outcomes', 'Demo'] },
  ],
};

export const platformsPage: ContentPageData = {
  eyebrow: 'Platforms',
  title: 'GFF AI Platforms',
  subtitle:
    'Garage, Foundry, Factory, Blueprint, Marketplace, Control Center, and specialized AI platform ecosystems.',
  intro:
    'The platform portfolio provides reusable environments for innovation, productization, operations, training, and industry acceleration.',
  actions: [
    { label: 'Build With GFF', to: '/build', variant: 'primary' },
    { label: 'Contact Platform Team', to: '/contact', variant: 'secondary' },
  ],
  cards: [
    { title: 'Garage', description: 'Launch experiments, ideation sprints, and rapid concept validation.' },
    { title: 'Foundry', description: 'Industrialize selected opportunities into production-grade solutions.' },
    { title: 'Factory', description: 'Operate scaled AI portfolios with managed delivery and continuous optimization.' },
    { title: 'Blueprint', description: 'Generate architecture, operating model, and roadmap recommendations.' },
    { title: 'Marketplace', description: 'Discover reusable agents, accelerators, assets, and packaged offerings.' },
    { title: 'Control Center', description: 'Monitor AI systems, governance status, analytics, and operational health.' },
    { title: 'AI Academy', description: 'Enable workforce transformation with structured AI learning pathways.' },
    { title: 'University OneVerse', description: 'Support university-focused AI ecosystems, learning, and collaboration models.' },
    { title: 'Assessment Mesh', description: 'Assess readiness, maturity, controls, and enterprise transformation conditions.' },
    { title: 'OREMesh', description: 'Provide an industry platform model for resource and operations intelligence.' },
    { title: 'RetailMesh', description: 'Support retail-specific data, agents, and operating experiences.' },
    { title: 'TelecomVerse', description: 'Deliver telecom-oriented architectures, agents, and operations accelerators.' },
  ],
};

export const buildPage: ContentPageData = {
  eyebrow: 'Build With GFF',
  title: 'Build With GFF',
  subtitle:
    'Start with an agent conversation, generate a blueprint, assess readiness, calculate ROI, or build inside the foundry.',
  intro:
    'Phase 1 creates the navigation and entry points so buyers can start the right journey without duplicating the full homepage specialist and blueprint experiences.',
  actions: [
    { label: 'Talk to GFF AI', to: '/#talk-to-agent', variant: 'primary' },
    { label: 'Generate Blueprint', to: '/#blueprint-generator', variant: 'secondary' },
  ],
  cards: [
    {
      title: 'Talk to Agent',
      description: 'Start a guided conversation with a GFF AI specialist from the homepage experience.',
      bullets: ['Use the approved inline specialist experience', 'No duplicate drawer or duplicate section'],
      ctaLabel: 'Go to Specialist',
      ctaTo: '/#talk-to-agent',
    },
    {
      title: 'Blueprint Generator',
      description: 'Jump into the existing enterprise blueprint workflow already approved on the homepage.',
      bullets: ['Keeps the current logic intact', 'Routes back to the homepage anchor'],
      ctaLabel: 'Open Blueprint',
      ctaTo: '/#blueprint-generator',
    },
    { title: 'AI Readiness Assessment', description: 'Preview readiness scoring and maturity diagnostics for enterprise AI adoption.' },
    { title: 'ROI Calculator', description: 'Estimate business value, efficiency impact, and operating model uplift.' },
    { title: 'Marketplace', description: 'Browse reusable assets, agents, and packaged transformation accelerators.' },
    { title: 'Foundry Studio', description: 'Explore the productization environment for turning ideas into governed solutions.' },
    { title: 'Sandbox', description: 'Trial controlled AI concepts, workflows, and enterprise agent experiences.' },
    { title: 'Proposal Generator', description: 'Create a structured transformation proposal aligned to your operating priorities.' },
  ],
};

export const resourcesPage: ContentPageData = {
  eyebrow: 'Resources',
  title: 'Resources',
  subtitle:
    'Research, architecture libraries, case studies, videos, webinars, and developer resources for enterprise AI.',
  intro:
    'The resource library brings thought leadership and implementation assets together for executive, architecture, and delivery audiences.',
  actions: [
    { label: 'Contact GFF AI', to: '/contact', variant: 'primary' },
    { label: 'Explore Platforms', to: '/platforms', variant: 'secondary' },
  ],
  cards: [
    { title: 'Blog', description: 'Perspectives on AI-native operating models, delivery patterns, and leadership topics.' },
    { title: 'Research', description: 'Original analysis on enterprise AI architectures, maturity, and market direction.' },
    { title: 'Whitepapers', description: 'Detailed guidance for executives, architects, and transformation teams.' },
    { title: 'Case Studies', description: 'Examples of business outcomes, implementation patterns, and measurable impact.' },
    { title: 'Architecture Library', description: 'Reference architectures, patterns, and reusable design approaches.' },
    { title: 'Videos', description: 'Visual walkthroughs, explainers, and platform demonstrations.' },
    { title: 'Webinars', description: 'Interactive sessions on strategy, engineering, and governance practices.' },
    { title: 'Events', description: 'Summits, workshops, roundtables, and live experiences.' },
    { title: 'Developer Docs', description: 'Technical enablement resources for teams building with the GFF ecosystem.' },
    { title: 'Downloads', description: 'Templates, guides, overviews, and packaged assets ready for evaluation.' },
  ],
};

export const companyPage: ContentPageData = {
  eyebrow: 'Company',
  title: 'Company',
  subtitle:
    'GFF AI brings together strategy, engineering, AI operations, talent, and global delivery.',
  intro:
    'The company model is designed to combine executive transformation leadership with the systems and delivery capacity needed to run enterprise AI in production.',
  actions: [
    { label: 'Join the Conversation', to: '/contact', variant: 'primary' },
    { label: 'See Why GFF AI', to: '/why-gff-ai', variant: 'secondary' },
  ],
  cards: [
    { title: 'Leadership', description: 'Transformation, engineering, and operating leaders aligned to enterprise outcomes.' },
    { title: 'Partners', description: 'Strategic ecosystem partners across platforms, delivery, and domain acceleration.' },
    { title: 'Careers', description: 'Opportunities for builders, strategists, architects, and AI operations talent.' },
    { title: 'Locations', description: 'A global delivery model with regional presence and specialist coordination.' },
    { title: 'Media', description: 'Brand, announcements, speaking, and market visibility touchpoints.' },
    { title: 'Investors', description: 'Company growth, strategic backing, and transformation market positioning.' },
    { title: 'Advisors', description: 'Industry and technology advisors that strengthen program direction.' },
    { title: 'Contact', description: 'Direct paths into sales, partnerships, workshops, and general inquiry channels.' },
  ],
};

export const portalCards: PageCardData[] = [
  { title: 'Dashboard', description: 'Executive overview of programs, milestones, status, and active workstreams.' },
  { title: 'Projects', description: 'Delivery workspaces for transformation programs, artifacts, and workflows.' },
  { title: 'Invoices', description: 'Billing snapshots, invoice records, and financial coordination touchpoints.' },
  { title: 'Support', description: 'Operational tickets, client enablement requests, and response tracking.' },
  { title: 'Documents', description: 'Controlled access to blueprints, contracts, policies, and delivery files.' },
  { title: 'AI Operations', description: 'Monitoring, governance, and run-state views for enterprise AI systems.' },
  { title: 'Analytics', description: 'Insights on outcomes, adoption, operational health, and program velocity.' },
  { title: 'Governance', description: 'Policies, approvals, risk controls, audit readiness, and oversight workflows.' },
];
