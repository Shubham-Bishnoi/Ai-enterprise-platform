import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { SectionHeader } from '@/components/ui/section-header'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { BrandButton } from '@/components/ui/brand-button'
import { COMPARISON, LIFECYCLE } from '@/data/methodology'
import { DefinitionSplit } from '@/components/how-gff-works/definition-split'
import { SevenStepsCarousel } from '@/components/how-gff-works/seven-steps-carousel'
import { LifecycleDeliveryMap } from '@/components/how-gff-works/lifecycle-delivery-map'

export const metadata: Metadata = {
  title: 'How GFF AI Works | Enterprise Intelligence Engineering',
  description:
    'Explore how GFF AI designs enterprise memory, specialist AI teams, governed workflows and continuously improving enterprise intelligence systems.',
}

export default function HowGffAiWorksPage() {
  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="How GFF AI Works"
        title={
          <>
            How Enterprise Intelligence <span className="text-brand-gradient">Is Engineered</span>
          </>
        }
        subtitle="A seven-step method for understanding the organisation, organising enterprise knowledge, engineering specialist AI teams, integrating them into operations and improving them under continuous governance."
      >
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <BrandButton href="/#blueprint">Generate Your Blueprint</BrandButton>
          <BrandButton href="/contact" variant="secondary">
            Book a Consultation
          </BrandButton>
        </div>
      </PageHero>

      {/* 2 — Definition: image-led editorial split */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <DefinitionSplit />
        </div>
      </section>

      {/* 3 — Philosophy: typographic contrast, no cards, no image */}
      <section className="py-14 md:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Engineering Philosophy"
            title="Business outcomes are the starting point"
          />
          <ScrollReveal>
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10">
              <div className="flex flex-col gap-2 text-center md:text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  The technology-first question
                </p>
                <p className="text-xl font-medium leading-snug text-muted-foreground md:text-2xl">
                  “Which model should we use?”
                </p>
              </div>
              <span aria-hidden="true" className="mx-auto h-px w-16 bg-border md:h-24 md:w-px" />
              <div className="flex flex-col gap-2 text-center md:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
                  The enterprise-first question
                </p>
                <p className="text-xl font-medium leading-snug text-navy md:text-2xl">
                  “How does this organisation operate, where is its knowledge, how are decisions made and what outcomes
                  need improvement?”
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-center text-[15px] text-muted-foreground">
              Only after understanding the enterprise do we select models, platforms and integration patterns.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 4 — Seven steps: horizontal focus carousel inside a pale gradient band */}
      <section
        className="overflow-hidden py-16 md:py-24"
        style={{
          background:
            'linear-gradient(115deg, #FFFDF9 0%, #F2F7FF 45%, #F3F0FF 78%, #FFF4F1 100%)',
        }}
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="The Methodology"
            title="Seven engineering steps"
            subtitle="Each step builds on the previous one — from understanding the organisation to continuously improving its intelligence."
          />
          <SevenStepsCarousel />
        </div>
      </section>

      {/* 5 — Lifecycle */}
      <section className="bg-brand-soft-gradient py-14 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="The Engagement"
            title="The Enterprise Intelligence Engineering Lifecycle"
            subtitle="Six stages shape every engagement, from first discovery to enterprise-wide scale."
          />
          <ScrollReveal>
            <ol className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
              {LIFECYCLE.map((stage, i) => (
                <li key={stage.name} className="min-w-[180px] flex-1 md:min-w-0">
                  <div className="flex h-full flex-col gap-1.5 rounded-[18px] border border-border bg-card p-4 shadow-brand-soft">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-[11px] font-semibold text-brand-blue">
                        {i + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-navy">{stage.name}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      {/* 6 — Delivery mapping */}
      <section className="py-14 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Delivery" title="How the lifecycle is delivered" />
          <ScrollReveal>
            <LifecycleDeliveryMap />
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <p className="text-center text-[15px] leading-relaxed text-muted-foreground">
              Enterprise Intelligence Engineering defines the discipline. The lifecycle explains the engagement.
              Garage–Foundry–Factory provides the delivery system.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 7 — Why this approach is different */}
      <section className="bg-brand-soft-gradient py-14 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="The Difference" title="Why this approach is different" />
          <div className="grid gap-5 md:grid-cols-2">
            <ScrollReveal>
              <div className="flex h-full flex-col gap-4 rounded-[22px] border border-border bg-card/70 p-7">
                <h3 className="text-lg font-semibold text-navy">{COMPARISON.traditional.heading}</h3>
                <ul className="flex flex-col gap-2.5">
                  {COMPARISON.traditional.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                        <X className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <div className="flex h-full flex-col gap-4 rounded-[22px] border border-brand-blue/25 bg-card p-7 shadow-brand-soft">
                <h3 className="text-lg font-semibold text-navy">{COMPARISON.eie.heading}</h3>
                <ul className="flex flex-col gap-2.5">
                  {COMPARISON.eie.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-navy">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 8 — Final CTA */}
      <section className="gradient-cta py-16 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col items-center gap-5">
            <h2 className="text-balance text-[1.9rem] font-semibold tracking-tight text-navy md:text-[2.5rem]">
              Start with an Enterprise Intelligence Blueprint
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Identify where intelligence can create measurable value, what foundations are required and how your
              organisation can progress from discovery to governed scale.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <BrandButton href="/#blueprint" size="lg">
                Generate Blueprint
              </BrandButton>
              <BrandButton href="/#talk-to-agent" variant="secondary" size="lg">
                Talk to GFF AI
              </BrandButton>
              <BrandButton href="/contact" variant="secondary" size="lg">
                Book a Consultation
              </BrandButton>
            </div>
            <Link
              href="/build-with-gff"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue transition-colors hover:text-brand-blue-hover"
            >
              See how engagements work
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
