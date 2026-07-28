'use client'

/**
 * AppleScrollStorySection — the second major homepage section (the landing
 * hero sits above it).
 *
 * A pinned, scroll-scrubbed chapter in the Apple product-page idiom: the stage
 * stays fixed while the copy advances through five states and, on the right, one
 * persistent Enterprise AI Digital Twin progressively assembles — a core that
 * discovers, an architecture that structures it, agents that activate it,
 * governance that contains it, and endpoints that scale it. The object floats in
 * the section background with no card around it, and it never rebuilds from
 * scratch: each stage adds exactly one layer, and scrolling up removes it again.
 *
 * Implementation:
 * - Native CSS `position: sticky` pins the stage (no ScrollTrigger pin-spacers,
 *   which fight Next App Router hydration). Framer Motion `useScroll` +
 *   `useSpring` drives the scrub. No GSAP, no new dependencies.
 * - The enhanced (pinned) path is gated behind a wide viewport AND no
 *   reduced-motion preference. SSR and first client paint render the accessible
 *   stacked fallback, so there is no hydration mismatch.
 */

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Blocks, FileText, Globe2, MessageSquare, Search, ShieldCheck, type LucideIcon } from 'lucide-react'
import { EnterpriseDigitalTwin } from '@/components/home/enterprise-digital-twin/enterprise-digital-twin'

type StepKey = 'discover' | 'blueprint' | 'agents' | 'govern' | 'scale'

type Step = {
  key: StepKey
  label: string
  title: string
  copy: string
}

const STEPS: Step[] = [
  {
    key: 'discover',
    label: 'Discover',
    title: 'Discover AI Opportunities',
    copy: 'Identify high-value use cases, readiness gaps, and transformation priorities across the enterprise.',
  },
  {
    key: 'blueprint',
    label: 'Blueprint',
    title: 'Generate the Enterprise AI Blueprint',
    copy: 'Translate goals, maturity, data readiness, and business priorities into a practical 90-day AI roadmap.',
  },
  {
    key: 'agents',
    label: 'Agents',
    title: 'Deploy Agentic AI Systems',
    copy: 'Create specialist agents for strategy, architecture, governance, industry workflows, and operational execution.',
  },
  {
    key: 'govern',
    label: 'Govern',
    title: 'Govern Every AI Decision',
    copy: 'Embed approvals, risk controls, human-in-the-loop review, audit trails, and policy checks from day one.',
  },
  {
    key: 'scale',
    label: 'Scale',
    title: 'Scale AI Operations Globally',
    copy: 'Move from pilots to managed AI operations across teams, regions, platforms, and business units.',
  },
]

const TOTAL = STEPS.length

export function AppleScrollStorySection() {
  const [enhanced, setEnhanced] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReduced(reduce.matches)
      setEnhanced(wide.matches && !reduce.matches)
    }
    update()
    wide.addEventListener('change', update)
    reduce.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      reduce.removeEventListener('change', update)
    }
  }, [])

  return (
    <>
      <StoryIntro />
      {enhanced ? <PinnedStory /> : <StackedStory reduced={reduced} />}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Intro header (second-chapter transition)                                    */
/* -------------------------------------------------------------------------- */

function StoryIntro() {
  return (
    <section className="bg-background pt-20 pb-8 md:pt-28 md:pb-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">The GFF AI System</p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-navy md:text-5xl">
          From Discovery to Scaled AI Operations
        </h2>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Scroll through the five layers of enterprise AI transformation.
        </p>
      </div>
    </section>
  )
}

/* ========================================================================== */
/* Enhanced — pinned, scroll-scrubbed                                          */
/* ========================================================================== */

function PinnedStory() {
  const outerRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  useMotionValueEvent(progress, 'change', (p) => {
    const next = Math.min(TOTAL - 1, Math.max(0, Math.floor(p * TOTAL)))
    setActive((prev) => (prev === next ? prev : next))
  })

  const ctaOpacity = useTransform(progress, [0.84, 0.94], [0, 1])
  const ctaPointer = useTransform(progress, (p) => (p > 0.86 ? 'auto' : 'none'))

  return (
    <section ref={outerRef} aria-label="The GFF AI transformation system" className="relative h-[460vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-[32rem] w-[32rem] rounded-full bg-brand-blue/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-[30rem] w-[30rem] rounded-full bg-brand-purple/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[44%_56%] lg:px-10">
          {/* -------------------------------- Copy -------------------------------- */}
          <div className="relative z-10">
            <p className="mb-7 inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue shadow-brand-soft">
              AI Transformation System
            </p>

            <div className="grid grid-cols-[auto_1fr] items-start gap-6">
              <StepRail active={active} />
              <div className="relative min-h-[15rem]">
                {STEPS.map((step, i) => (
                  <StepText key={step.key} progress={progress} index={i} step={step} />
                ))}
              </div>
            </div>

            <motion.div style={{ opacity: ctaOpacity, pointerEvents: ctaPointer }} className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#talk-to-agent"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-medium text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-blue-hover"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Talk to GFF AI
              </Link>
              <Link
                href="#blueprint"
                className="glass-panel inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-navy shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Generate Blueprint
              </Link>
            </motion.div>
          </div>

          {/* ------------------------------- Visual ------------------------------- */}
          {/* No card, no panel — the twin floats directly in the section. */}
          <div className="relative flex justify-center">
            <EnterpriseDigitalTwin
              progress={progress}
              className="w-[min(34rem,48vw,70vh)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- Step rail ------------------------------- */

function StepRail({ active }: { active: number }) {
  return (
    <div className="relative flex flex-col gap-7 pl-1" role="list" aria-label="Story progress">
      <span aria-hidden className="absolute left-[6px] top-3 bottom-3 w-px bg-border" />
      {STEPS.map((step, i) => {
        const isActive = i === active
        const isDone = i < active
        return (
          <div key={step.key} role="listitem" className="relative flex items-center gap-3">
            <span
              className={`relative z-10 h-3.5 w-3.5 rounded-full transition-all duration-500 ${
                isActive ? 'bg-brand-blue ring-4 ring-brand-blue/15' : isDone ? 'bg-brand-blue/50' : 'bg-navy/15'
              }`}
            />
            <span className={`text-sm font-medium transition-colors duration-500 ${isActive ? 'text-navy' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------- Step text ------------------------------- */

function StepText({ progress, index, step }: { progress: MotionValue<number>; index: number; step: Step }) {
  const w = 1 / TOTAL
  const start = index * w
  const inAt = start + 0.25 * w
  const outAt = start + 0.75 * w
  const end = (index + 1) * w

  const stops = index === 0 ? [0, 0, outAt, end] : index === TOTAL - 1 ? [start, inAt, 1, 1] : [start, inAt, outAt, end]
  const values = index === 0 ? [1, 1, 1, 0] : index === TOTAL - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]

  const opacity = useTransform(progress, stops, values)
  const y = useTransform(progress, [start, inAt], [26, 0])
  const blur = useTransform(progress, [start, inAt], ['6px', '0px'])

  return (
    <motion.div style={{ opacity, y, filter: blur }} className="absolute inset-0">
      <h3 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-navy xl:text-5xl">{step.title}</h3>
      <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">{step.copy}</p>
    </motion.div>
  )
}

/* ========================================================================== */
/* Fallback — stacked, no pin (mobile + reduced motion)                        */
/* ========================================================================== */

const STACK_ICONS: Record<StepKey, LucideIcon> = {
  discover: Search,
  blueprint: FileText,
  agents: Blocks,
  govern: ShieldCheck,
  scale: Globe2,
}

/**
 * Mobile / reduced-motion path. No pin, no added scroll length: the twin sits
 * sticky above the stage cards and assembles from the list's own scroll, so the
 * story still reads without ever trapping the page.
 */
function StackedStory({ reduced }: { reduced: boolean }) {
  const visualRef = useRef<HTMLDivElement>(null)
  // Assembles as the visual travels up the viewport — no pin, no extra scroll
  // length, and the page is never trapped.
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start 85%', 'end 25%'] })
  const stacked = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section aria-label="The GFF AI transformation system" className="bg-background pb-16 md:pb-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        {/* The same digital twin, simplified — still no card around it. */}
        <div ref={visualRef} className="flex justify-center">
          {/* Reduced motion gets the settled, fully assembled state instead. */}
          <EnterpriseDigitalTwin
            compact
            progress={reduced ? undefined : stacked}
            className="w-[19rem] sm:w-[22rem]"
          />
        </div>

        {/* Five layers as cards */}
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => {
            const Icon = STACK_ICONS[step.key]
            return (
              <li key={step.key} className="flex gap-4 rounded-3xl border border-border bg-card p-6 shadow-brand-soft md:p-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
                    0{i + 1} · {step.label}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-navy md:text-2xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{step.copy}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#talk-to-agent"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-medium text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-blue-hover"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Talk to GFF AI
          </Link>
          <Link
            href="#blueprint"
            className="glass-panel inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-navy shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Generate Blueprint
          </Link>
        </div>
      </div>
    </section>
  )
}
