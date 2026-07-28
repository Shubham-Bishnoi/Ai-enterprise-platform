'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { LIFECYCLE } from '@/data/methodology'

/**
 * "How GFF AI Works" — one premium image-led methodology panel, directly after
 * the hero. Centred editorial header, then a single large feature surface:
 * approved copy + CTA on the left, the continuous-improvement artwork on the
 * right with a soft edge blend, and a connected six-stage lifecycle rail along
 * the bottom. Selecting a stage reveals its description in a stable info area
 * above the rail (no disappearing tooltips). User-controlled, no autoplay.
 */
export function HowGffWorksSection() {
  const [active, setActive] = useState(0)
  const stage = LIFECYCLE[active]

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {/* Centred editorial header */}
        <ScrollReveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">How GFF AI Works</p>
          <h2 className="text-balance text-[1.9rem] font-semibold tracking-tight text-navy md:text-[2.5rem]">
            Enterprise Intelligence Engineering
          </h2>
        </ScrollReveal>

        {/* Feature surface */}
        <ScrollReveal delay={0.08}>
          <div className="overflow-hidden rounded-[32px] border border-border bg-gradient-to-br from-white via-[#F4F8FF] to-[#F6F3FF]">
            <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
              {/* Copy */}
              <div className="flex flex-col justify-center gap-5 p-8 md:p-10 lg:p-12">
                <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-base">
                  We begin by understanding how an enterprise operates and makes decisions. We then organise its
                  knowledge, engineer specialist AI teams, connect them to existing systems, embed governance and
                  continuously improve performance.
                </p>
                <p className="text-base font-medium text-navy">
                  Technology is not the starting point. Business outcomes are.
                </p>
                <Link
                  href="/how-gff-ai-works"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-medium text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-blue-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  Explore How GFF AI Works
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>

              {/* Visual — soft blend into the surface, no card box */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                <Image
                  src="/images/how-gff-ai-works/05-continuous-improvement.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  className="object-cover"
                  style={{ objectPosition: '50% 42%' }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 hidden lg:block"
                  style={{ background: 'linear-gradient(90deg, #F4F8FF 0%, rgba(244,248,255,0) 22%)' }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 lg:hidden"
                  style={{ background: 'linear-gradient(180deg, rgba(244,248,255,0.9) 0%, rgba(244,248,255,0) 24%)' }}
                />
              </div>
            </div>

            {/* Stable stage description + connected lifecycle rail */}
            <div className="border-t border-border/70 px-6 pb-6 pt-5 md:px-10 md:pb-8">
              <p aria-live="polite" className="mb-4 min-h-[2.6em] text-center text-sm leading-relaxed text-muted-foreground md:min-h-[1.5em]">
                <span className="font-semibold text-navy">{stage.name}. </span>
                {stage.description}
              </p>

              <div className="no-scrollbar -mx-2 overflow-x-auto px-2">
                <div className="relative mx-auto flex min-w-[560px] max-w-3xl items-center justify-between" role="group" aria-label="Engagement lifecycle">
                  {/* Progression line */}
                  <span aria-hidden="true" className="absolute left-4 right-4 top-[13px] h-px bg-border" />
                  {LIFECYCLE.map((s, i) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={active === i}
                      className="group relative flex flex-col items-center gap-1.5 px-2 focus:outline-none"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'relative z-10 flex h-[27px] w-[27px] items-center justify-center rounded-full border bg-card text-[11px] font-semibold transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-brand-blue group-focus-visible:ring-offset-2',
                          active === i
                            ? 'border-brand-blue bg-brand-blue text-white shadow-brand-soft'
                            : 'border-border text-muted-foreground group-hover:border-brand-blue/40 group-hover:text-brand-blue',
                        )}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-medium transition-colors duration-300',
                          active === i ? 'text-brand-blue' : 'text-muted-foreground group-hover:text-navy',
                        )}
                      >
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
