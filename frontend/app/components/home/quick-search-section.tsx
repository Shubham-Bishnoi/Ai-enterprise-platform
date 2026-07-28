'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { searchSuggestions } from '@/data/site-content'
import { industries } from '@/data/industries'
import { platforms } from '@/data/platforms'
import { capabilities } from '@/data/site-content'
import { cn } from '@/lib/utils'

type Result = { label: string; kind: 'Industry' | 'Platform' | 'Capability'; href: string }

const allResults: Result[] = [
  ...industries.map((i) => ({ label: `${i.name} AI`, kind: 'Industry' as const, href: '/industries' })),
  ...platforms.map((p) => ({ label: p.name, kind: 'Platform' as const, href: '/platforms' })),
  ...capabilities.map((c) => ({ label: c.name, kind: 'Capability' as const, href: '/capabilities' })),
]

const kindStyles: Record<Result['kind'], string> = {
  Industry: 'bg-brand-red/10 text-brand-red',
  Platform: 'bg-brand-blue/10 text-brand-blue',
  Capability: 'bg-brand-purple/10 text-brand-purple',
}

export function QuickSearchSection() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allResults.filter((r) => r.label.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Quick Search"
          title="Find Your AI Starting Point"
          subtitle="Search by industry, use case, platform, or transformation goal."
        />

        <ScrollReveal delay={0.1}>
          <div className="glass-panel relative rounded-3xl border border-border p-2 shadow-brand-soft">
            <div className="flex items-center gap-3 rounded-2xl bg-card px-5 py-4 transition-shadow focus-within:ring-2 focus-within:ring-brand-blue">
              <Search className="h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 'Insurance AI' or 'Blueprint'..."
                className="w-full bg-transparent text-base text-navy outline-none placeholder:text-muted-foreground"
                aria-label="Search industries, platforms, and capabilities"
              />
            </div>

            {results.length > 0 && (
              <ul className="flex flex-col gap-1 p-2">
                {results.map((r) => (
                  <li key={`${r.kind}-${r.label}`}>
                    <Link
                      href={r.href}
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                    >
                      <span className="text-sm font-medium text-navy">{r.label}</span>
                      <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', kindStyles[r.kind])}>
                        {r.kind}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {searchSuggestions.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s.replace(/^(Build AI for |Create |Build )/, ''))}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-brand-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
                  i % 3 === 0 ? 'text-brand-blue' : i % 3 === 1 ? 'text-brand-red' : 'text-brand-purple',
                )}
              >
                {s}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
