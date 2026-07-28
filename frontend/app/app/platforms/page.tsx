import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/page-hero'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { BrandButton } from '@/components/ui/brand-button'
import { MediaFeatureCard } from '@/components/ui/enterprise-visuals'
import { ENTERPRISE_VISUALS } from '@/components/ui/enterprise-visuals-data'
import { ResourceCardsSection } from '@/components/resources/resource-cards-section'
import { platforms } from '@/data/platforms'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Platforms — GFF AI',
  description:
    'The GFF AI platform lineup: Garage, Foundry, Factory, Blueprint, Marketplace, Control Center, and vertical intelligence platforms.',
}

const accentBar: Record<string, string> = {
  red: 'bg-brand-red',
  purple: 'bg-brand-purple',
  blue: 'bg-brand-blue',
}

const accentText: Record<string, string> = {
  red: 'text-brand-red',
  purple: 'text-brand-purple',
  blue: 'text-brand-blue',
}

const categories = ['Core', 'Enablement', 'Vertical'] as const

const categorySubtitles: Record<(typeof categories)[number], string> = {
  Core: 'The operating system — from discovery and planning to production and governance.',
  Enablement: 'Capability building for enterprises, universities, and teams.',
  Vertical: 'Industry intelligence platforms engineered for specific sectors.',
}

export default function PlatformsPage() {
  return (
    <>
      <PageHero
        eyebrow="Platforms"
        title={
          <>
            The GFF AI <span className="text-brand-gradient">platform lineup</span>
          </>
        }
        subtitle="Each platform is a product — engineered, governed, and built to compound across your enterprise."
      />

      {/* Marketplace introduction, above the platform categories. */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MediaFeatureCard
            eyebrow="AI Solution Marketplace"
            title="Reusable, productized AI assets"
            description="Accelerators, agents, and reference solutions packaged as products — so every new initiative starts further ahead than the last, across the categories below."
            imageSrc={ENTERPRISE_VISUALS.marketplace.src}
            imageAlt={ENTERPRISE_VISUALS.marketplace.alt}
            accent={ENTERPRISE_VISUALS.marketplace.accent}
            imageSide="right"
          />
        </div>
      </section>

      {categories.map((category, ci) => {
        const items = platforms.filter((p) => p.category === category)
        return (
          <section key={category} className={cn('py-16 md:py-20', ci % 2 === 1 && 'bg-brand-soft-gradient')}>
            <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
              <SectionHeader
                eyebrow={`${category} platforms`}
                title={category === 'Core' ? 'The operating core' : category === 'Enablement' ? 'Capability & learning' : 'Vertical intelligence'}
                subtitle={categorySubtitles[category]}
                align="left"
              />
              <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
                {items.map((platform, i) => (
                  <ScrollReveal key={platform.name} delay={(i % 3) * 0.08} className="w-80 shrink-0 snap-start lg:w-auto">
                    <article className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)]">
                      <div className={cn('h-1.5 w-full', accentBar[platform.accent])} aria-hidden="true" />
                      <div className="flex flex-1 flex-col gap-3 p-7">
                        <p className={cn('text-xs font-semibold uppercase tracking-[0.2em]', accentText[platform.accent])}>
                          {platform.tagline}
                        </p>
                        <h2 className="text-2xl font-semibold tracking-tight text-navy">{platform.name}</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">{platform.description}</p>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Architecture library and developer docs, formerly on /resources. */}
      <ResourceCardsSection
        id="technical-library"
        eyebrow="Technical Library"
        heading="Architecture and Developer Resources"
        description="Reference architectures, platform concepts and developer guidance for building governed enterprise intelligence systems."
        destination="platforms"
      />

      <section className="gradient-cta py-16 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <SectionHeader
            eyebrow="Get Started"
            title="See the platforms in action"
            subtitle="Book a consultation and we will walk through the platforms most relevant to your transformation."
          />
          <ScrollReveal delay={0.1}>
            <BrandButton href="/contact" size="lg">
              Book a Consultation
            </BrandButton>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
