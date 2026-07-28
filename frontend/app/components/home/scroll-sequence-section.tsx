'use client'

/**
 * ScrollSequenceSection — the pinned homepage chapter (position two, directly
 * after the hero): the GFF AI Intelligence Forge.
 *
 * Desktop is a live, scroll-controlled 3D assembly (see intelligence-forge/):
 * one persistent machine whose construction state is a pure function of scroll
 * progress — blocks travel in, rails extend, blueprint layers separate,
 * housing and governance close around the core, and operational paths activate.
 * The five storyboard PNGs are art-direction references and remain only as the
 * mobile / reduced-motion fallback; there is no image crossfade on desktop.
 *
 * The canvas is transparent and borderless — atmosphere comes from full-width
 * CSS washes on the section itself, fading into the homepage background, so the
 * machine floats directly in the page.
 */

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { FORGE_STAGES, STAGE_BOUNDS, stageAt } from '@/components/home/intelligence-forge/scroll-stages'

// The 3D scene is client-only and loaded on demand; the layout below reserves
// its dimensions, so nothing shifts while the chunk loads.
const IntelligenceForgeScene = dynamic(
  () => import('@/components/home/intelligence-forge/intelligence-forge-scene'),
  { ssr: false },
)

export function ScrollSequenceSection() {
  const [enhanced, setEnhanced] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnhanced(wide.matches && !reduce.matches)
    update()
    wide.addEventListener('change', update)
    reduce.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      reduce.removeEventListener('change', update)
    }
  }, [])

  return enhanced ? <PinnedForge /> : <StackedStages />
}

/* ========================================================================== */
/* Enhanced — pinned live 3D assembly                                          */
/* ========================================================================== */

function PinnedForge() {
  const outerRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  // Text advances on construction events (STAGE_BOUNDS), not on equal fifths.
  useMotionValueEvent(progress, 'change', (p) => {
    const next = stageAt(p)
    setActive((prev) => (prev === next ? prev : next))
  })

  const stage = FORGE_STAGES[active]

  return (
    <section
      ref={outerRef}
      aria-label="How GFF AI moves enterprises from opportunity to scaled AI operations"
      className="relative bg-background"
      style={{ height: '500vh' }}
    >
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        {/* Full-section colour washes — behind text AND machine, fading into the
            homepage background. Never an overlay on the object itself. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {FORGE_STAGES.map((s, i) => (
            <WashLayer key={s.key} index={i} progress={progress} wash={s.wash} />
          ))}
        </div>

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[38%_62%] lg:gap-10 lg:px-10">
          {/* -------------------------------- Copy -------------------------------- */}
          <div className="relative z-10">
            <span className="mb-6 inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue shadow-brand-soft">
              The GFF AI System
            </span>
            <div className="relative min-h-[15rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">{stage.eyebrow}</p>
                  <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-navy xl:text-5xl">
                    {stage.heading}
                  </h2>
                  <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="mt-8 flex items-center gap-2.5" aria-hidden>
              {FORGE_STAGES.map((s, i) => (
                <span
                  key={s.key}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === active ? 'w-8 bg-brand-blue' : 'w-1.5 bg-navy/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* --------------------------- Live 3D machine --------------------------- */}
          {/* No card, no border, no panel — a transparent canvas in the section. */}
          <div className="relative aspect-[4/3] w-full max-h-[82vh]">
            <IntelligenceForgeScene progress={progress} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Full-width stage wash, crossfaded on the same construction boundaries. */
function WashLayer({ index, progress, wash }: { index: number; progress: MotionValue<number>; wash: string }) {
  const a = STAGE_BOUNDS[index]
  const b = STAGE_BOUNDS[index + 1]
  const band = 0.035
  const stops =
    index === 0
      ? [a, b - band, b + band]
      : index === FORGE_STAGES.length - 1
        ? [a - band, a + band, b]
        : [a - band, a + band, b - band, b + band]
  const values = index === 0 ? [1, 1, 0] : index === FORGE_STAGES.length - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  const opacity = useTransform(progress, stops, values)
  return <motion.div style={{ opacity, backgroundImage: wash }} className="absolute inset-0" />
}

/* ========================================================================== */
/* Fallback — stacked stages (mobile + reduced motion), storyboard keyframes   */
/* ========================================================================== */

function StackedStages() {
  const reduce = useReducedMotion()
  return (
    <section
      aria-label="How GFF AI moves enterprises from opportunity to scaled AI operations"
      className="bg-background"
    >
      {FORGE_STAGES.map((s, i) => (
        <div key={s.key} className="relative overflow-hidden py-20 md:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: s.wash }} />
          <div className="relative mx-auto flex max-w-3xl flex-col gap-6 px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">{s.eyebrow}</p>
              <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-navy md:text-4xl">
                {s.heading}
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {s.description}
              </p>
            </div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative aspect-[3/2] w-full"
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i < 2}
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-contain"
              />
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  )
}
