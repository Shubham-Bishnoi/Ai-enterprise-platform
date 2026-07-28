import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/page-hero'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { BrandButton } from '@/components/ui/brand-button'
import { SplitVisualFeature } from '@/components/ui/enterprise-visuals'
import { ENTERPRISE_VISUALS } from '@/components/ui/enterprise-visuals-data'
import { ResearchSection } from '@/components/home/research-section'
import { capabilities } from '@/data/site-content'

export const metadata: Metadata = {
  title: 'Capabilities — GFF AI',
  description:
    'AI Strategy, AI Engineering, Agentic AI, AI Governance, AI Labs, AI Factory, AI Marketplace, and AI Operations.',
}

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title={
          <>
            Eight capabilities. <span className="text-brand-gradient">One operating system.</span>
          </>
        }
        subtitle="Everything an enterprise needs to move AI from ambition to governed, production-scale operations."
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            {capabilities.map((cap, i) => (
              <ScrollReveal key={cap.name} delay={(i % 2) * 0.08}>
                <article className="flex flex-col gap-4 rounded-[22px] border border-border bg-card p-6 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(7,22,47,0.1)] md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-tight text-navy">{cap.name}</h2>
                    <span className="text-brand-gradient text-2xl font-semibold">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{cap.description}</p>

                  <div className="flex flex-col gap-3.5 border-t border-border pt-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">Problem solved</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-navy">{cap.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-purple">Deliverables</p>
                      <ul className="mt-1.5 flex flex-wrap gap-2">
                        {cap.deliverables.map((d) => (
                          <li key={d} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-navy">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">Related platforms</p>
                      <ul className="mt-1.5 flex flex-wrap gap-2">
                        {cap.platforms.map((p) => (
                          <li key={p} className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium text-brand-blue">
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-navy">{cap.outcome}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="flex justify-center pt-8">
            <BrandButton href="/contact" size="lg">
              Discuss Your AI Capability Needs
            </BrandButton>
          </ScrollReveal>
        </div>
      </section>

      {/* Operate, optimize, scale — managed AI operations. */}
      <section className="bg-brand-soft-gradient py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SplitVisualFeature
            eyebrow="AI Operations"
            title="Operate, optimize, and scale"
            description="After go-live, GFF AI runs, monitors, and improves your AI systems — keeping agents governed, models performant, and operations scaling with the business."
            imageSrc={ENTERPRISE_VISUALS.operations.src}
            imageAlt={ENTERPRISE_VISUALS.operations.alt}
            accent={ENTERPRISE_VISUALS.operations.accent}
            imageSide="right"
          />
        </div>
      </section>

      {/* Latest Research & Intelligence — moved here from the homepage;
          keeps the #research-intelligence anchor used by nav and redirects. */}
      <ResearchSection />
    </>
  )
}
