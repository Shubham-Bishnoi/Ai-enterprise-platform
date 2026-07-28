'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AgentDisplay } from './agent-data'

/**
 * Agent specialist card — an editorial horizontal profile. Text content
 * occupies the left half; the supplied agent artwork fills the right half and
 * merges into the content region through a soft white gradient (no hard
 * divider). Real semantic HTML with a real CTA button throughout.
 *
 * Variants:
 * - "wide" (default): the horizontal rectangle used on the desktop arc.
 * - "stacked": vertical layout for the mobile / reduced-motion carousel.
 */
export function AgentCardBody({
  agent,
  online,
  onStart,
  variant = 'wide',
  className,
}: {
  agent: AgentDisplay
  online: boolean
  onStart: (id: AgentDisplay['id']) => void
  variant?: 'wide' | 'stacked'
  className?: string
}) {
  const Icon = agent.icon

  const statusChip = (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/85 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', online ? 'bg-emerald-500' : 'bg-navy/25')} />
      {online ? 'Online' : 'Offline'}
    </span>
  )

  const cta = (
    <button
      type="button"
      onClick={() => onStart(agent.id)}
      className="group/cta inline-flex min-h-[44px] items-center gap-1.5 self-start rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
      style={{ color: agent.accent }}
    >
      Start conversation
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true" />
    </button>
  )

  if (variant === 'stacked') {
    return (
      <article
        className={cn(
          'relative w-[min(88vw,330px)] overflow-hidden rounded-[22px] border border-border bg-white shadow-[0_10px_34px_rgba(7,22,47,0.09)]',
          className,
        )}
      >
        <div aria-hidden="true" className="relative h-[130px] w-full">
          <Image src={agent.image} alt="" fill sizes="330px" className="object-cover object-right" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
        </div>
        <div className="flex flex-col gap-2 p-5 pt-2">
          <div className="flex items-start justify-between gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${agent.accent}1A`, color: agent.accent }}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            {statusChip}
          </div>
          <h3 className="text-[17px] font-semibold leading-snug text-navy">{agent.name}</h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{agent.description}</p>
          {cta}
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group/card relative h-[205px] w-[400px] overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_10px_34px_rgba(7,22,47,0.09)] transition-shadow duration-300 xl:h-[220px] xl:w-[440px]',
        className,
      )}
    >
      {/* Right visual region — supplied artwork, merging left into the content. */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[52%]">
        <Image
          src={agent.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 230px, 210px"
          className="object-cover object-right"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.72) 26%, rgba(255,255,255,0) 60%)',
          }}
        />
      </div>

      {/* Left content region */}
      <div className="relative z-10 flex h-full w-[58%] flex-col gap-2 p-5 xl:p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${agent.accent}1A`, color: agent.accent }}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          {statusChip}
        </div>
        <h3 className="mt-1 text-[17px] font-semibold leading-snug text-navy xl:text-lg">{agent.name}</h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{agent.description}</p>
        <div className="mt-auto">{cta}</div>
      </div>
    </article>
  )
}
