/**
 * Enterprise-visual asset registry — one place for image paths, alt text, and
 * subtle section accents.
 *
 * Kept in a plain (non-'use client') module so both server components (the
 * deeper pages) and client components (the homepage sections) can import the
 * real object. Importing a value export across a client boundary would hand a
 * server component a client-reference proxy instead, whose properties read back
 * as undefined.
 */

export type EnterpriseVisual = {
  src: string
  alt: string
  /** Subtle accent colour (rgba) for the glow behind the media surface. */
  accent: string
}

export const ENTERPRISE_VISUALS = {
  agents: {
    src: '/images/01-enterprise-ai-agents.png',
    alt: 'Enterprise AI agents connected to a central intelligence core, coordinating strategy, architecture, governance, industry, and analytics.',
    accent: 'rgba(34, 197, 235, 0.16)', // cyan
  },
  blueprint: {
    src: '/images/02-ai-blueprint-generator-coral-violet.png',
    alt: 'An AI blueprint generator assembling an enterprise roadmap from data and priorities.',
    accent: 'rgba(255, 77, 109, 0.14)', // coral / violet
  },
  journey: {
    src: '/images/03-garage-foundry-factory-orange-blue.png',
    alt: 'The Garage, Foundry, and Factory stages progressing from AI discovery to engineered systems to enterprise-scale operations.',
    accent: 'rgba(255, 138, 76, 0.14)', // orange / blue
  },
  governance: {
    src: '/images/04-responsible-ai-governance-deep-purple.png',
    alt: 'A responsible AI governance layer containing and validating an enterprise AI system.',
    accent: 'rgba(139, 92, 246, 0.16)', // deep purple
  },
  marketplace: {
    src: '/images/05-ai-solution-marketplace-multicolor.png',
    alt: 'An AI solution marketplace of reusable, productized enterprise AI assets and accelerators.',
    accent: 'rgba(21, 93, 252, 0.12)', // multicolour — kept neutral blue
  },
  industries: {
    src: '/images/06-industry-ai-solutions-teal.png',
    alt: 'Industry-specific AI solutions tailored across enterprise sectors.',
    accent: 'rgba(20, 184, 166, 0.16)', // teal
  },
  sovereign: {
    src: '/images/07-global-sovereign-ai-indigo.png',
    alt: 'A global, sovereign AI delivery network spanning strategic regions.',
    accent: 'rgba(99, 102, 241, 0.16)', // indigo
  },
  research: {
    src: '/images/08-knowledge-graph-research-purple-teal.png',
    alt: 'A knowledge graph powering enterprise research, organizational memory, and intelligence.',
    accent: 'rgba(45, 212, 191, 0.15)', // purple / teal
  },
  outcomes: {
    src: '/images/09-enterprise-ai-outcomes-orange.png',
    alt: 'Enterprise AI outcomes: moving from scattered experiments to governed, measurable operations.',
    accent: 'rgba(255, 138, 76, 0.15)', // orange
  },
  operations: {
    src: '/images/10-managed-ai-operations-light-blue.png',
    alt: 'Managed AI operations keeping enterprise AI systems running, optimized, and scaling.',
    accent: 'rgba(56, 152, 255, 0.14)', // light blue
  },
} as const satisfies Record<string, EnterpriseVisual>
