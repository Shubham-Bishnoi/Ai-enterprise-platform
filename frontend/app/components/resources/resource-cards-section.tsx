import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SectionHeader } from '@/components/ui/section-header'
import { resourcesFor, type ResourceDestination } from '@/data/resources'

/**
 * Compact resource strip embedded on a destination page (the former
 * /resources library is redistributed across Capabilities, Industries,
 * Platforms and Build With GFF). Renders at most three cards per row on
 * desktop and scrolls horizontally on mobile so pages stay short.
 *
 * "Read more" was a placeholder on the old /resources page (no article routes
 * exist yet) — that safe non-navigating behaviour is preserved here.
 */
export function ResourceCardsSection({
  id,
  eyebrow,
  heading,
  description,
  destination,
  className,
}: {
  id: string
  eyebrow: string
  heading: string
  description: string
  destination: ResourceDestination
  className?: string
}) {
  const items = resourcesFor(destination)
  if (items.length === 0) return null

  return (
    <section id={id} className={cn('scroll-mt-24 py-14 md:py-20', className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={heading} subtitle={description} align="left" />
        <div className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {items.slice(0, 3).map((r, i) => (
            <ScrollReveal key={r.title} delay={(i % 3) * 0.07} className="w-[300px] shrink-0 snap-start md:w-auto">
              <article className="group flex h-full flex-col gap-3.5 rounded-3xl border border-border bg-card p-6 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)] md:p-7">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
                    {r.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug text-navy">{r.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
