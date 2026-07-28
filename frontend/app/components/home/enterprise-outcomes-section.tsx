import { Check, X } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { MediaFeatureCard } from '@/components/ui/enterprise-visuals'
import { ENTERPRISE_VISUALS } from '@/components/ui/enterprise-visuals-data'
import { outcomes } from '@/data/site-content'

// The four outcomes we lead with — real text, never baked into the image.
const leadOutcomes = [
  'Faster AI opportunity discovery',
  'Production-ready agent systems',
  'Governed AI operations',
  'Compliance and audit readiness',
]

const beforeItems = [
  'Disconnected pilots and proofs of concept',
  'Knowledge fragmented across people and systems',
  'Manual workflows scaling with headcount',
  'Governance introduced late',
  'Limited visibility into AI performance',
]

const afterItems = [
  'Shared enterprise intelligence foundation',
  'Governed specialist agents supporting real workflows',
  'Enterprise memory connecting knowledge and context',
  'Human approvals and auditability embedded by design',
  'Continuous visibility into adoption, quality and outcomes',
]

export function EnterpriseOutcomesSection() {
  return (
    <section className="bg-brand-soft-gradient py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Asymmetric feature card: illustration dominant, outcomes as real text. */}
        <MediaFeatureCard
          eyebrow="Outcomes"
          title="Enterprise AI Outcomes"
          description="Designed to move AI from experiments into governed, measurable, enterprise operations."
          imageSrc={ENTERPRISE_VISUALS.outcomes.src}
          imageAlt={ENTERPRISE_VISUALS.outcomes.alt}
          accent={ENTERPRISE_VISUALS.outcomes.accent}
          imageSide="right"
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {leadOutcomes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-navy">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </MediaFeatureCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <ScrollReveal>
            <div className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card/70 p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">Before</p>
              <h3 className="text-2xl font-semibold tracking-tight text-navy">Scattered AI initiatives</h3>
              <ul className="flex flex-col gap-3">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                      <X className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex h-full flex-col gap-5 rounded-3xl border border-brand-blue/20 bg-card p-8 shadow-brand-soft md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">After</p>
              <h3 className="text-2xl font-semibold tracking-tight text-navy">Connected enterprise intelligence</h3>
              <ul className="flex flex-col gap-3">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-navy">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {outcomes.map((o) => (
              <span key={o} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-navy shadow-brand-soft">
                {o}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
