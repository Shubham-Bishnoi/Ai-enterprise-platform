'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SplitVisualFeature } from '@/components/ui/enterprise-visuals'
import { ENTERPRISE_VISUALS } from '@/components/ui/enterprise-visuals-data'
import { journeyStages } from '@/data/site-content'
import { cn } from '@/lib/utils'

const accentDot: Record<string, string> = {
  red: 'bg-brand-red',
  purple: 'bg-brand-purple',
  blue: 'bg-brand-blue',
}

const accentText: Record<string, string> = {
  red: 'text-brand-red',
  purple: 'text-brand-purple',
  blue: 'text-brand-blue',
}

export function JourneySection() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const stage = journeyStages[active]

  return (
    <section className="bg-brand-soft-gradient py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Illustration introduces the journey; the interactive stages follow below. */}
        <SplitVisualFeature
          eyebrow="How We Deliver"
          title="Garage → Foundry → Factory"
          description="Enterprise Intelligence Engineering is delivered through one accountable model — from discovery and design to engineering, production operations and enterprise-wide scale."
          imageSrc={ENTERPRISE_VISUALS.journey.src}
          imageAlt={ENTERPRISE_VISUALS.journey.alt}
          accent={ENTERPRISE_VISUALS.journey.accent}
          imageSide="left"
        />

        {/* Lifecycle → delivery mapping: one methodology, one delivery system. */}
        <ScrollReveal>
          <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              ['Garage', 'Discover and Design'],
              ['Foundry', 'Engineer and Integrate'],
              ['Factory', 'Production deployment'],
              ['Operate and Optimize', 'Govern and continuously improve'],
              ['Scale', 'Expand across the organisation'],
            ].map(([stage, phase]) => (
              <li key={stage} className="inline-flex items-baseline gap-1.5">
                <span className="font-semibold text-navy">{stage}</span>
                <span aria-hidden="true" className="text-border">—</span>
                {phase}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* Segmented timeline */}
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 md:justify-center" role="tablist" aria-label="Transformation stages">
            {journeyStages.map((s, i) => (
              <div key={s.name} className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  role="tab"
                  id={`journey-tab-${i}`}
                  aria-selected={active === i}
                  aria-controls="journey-stage-panel"
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
                    active === i
                      ? 'border-transparent bg-card shadow-brand-soft'
                      : 'border-border bg-transparent text-muted-foreground hover:-translate-y-0.5 hover:bg-card/60 hover:shadow-brand-soft',
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', accentDot[s.accent])} aria-hidden="true" />
                  <span className={active === i ? accentText[s.accent] : undefined}>{s.name}</span>
                </button>
                {i < journeyStages.length - 1 && <span className="h-px w-4 bg-border md:w-8" aria-hidden="true" />}
              </div>
            ))}
          </div>

          {/* Active stage card */}
          <motion.div
            key={stage.name}
            role="tabpanel"
            id="journey-stage-panel"
            aria-labelledby={`journey-tab-${active}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mx-auto mt-10 grid max-w-4xl gap-6 rounded-3xl border border-border bg-card p-8 shadow-brand-soft md:grid-cols-[1fr_1.4fr] md:p-12"
          >
            <div className="flex flex-col gap-3">
              <p className={cn('text-xs font-semibold uppercase tracking-[0.2em]', accentText[stage.accent])}>
                Stage {String(active + 1).padStart(2, '0')}
              </p>
              <h3 className="text-4xl font-semibold tracking-tight text-navy md:text-5xl">{stage.name}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{stage.purpose}</p>
            </div>
            <div className="flex flex-col justify-center gap-5 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Deliverables</p>
                <p className="mt-1.5 text-base text-navy">{stage.deliverables}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Outcome</p>
                <p className="mt-1.5 text-base text-navy">{stage.outcome}</p>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}
