/**
 * Shared resource library. Resources no longer live on a standalone
 * /resources page — each item is assigned a destination page family and is
 * rendered there by the shared ResourceCardsSection component:
 *
 *   capabilities   → /capabilities#research-intelligence  (articles, whitepapers, research)
 *   industries     → /industries#case-studies             (case studies, industry sessions)
 *   platforms      → /platforms#technical-library         (architecture library, developer docs)
 *   build-with-gff → /build-with-gff#events               (events, webinars, delivery videos)
 *
 * /resources itself is a permanent redirect (see next.config.mjs).
 */

export type ResourceDestination = 'capabilities' | 'industries' | 'platforms' | 'build-with-gff'

export type Resource = {
  title: string
  type: string
  summary: string
  date: string
  destination: ResourceDestination
  featured?: boolean
}

export const resourceAnchors: Record<ResourceDestination, string> = {
  capabilities: '/capabilities#research-intelligence',
  industries: '/industries#case-studies',
  platforms: '/platforms#technical-library',
  'build-with-gff': '/build-with-gff#events',
}

export const resources: Resource[] = [
  {
    title: 'The AI Operating Model: From Pilots to Production',
    type: 'Whitepapers',
    summary:
      'Why most enterprise AI stalls at the pilot stage — and the operating model changes that move it into governed production.',
    date: 'June 2026',
    destination: 'capabilities',
    featured: true,
  },
  {
    title: 'Designing Multi-Agent Systems for the Enterprise',
    type: 'Articles',
    summary: 'Architecture patterns for agent meshes that plan, reason, and execute with human-in-the-loop governance.',
    date: 'June 2026',
    destination: 'capabilities',
  },
  {
    title: 'Knowledge Graphs as the Foundation of Agentic AI',
    type: 'Articles',
    summary: 'How a knowledge graph foundation turns scattered enterprise data into reasoning-ready context.',
    date: 'May 2026',
    destination: 'capabilities',
  },
  {
    title: 'AI Governance Reference Architecture',
    type: 'Architecture Library',
    summary: 'A reference architecture for model oversight, approval workflows, and audit-ready AI operations.',
    date: 'May 2026',
    destination: 'platforms',
  },
  {
    title: 'Garage → Foundry → Factory: A Delivery Model Explained',
    type: 'Videos',
    summary: 'A walkthrough of the GFF delivery model — from discovery to engineered systems to scaled operations.',
    date: 'April 2026',
    destination: 'build-with-gff',
  },
  {
    title: 'Building a University AI Lab',
    type: 'Case Studies',
    summary: 'How an education institution stood up an AI lab, capability programs, and a learning platform.',
    date: 'April 2026',
    destination: 'industries',
  },
  {
    title: 'Agentic AI in Insurance Operations',
    type: 'Webinars',
    summary: 'Claims triage, underwriting copilots, and the governance layer that makes them deployable.',
    date: 'March 2026',
    destination: 'industries',
  },
  {
    title: 'GFF Platform Developer Overview',
    type: 'Developer Docs',
    summary: 'An introduction to building on GFF platforms — APIs, agent templates, and integration patterns.',
    date: 'March 2026',
    destination: 'platforms',
  },
  {
    title: 'Enterprise AI Summit — Singapore',
    type: 'Events',
    summary: 'Join GFF AI and enterprise leaders to discuss the operating systems behind AI-native companies.',
    date: 'Upcoming',
    destination: 'build-with-gff',
  },
]

export const resourcesFor = (destination: ResourceDestination): Resource[] =>
  resources.filter((r) => r.destination === destination)
