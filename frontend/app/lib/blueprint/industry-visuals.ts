/**
 * Deterministic industry → illustration mapping for the generated blueprint.
 *
 * Kept as a standalone configuration file (per the design brief) so the mapping
 * is reviewable in one place and never inferred from free-text keywords in a way
 * that could surface the wrong industry. Matching is a conservative, ordered set
 * of substring rules; anything unmatched falls back to a neutral illustration
 * rather than an unrelated industry image.
 */

export type IndustryVisualKey =
  | 'healthcare'
  | 'mining'
  | 'manufacturing'
  | 'financial'
  | 'retail'
  | 'energy'
  | 'neutral'

type VisualEntry = { key: IndustryVisualKey; src: string; label: string }

const VISUALS: Record<IndustryVisualKey, VisualEntry> = {
  healthcare: {
    key: 'healthcare',
    src: '/images/blueprint-results/01-healthcare-ai-blueprint.png',
    label: 'Healthcare AI blueprint illustration',
  },
  mining: {
    key: 'mining',
    src: '/images/blueprint-results/02-mining-ai-blueprint.png',
    label: 'Mining AI blueprint illustration',
  },
  manufacturing: {
    key: 'manufacturing',
    src: '/images/blueprint-results/03-manufacturing-ai-blueprint.png',
    label: 'Manufacturing AI blueprint illustration',
  },
  financial: {
    key: 'financial',
    src: '/images/blueprint-results/04-financial-services-ai-blueprint.png',
    label: 'Financial services AI blueprint illustration',
  },
  retail: {
    key: 'retail',
    src: '/images/blueprint-results/05-retail-ai-blueprint.png',
    label: 'Retail AI blueprint illustration',
  },
  energy: {
    key: 'energy',
    src: '/images/blueprint-results/06-energy-utilities-ai-blueprint.png',
    label: 'Energy and utilities AI blueprint illustration',
  },
  // Neutral fallback — the existing "Industry AI Solutions" illustration.
  neutral: {
    key: 'neutral',
    src: '/images/06-industry-ai-solutions-teal.png',
    label: 'Enterprise AI blueprint illustration',
  },
}

// Ordered rules: first match wins. Keep specific terms before broad ones.
const RULES: { key: IndustryVisualKey; test: RegExp }[] = [
  { key: 'healthcare', test: /health|hospital|clinic|medical|life\s?science|pharma|biotech|patient/i },
  { key: 'financial', test: /bank|financ|insur|fintech|wealth|capital\s?market|payment|lending|invest/i },
  { key: 'mining', test: /mining|\bmine\b|mineral|metals|extraction|quarry/i },
  { key: 'manufacturing', test: /manufactur|factory|industrial|automotive|assembly|production\s?line/i },
  { key: 'retail', test: /retail|commerce|consumer|shopping|merchandis|ecommerce|e-commerce|cpg/i },
  { key: 'energy', test: /energy|utilit|power|electric|oil|\bgas\b|grid|renewable|solar|wind/i },
]

/** Resolve an industry label to its blueprint visual. Never throws. */
export function resolveIndustryVisual(industry: string | undefined | null): VisualEntry {
  const value = (industry ?? '').trim()
  if (value) {
    for (const rule of RULES) {
      if (rule.test.test(value)) return VISUALS[rule.key]
    }
  }
  return VISUALS.neutral
}

export function visualForKey(key: IndustryVisualKey): VisualEntry {
  return VISUALS[key] ?? VISUALS.neutral
}
