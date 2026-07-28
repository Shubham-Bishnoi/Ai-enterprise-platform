import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/page-hero'
import { IndustriesGrid } from '@/components/industries/industries-grid'
import { MediaFeatureCard } from '@/components/ui/enterprise-visuals'
import { ENTERPRISE_VISUALS } from '@/components/ui/enterprise-visuals-data'
import { ResourceCardsSection } from '@/components/resources/resource-cards-section'

export const metadata: Metadata = {
  title: 'Industries — GFF AI',
  description:
    'Enterprise AI transformation across financial services, insurance, healthcare, manufacturing, retail, government, mining, energy, telecom, and professional services.',
}

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={
          <>
            AI transformation, <span className="text-brand-gradient">industry by industry</span>
          </>
        }
        subtitle="Reference solutions, agent systems, and outcomes tailored to the realities of each sector."
      />
      {/* Industry introduction, above the sector grid. */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MediaFeatureCard
            eyebrow="Industry AI Solutions"
            title="Built for the realities of each sector"
            description="Reference solutions, agent systems, and outcomes tuned to the workflows, data, and regulation of your industry — explore the sectors below."
            imageSrc={ENTERPRISE_VISUALS.industries.src}
            imageAlt={ENTERPRISE_VISUALS.industries.alt}
            accent={ENTERPRISE_VISUALS.industries.accent}
            imageSide="left"
          />
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <IndustriesGrid />
        </div>
      </section>

      {/* Case studies and industry sessions, formerly on /resources. */}
      <ResourceCardsSection
        id="case-studies"
        eyebrow="Industry Evidence"
        heading="Case Studies and Industry Sessions"
        description="See how enterprise intelligence patterns apply to sector-specific operations, controls and outcomes."
        destination="industries"
        className="bg-brand-soft-gradient"
      />
    </>
  )
}
