import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { resourceAnchors, resources } from '@/data/resources'

export function ResearchSection() {
  const featured = resources.find((r) => r.featured) ?? resources[0]
  const secondary = resources.filter((r) => r !== featured).slice(0, 4)

  return (
    <section id="research-intelligence" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Intelligence"
          title="Latest Research & Intelligence"
          subtitle="Articles, whitepapers, architecture references, and events from the GFF AI teams."
        />

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <ScrollReveal>
            <Link
              href={resourceAnchors[featured.destination]}
              className="group flex h-full flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-8 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 md:p-10"
            >
              <div className="flex flex-col gap-4">
                <span className="w-fit rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-semibold text-brand-purple">
                  {featured.type} · Featured
                </span>
                <h3 className="text-balance text-2xl font-semibold tracking-tight text-navy md:text-3xl">
                  {featured.title}
                </h3>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{featured.summary}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue">
                View resource
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </ScrollReveal>

          <div className="flex flex-col gap-4">
            {secondary.map((r, i) => (
              <ScrollReveal key={r.title} delay={i * 0.06}>
                <Link
                  href={resourceAnchors[r.destination]}
                  className="group flex items-start justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-brand-blue">{r.type}</span>
                    <h3 className="text-base font-semibold text-navy">{r.title}</h3>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
