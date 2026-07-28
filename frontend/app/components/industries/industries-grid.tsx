'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { industries, industryGroups } from '@/data/industries'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { cn } from '@/lib/utils'

export function IndustriesGrid() {
  const [group, setGroup] = useState<(typeof industryGroups)[number]>('All')
  const filtered = group === 'All' ? industries : industries.filter((i) => i.group === group)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter industries">
        {industryGroups.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
              group === g
                ? 'border-transparent bg-brand-blue text-white shadow-brand-soft'
                : 'border-border bg-card text-muted-foreground hover:text-navy',
            )}
            aria-pressed={group === g}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((industry, i) => (
          <ScrollReveal key={industry.name} delay={(i % 3) * 0.06}>
            <article className="flex h-full flex-col gap-3.5 rounded-[22px] border border-border bg-card p-6 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_44px_rgba(7,22,47,0.1)]">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-navy">{industry.name}</h2>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  {industry.group}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">Challenge</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{industry.challenge}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">Reference solution</p>
                <p className="mt-1 text-sm leading-relaxed text-navy">{industry.solution}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-purple">AI agents</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {industry.agents.map((a) => (
                    <li key={a} className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-xs font-medium text-brand-purple">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {industry.outcomes.map((o) => (
                  <li key={o} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-navy">
                    {o}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue transition-colors hover:text-brand-blue-hover"
              >
                Request a demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
