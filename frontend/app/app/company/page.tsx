import type { Metadata } from 'next'
import { Building2, Globe2, Handshake, Briefcase, Radio, TrendingUp, Users, Compass } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { BrandButton } from '@/components/ui/brand-button'
import { contact, locations } from '@/data/site-content'

export const metadata: Metadata = {
  title: 'Company — GFF AI',
  description:
    'About GFF AI, our leadership approach, partners, careers, global locations, media, and investor contact.',
}

const pillars = [
  {
    icon: Compass,
    title: 'About',
    body: 'GFF AI is an enterprise AI transformation company. We take organisations from AI discovery through engineered systems into governed, production-scale operations.',
  },
  {
    icon: Users,
    title: 'Leadership',
    body: 'Transformation, engineering, and operating leaders who have delivered AI programmes inside regulated, complex enterprises.',
  },
  {
    icon: Handshake,
    title: 'Partners',
    body: 'A strategic ecosystem across cloud platforms, data infrastructure, and domain specialists that accelerates delivery.',
  },
  {
    icon: Briefcase,
    title: 'Careers',
    body: 'Opportunities for builders, strategists, architects, and AI operations talent working on production enterprise systems.',
  },
  {
    icon: Radio,
    title: 'Media',
    body: 'Press, brand, speaking, and event enquiries — reach the team directly for anything media related.',
  },
  {
    icon: TrendingUp,
    title: 'Investors',
    body: 'Information for current and prospective investors in GFF AI PTE. LTD.',
  },
]

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title={
          <>
            The people and partners behind <span className="text-brand-gradient">GFF AI</span>
          </>
        }
        subtitle="Leadership, ecosystem, careers, and the global footprint that delivers our enterprise AI programmes."
      />

      {/* Pillars */}
      <section className="py-16 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} delay={(i % 3) * 0.08}>
                <article className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-xl font-semibold text-navy">{p.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="bg-brand-soft-gradient py-16 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Locations"
            title="Where we operate"
            subtitle="Active delivery hubs today, with further regions on the roadmap."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal>
              <div className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-brand-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <Globe2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold text-navy">Active</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {locations.active.map((l) => (
                    <li key={l.city} className="rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue">
                      {l.city}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-brand-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold text-navy">Planned</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {locations.future.map((l) => (
                    <li key={l.city} className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-navy">
                      {l.city}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="flex flex-col items-center gap-4 pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {contact.email}
            </p>
            <BrandButton href="/contact" size="lg">
              Get in Touch
            </BrandButton>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
