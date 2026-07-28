import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { BrandButton } from '@/components/ui/brand-button'
import { ResourceCardsSection } from '@/components/resources/resource-cards-section'

export const metadata: Metadata = {
  title: 'Build With GFF — GFF AI',
  description:
    'How clients work with GFF AI: workshop, blueprint, pilot, agent factory, governance, and managed operations.',
}

const processSteps = [
  {
    step: 'Workshop',
    description:
      'A focused working session to map your AI opportunity landscape, priorities, and readiness with your leadership team.',
    output: 'Opportunity map and alignment',
  },
  {
    step: 'Blueprint',
    description:
      'A tailored AI transformation blueprint — architecture, use case portfolio, operating model, and governance approach.',
    output: 'Board-ready transformation plan',
  },
  {
    step: 'Pilot',
    description:
      'A production-quality pilot in the Garage — proving value on a real workflow with real data, fast.',
    output: 'Validated, working AI system',
  },
  {
    step: 'Agent Factory',
    description:
      'The Foundry and Factory engineer, harden, and deploy agent systems into your enterprise environment.',
    output: 'Production agent systems',
  },
  {
    step: 'Governance',
    description:
      'Control center, approval workflows, and human-in-the-loop oversight embedded into every AI workload.',
    output: 'Governed, audit-ready AI',
  },
  {
    step: 'Managed Operations',
    description:
      'Ongoing monitoring, optimization, and evolution of your AI estate — so it improves instead of decaying.',
    output: 'Continuously improving AI operations',
  },
]

const engagementModels = [
  {
    name: 'Transformation Partner',
    description: 'End-to-end partnership across the full Garage → Foundry → Factory journey.',
  },
  {
    name: 'Platform Deployment',
    description: 'Deploy specific GFF platforms — Blueprint, Marketplace, Control Center — into your stack.',
  },
  {
    name: 'Capability Building',
    description: 'AI labs, academies, and capability programs that make your teams AI-native.',
  },
  {
    name: 'Managed AI Operations',
    description: 'We operate your AI estate under agreed governance, performance, and compliance standards.',
  },
]

export default function BuildWithGffPage() {
  return (
    <>
      <PageHero
        eyebrow="Build With GFF"
        title={
          <>
            From first workshop to <span className="text-brand-gradient">managed operations</span>
          </>
        }
        subtitle="A clear, staged way of working — designed to prove value early and compound it over time."
      />

      {/* Connection to the methodology — engagements apply the EIE lifecycle. */}
      <section className="pt-10 md:pt-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 text-center sm:px-6 lg:px-8">
          <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
            Our engagements apply the Enterprise Intelligence Engineering lifecycle through GFF AI’s
            Garage–Foundry–Factory delivery model.
          </p>
          <Link
            href="/how-gff-ai-works"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue transition-colors hover:text-brand-blue-hover"
          >
            Understand How GFF AI Works
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          {processSteps.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 0.05}>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-brand-soft">
                    {i + 1}
                  </span>
                  {i < processSteps.length - 1 && <span className="mt-2 w-px flex-1 bg-border" aria-hidden="true" />}
                </div>
                <div className="flex flex-1 flex-col gap-2 rounded-3xl border border-border bg-card p-7 shadow-brand-soft mb-2">
                  <h2 className="text-xl font-semibold text-navy">{step.step}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  <p className="text-sm font-medium text-brand-blue">{step.output}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-soft-gradient py-16 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Engagement Models"
            title="Work with us the way that fits"
            subtitle="Four engagement models — from full transformation partnership to managed AI operations."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {engagementModels.map((model, i) => (
              <ScrollReveal key={model.name} delay={(i % 4) * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-3xl border border-border bg-card p-7 shadow-brand-soft">
                  <h3 className="text-lg font-semibold text-navy">{model.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{model.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Events, webinars and delivery videos, formerly on /resources. */}
      <ResourceCardsSection
        id="events"
        eyebrow="Learn and Engage"
        heading="Events, Workshops and Delivery Sessions"
        description="Explore practical sessions that explain the GFF delivery model and help teams identify the right starting point."
        destination="build-with-gff"
      />

      <section className="gradient-cta py-16 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 text-center sm:px-6">
          <SectionHeader
            eyebrow="Start Here"
            title="Begin with a workshop"
            subtitle="One session with your leadership team. A clear view of where AI creates value in your enterprise."
          />
          <ScrollReveal delay={0.1} className="flex flex-wrap justify-center gap-3">
            <BrandButton href="/contact" size="lg">
              Book a Workshop
            </BrandButton>
            <BrandButton href="/contact" variant="secondary" size="lg">
              Generate Blueprint
            </BrandButton>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
