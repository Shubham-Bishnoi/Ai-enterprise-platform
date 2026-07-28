/**
 * Stage copy, scroll windows, and background washes for the Intelligence Forge
 * scroll experience. Shared by the pinned 3D section, the stacked fallback, and
 * the animation mapping so text, atmosphere, and construction stay in sync.
 *
 * The five PNG storyboard frames are kept as references and as the mobile /
 * reduced-motion / loading fallback only — the desktop experience is the live
 * 3D assembly.
 */

export type ForgeStage = {
  key: string
  eyebrow: string
  heading: string
  description: string
  /** Storyboard keyframe — fallback rendering only, never a desktop slide. */
  src: string
  alt: string
  /** Very light section-wide colour wash for this stage. */
  wash: string
}

/**
 * Stage boundaries on the normalized scroll progress. Text becomes active on
 * construction events: Discover when blocks start arriving (~0.18), Blueprint
 * when layers separate (~0.38), Foundry when parts begin locking (~0.58),
 * Factory when operational paths activate (~0.80).
 */
export const STAGE_BOUNDS = [0, 0.18, 0.38, 0.58, 0.8, 1] as const

export const FORGE_STAGES: ForgeStage[] = [
  {
    key: 'garage',
    eyebrow: 'Discover · Garage',
    heading: 'Understand how the enterprise thinks',
    description: 'Map strategic priorities, knowledge, decision pathways, bottlenecks and opportunities before selecting technology.',
    src: '/images/gff-ai-scroll-sequence/01-intelligence-seed-cyan-coral.png',
    alt: 'A luminous cyan glass intelligence core resting on a white ceramic podium, with warm coral accents.',
    wash: 'radial-gradient(60% 80% at 14% 42%, rgba(34,197,235,0.16), transparent 70%), radial-gradient(55% 80% at 86% 30%, rgba(255,138,120,0.15), transparent 70%)',
  },
  {
    key: 'discover',
    eyebrow: 'Design · Garage',
    heading: 'Blueprint the intelligence system',
    description: 'Define the enterprise memory, agent roles, architecture, governance and measurable business outcomes.',
    src: '/images/gff-ai-scroll-sequence/02-enterprise-discovery-orange-purple.png',
    alt: 'A white ceramic machine drawing orange data streams into a glowing blue intelligence core.',
    wash: 'radial-gradient(60% 80% at 12% 34%, rgba(255,150,80,0.15), transparent 70%), radial-gradient(60% 80% at 88% 46%, rgba(168,140,247,0.15), transparent 70%)',
  },
  {
    key: 'blueprint',
    eyebrow: 'Engineer · Foundry',
    heading: 'Create memory and digital specialists',
    description: 'Engineer reusable enterprise knowledge, specialist AI agents, reasoning systems and approved tools.',
    src: '/images/gff-ai-scroll-sequence/03-blueprint-formation-multicolour-teal.png',
    alt: 'Multicoloured data streams resolving into a teal-lit glass core inside a white ceramic machine.',
    wash: 'radial-gradient(48% 70% at 10% 30%, rgba(255,170,90,0.13), transparent 70%), radial-gradient(48% 70% at 44% 72%, rgba(200,120,247,0.11), transparent 70%), radial-gradient(60% 80% at 88% 50%, rgba(45,212,191,0.17), transparent 70%)',
  },
  {
    key: 'foundry',
    eyebrow: 'Integrate · Foundry → Factory',
    heading: 'Connect intelligence to operations',
    description: 'Integrate agents with enterprise applications, data, workflows and human approval pathways.',
    src: '/images/gff-ai-scroll-sequence/04-foundry-assembly-indigo-purple.png',
    alt: 'An indigo and purple glass assembly with a green-lit core, framed by a white ceramic housing.',
    wash: 'radial-gradient(60% 80% at 15% 34%, rgba(129,140,248,0.17), transparent 70%), radial-gradient(60% 80% at 85% 56%, rgba(180,150,247,0.15), transparent 70%)',
  },
  {
    key: 'factory',
    eyebrow: 'Operate → Scale · Factory',
    heading: 'Govern, improve and expand',
    description: 'Monitor quality, security, adoption and outcomes, then expand proven intelligence across the enterprise.',
    src: '/images/gff-ai-scroll-sequence/05-factory-scale-orange-light-blue.png',
    alt: 'A white ceramic machine taking in orange inputs on the left and sending light-blue outputs upward on the right.',
    wash: 'radial-gradient(60% 90% at 8% 46%, rgba(255,150,80,0.15), transparent 70%), radial-gradient(60% 90% at 92% 44%, rgba(90,170,255,0.17), transparent 70%)',
  },
]

/** Active stage index for a progress value. */
export function stageAt(p: number): number {
  for (let i = STAGE_BOUNDS.length - 2; i >= 1; i--) {
    if (p >= STAGE_BOUNDS[i]) return i
  }
  return 0
}
