'use client'

/**
 * AgentArcCarousel — continuously rotating, fully controllable quarter-arc
 * carousel for Talk to GFF AI.
 *
 * ONE shared `phase` motion value is the single source of truth. It increases
 * continuously (`phase += dt / SECONDS_PER_SLOT × speed`) so the composition
 * never stops or sits in a stationary hold; every card derives its transform
 * from `rel = wrap(index − phase)` sampled on the same cubic Bézier
 * quarter-arc. There are no per-card timelines, timers, or random values.
 *
 * Speed model (smoothly lerped, never snapped):
 *   1.0  normal continuous rotation
 *   0.4  pointer inside the stage (easier targeting)
 *   0.12 hovering / keyboard-focus on a card (CTA stays usable)
 *   0    while dragging, during a manual go-to animation, and for a short
 *        grace period (1.5s) after a deliberate interaction
 * Motion also suspends off-viewport and on hidden tabs, resuming from the
 * current phase — never resetting.
 *
 * Manual control: prev/next arrows, five direct selector chips, click any
 * visible card, pointer drag / touch swipe with spring settling, and keyboard
 * (arrows / Home / End). Manual selection animates the phase along the
 * shortest cyclic route — the timeline is never restarted.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AGENT_DISPLAY, type AgentDisplay } from './agent-data'
import {
  AGENT_COUNT,
  AUTO_EASE,
  DRAG_PX_PER_SLOT,
  INTERACTION_GRACE_MS,
  SECONDS_PER_SLOT,
  SETTLE_SPRING,
  TRANSITION_S,
  slotFor,
  wrapRel,
} from './agent-arc-geometry'
import { AgentCardBody } from './moving-agent-card'

const mod = (n: number) => ((n % AGENT_COUNT) + AGENT_COUNT) % AGENT_COUNT

/* ========================================================================== */
/* Desktop arc carousel                                                        */
/* ========================================================================== */

export function AgentArcCarousel({
  online,
  onStart,
}: {
  online: boolean
  onStart: (id: AgentDisplay['id']) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const phase = useMotionValue(0)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [activeIndex, setActiveIndex] = useState(0)

  // Per-frame bookkeeping — refs only, never React state.
  const ctl = useRef({
    anim: null as ReturnType<typeof animate> | null,
    animActive: false,
    speed: 0, // current smoothed speed factor (starts at rest, eases in)
    lastInteraction: 0,
    pointerInside: false,
    cardHover: false,
    focusInside: false,
    dragging: false,
    dragStartPhase: 0,
    inView: true,
  })

  // Semantic active agent — updates only when the phase crosses a slot.
  useMotionValueEvent(phase, 'change', (p) => {
    const idx = mod(Math.round(p))
    setActiveIndex((prev) => (prev === idx ? prev : idx))
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const r = stage.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    const io = new IntersectionObserver(
      (entries) => {
        ctl.current.inView = entries.some((e) => e.isIntersecting)
      },
      { threshold: 0.01 },
    )
    io.observe(stage)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  const markInteraction = useCallback(() => {
    ctl.current.lastInteraction = Date.now()
  }, [])

  // THE motion model: one continuously increasing phase.
  useAnimationFrame((_, deltaMs) => {
    const c = ctl.current
    if (!c.inView || document.hidden || size.w === 0) return

    const inGrace = Date.now() - c.lastInteraction < INTERACTION_GRACE_MS
    const target =
      c.dragging || c.animActive || inGrace ? 0 : c.cardHover || c.focusInside ? 0.12 : c.pointerInside ? 0.4 : 1

    // Smooth speed changes (≈240ms response) so slow-downs never snap.
    c.speed += (target - c.speed) * Math.min(1, deltaMs / 240)

    if (c.speed > 0.002) {
      phase.set(phase.get() + (Math.min(64, deltaMs) / 1000 / SECONDS_PER_SLOT) * c.speed)
    }
  })

  /** Animate the shared phase to a target value along the arc. */
  const animatePhaseTo = useCallback(
    (target: number, spring = false) => {
      const c = ctl.current
      c.anim?.stop()
      c.animActive = true
      c.anim = animate(phase, target, {
        ...(spring ? SETTLE_SPRING : { type: 'tween' as const, duration: TRANSITION_S, ease: AUTO_EASE }),
        onComplete: () => {
          c.animActive = false
          c.lastInteraction = Date.now() // grace period starts when settled
        },
      })
    },
    [phase],
  )

  /** Bring a specific agent into the focus slot via the shortest arc route. */
  const goToIndex = useCallback(
    (index: number, spring = false) => {
      markInteraction()
      animatePhaseTo(Math.round(phase.get() + wrapRel(index, phase.get())), spring)
    },
    [animatePhaseTo, markInteraction, phase],
  )

  const step = useCallback(
    (dir: 1 | -1) => {
      markInteraction()
      animatePhaseTo(Math.round(phase.get()) + dir)
    },
    [animatePhaseTo, markInteraction, phase],
  )

  // Drag / swipe — cards follow the pointer through the arc, settle on release.
  const onPanStart = () => {
    const c = ctl.current
    c.anim?.stop()
    c.animActive = false
    c.dragging = true
    c.dragStartPhase = phase.get()
    markInteraction()
  }
  const onPan = (_: unknown, info: PanInfo) => {
    phase.set(ctl.current.dragStartPhase + (-info.offset.x - info.offset.y) / DRAG_PX_PER_SLOT)
  }
  const onPanEnd = (_: unknown, info: PanInfo) => {
    ctl.current.dragging = false
    markInteraction()
    const velocityBias = (-info.velocity.x - info.velocity.y) / (DRAG_PX_PER_SLOT * 8)
    animatePhaseTo(Math.round(phase.get() + Math.max(-0.5, Math.min(0.5, velocityBias))), true)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      step(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      goToIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      goToIndex(AGENT_COUNT - 1)
    }
  }

  const active = AGENT_DISPLAY[activeIndex]

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="GFF AI specialists"
        className="relative h-[640px] w-full cursor-grab overflow-hidden active:cursor-grabbing xl:h-[680px]"
        style={{
          touchAction: 'pan-y',
          maskImage: 'linear-gradient(to right, #000 0%, #000 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, #000 0%, #000 88%, transparent 100%)',
        }}
        onPanStart={onPanStart}
        onPan={onPan}
        onPanEnd={onPanEnd}
        onKeyDown={onKeyDown}
        onPointerEnter={() => (ctl.current.pointerInside = true)}
        onPointerLeave={() => {
          ctl.current.pointerInside = false
          ctl.current.cardHover = false
        }}
        onFocusCapture={() => (ctl.current.focusInside = true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) ctl.current.focusInside = false
        }}
      >
        {size.w > 0 &&
          AGENT_DISPLAY.map((agent, i) => (
            <ArcCard
              key={agent.id}
              agent={agent}
              index={i}
              phase={phase}
              size={size}
              isActive={i === activeIndex}
              online={online}
              onStart={onStart}
              onHover={(h) => (ctl.current.cardHover = h)}
              onSelect={() => {
                if (i !== activeIndex) goToIndex(i)
              }}
            />
          ))}
      </motion.div>

      {/* Selected-agent announcement for assistive tech only. */}
      <span aria-live="polite" className="sr-only">
        {active.name} selected
      </span>

      {/* Controls: prev / selector chips / next */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous agent"
          onClick={() => step(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/85 text-navy transition-colors hover:border-brand-blue/40 hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Choose an agent">
          {AGENT_DISPLAY.map((agent, i) => (
            <button
              key={agent.id}
              type="button"
              aria-current={i === activeIndex ? 'true' : undefined}
              onClick={() => goToIndex(i)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue',
                i === activeIndex
                  ? 'border-transparent text-white'
                  : 'border-border bg-white/85 text-muted-foreground hover:text-navy',
              )}
              style={i === activeIndex ? { backgroundColor: agent.accent } : undefined}
            >
              {agent.name.replace(' Agent', '').replace(' Advisor', '')}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next agent"
          onClick={() => step(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/85 text-navy transition-colors hover:border-brand-blue/40 hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------- Arc card -------------------------------- */

function ArcCard({
  agent,
  index,
  phase,
  size,
  isActive,
  online,
  onStart,
  onHover,
  onSelect,
}: {
  agent: AgentDisplay
  index: number
  phase: ReturnType<typeof useMotionValue<number>>
  size: { w: number; h: number }
  isActive: boolean
  online: boolean
  onStart: (id: AgentDisplay['id']) => void
  onHover: (hovering: boolean) => void
  onSelect: () => void
}) {
  const x = useTransform(phase, (p) => slotFor(wrapRel(index, p)).x * size.w)
  const y = useTransform(phase, (p) => slotFor(wrapRel(index, p)).y * size.h)
  const scale = useTransform(phase, (p) => slotFor(wrapRel(index, p)).scale)
  const opacity = useTransform(phase, (p) => slotFor(wrapRel(index, p)).opacity)
  const zIndex = useTransform(phase, (p) => slotFor(wrapRel(index, p)).zIndex)
  const rotateZ = useTransform(phase, (p) => slotFor(wrapRel(index, p)).rotateZ)

  return (
    <motion.div
      className="absolute left-0 top-0 will-change-transform"
      style={{ x, y, scale, opacity, zIndex, rotateZ, translateX: '-50%', translateY: '-50%' }}
      onClick={onSelect}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <div
        className={cn(
          'rounded-[24px] transition-shadow duration-300',
          isActive ? 'shadow-[0_18px_50px_rgba(7,22,47,0.16)] ring-1 ring-navy/10' : 'cursor-pointer',
        )}
      >
        <AgentCardBody agent={agent} online={online} onStart={onStart} />
      </div>
    </motion.div>
  )
}

/* ========================================================================== */
/* Simple carousel — mobile, tablet portrait and reduced-motion               */
/* ========================================================================== */

export function SimpleAgentCarousel({
  online,
  onStart,
}: {
  online: boolean
  onStart: (id: AgentDisplay['id']) => void
}) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const step = (dir: 1 | -1) => setIndex((i) => mod(i + dir))
  const agent = AGENT_DISPLAY[index]

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        key={agent.id}
        initial={reduceMotion ? false : { opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
        drag={reduceMotion ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) step(1)
          else if (info.offset.x > 60) step(-1)
        }}
      >
        <AgentCardBody agent={agent} online={online} onStart={onStart} variant="stacked" />
      </motion.div>

      <span aria-live="polite" className="sr-only">
        {agent.name} selected
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous agent"
          onClick={() => step(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose an agent">
          {AGENT_DISPLAY.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-label={a.name}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setIndex(i)}
              className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <span
                className="h-2 w-2 rounded-full transition-all"
                style={{ backgroundColor: i === index ? a.accent : 'rgba(7,22,47,0.18)', transform: i === index ? 'scale(1.35)' : undefined }}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next agent"
          onClick={() => step(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/85 text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
