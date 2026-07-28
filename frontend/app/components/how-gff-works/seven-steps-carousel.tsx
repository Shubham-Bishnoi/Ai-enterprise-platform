'use client'

/**
 * EngineeringStepsCarousel ("Seven engineering steps") — a continuously
 * drifting belt of compact, image-led cards. The belt moves slowly leftward
 * (cards exit left, new ones enter from the right in an endless loop built
 * from a duplicated slide set) and pauses whenever the user hovers the
 * section, touches it, or focuses a control. Prev/next buttons, seven
 * labelled progress dots, a "0X / 07" counter and Left/Right keyboard support
 * remain fully functional; a rAF-throttled scroll listener keeps the card
 * nearest the viewport centre as the active reading card. Under reduced
 * motion the belt never auto-moves and a single, finite slide set is shown.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SEVEN_STEPS } from '@/data/methodology'

const TOTAL = SEVEN_STEPS.length
/** Belt drift in px/s — slow enough to read while cards pass. */
const DRIFT_SPEED = 32
/** After a tap/click interaction, wait this long before drifting again. */
const INTERACTION_GRACE_MS = 2000

export function SevenStepsCarousel() {
  const scrollerRef = useRef<HTMLOListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const hoverRef = useRef(false)
  const touchRef = useRef(false)
  const focusRef = useRef(false)
  const interactUntilRef = useRef(0)
  const [activeAbs, setActiveAbs] = useState(0)
  const [reduced, setReduced] = useState(false)

  // Two copies of the steps make the loop seamless; reduced motion gets the
  // plain finite set.
  const slides = reduced ? SEVEN_STEPS : [...SEVEN_STEPS, ...SEVEN_STEPS]
  const active = activeAbs % TOTAL

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Active card = the slide whose centre is nearest the scroller's centre.
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let raf = 0
    const measure = () => {
      raf = 0
      const sr = scroller.getBoundingClientRect()
      const centre = sr.left + sr.width / 2
      let best = 0
      let bestDist = Infinity
      slideRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.left + r.width / 2 - centre)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActiveAbs((prev) => (prev === best ? prev : best))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    measure()
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Continuous slow drift with a seamless wrap over the duplicated set.
  useEffect(() => {
    if (reduced) return
    const scroller = scrollerRef.current
    if (!scroller) return
    let raf = 0
    let last = performance.now()
    let pos = scroller.scrollLeft

    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      const loopWidth =
        slideRefs.current[TOTAL] && slideRefs.current[0]
          ? slideRefs.current[TOTAL]!.offsetLeft - slideRefs.current[0]!.offsetLeft
          : 0
      const paused =
        hoverRef.current || touchRef.current || focusRef.current || now < interactUntilRef.current

      // Adopt external position changes (drag, flick, smooth goTo).
      if (Math.abs(scroller.scrollLeft - pos) > 1.5) pos = scroller.scrollLeft

      if (!paused && loopWidth > 0) {
        pos += (DRIFT_SPEED * dt) / 1000
        if (pos >= loopWidth) pos -= loopWidth
        scroller.scrollLeft = pos
      } else if (loopWidth > 0 && scroller.scrollLeft >= loopWidth) {
        // Wrap silently even while paused — the clone set is pixel-identical.
        scroller.scrollLeft -= loopWidth
        pos = scroller.scrollLeft
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const goTo = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current
      const slide = slideRefs.current[index]
      if (!scroller || !slide) return
      interactUntilRef.current = performance.now() + INTERACTION_GRACE_MS
      const sr = scroller.getBoundingClientRect()
      const cr = slide.getBoundingClientRect()
      const slideLeft = scroller.scrollLeft + (cr.left - sr.left)
      const left =
        window.innerWidth < 640
          ? slideLeft - 16
          : slideLeft - (scroller.clientWidth - cr.width) / 2
      scroller.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced],
  )

  const maxIndex = slides.length - 1
  const step = (dir: 1 | -1) => goTo(Math.min(maxIndex, Math.max(0, activeAbs + dir)))
  // Dots target the instance of that step nearest the current position.
  const goToStep = (stepIndex: number) => {
    if (reduced) return goTo(stepIndex)
    const inFirstSet = stepIndex + (activeAbs >= TOTAL ? TOTAL : 0)
    const candidates = [stepIndex, stepIndex + TOTAL, inFirstSet]
    const target = candidates.reduce((best, c) =>
      Math.abs(c - activeAbs) < Math.abs(best - activeAbs) ? c : best,
    )
    goTo(target)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    }
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Seven engineering steps"
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'touch') hoverRef.current = true
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'touch') hoverRef.current = false
      }}
      onTouchStart={() => {
        touchRef.current = true
      }}
      onTouchEnd={() => {
        touchRef.current = false
        interactUntilRef.current = performance.now() + INTERACTION_GRACE_MS
      }}
      onFocusCapture={() => {
        focusRef.current = true
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) focusRef.current = false
      }}
      className="flex flex-col gap-6"
    >
      {/* Viewport with desktop-only edge fade */}
      <div className="lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_6%,#000_94%,transparent_100%)]">
        <ol
          ref={scrollerRef}
          className="no-scrollbar seven-steps-scroller -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-6 sm:px-0"
          style={{ scrollBehavior: reduced ? 'auto' : undefined }}
        >
          {slides.map((s, i) => {
            const isClone = i >= TOTAL
            const dist = Math.abs(i - activeAbs)
            return (
              <li
                key={`${s.number}-${isClone ? 'b' : 'a'}`}
                ref={(el) => {
                  slideRefs.current[i] = el
                }}
                aria-current={!isClone && i === activeAbs ? 'step' : undefined}
                aria-hidden={isClone || undefined}
                className={cn(
                  'flex w-[calc(100vw-64px)] shrink-0 flex-col rounded-[26px] border border-[#DBE4F5] bg-white p-3 sm:w-[380px] lg:w-[clamp(320px,26.5vw,380px)]',
                  !reduced && 'transition-[opacity,transform,box-shadow] duration-300',
                  dist === 0 ? 'opacity-100 shadow-[0_16px_44px_rgba(7,22,47,0.1)]' : dist === 1 ? 'opacity-80' : 'opacity-40',
                  !reduced && dist > 0 && 'scale-[0.97]',
                )}
                onClick={() => {
                  if (i !== activeAbs) goTo(i)
                }}
              >
                {/* Compact top row: step label + per-step progress */}
                <div className="flex items-center justify-between px-2.5 pb-2 pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy">
                    Step{' '}
                    <span className="bg-gradient-to-r from-brand-blue to-brand-coral bg-clip-text text-transparent">
                      {String(s.number).padStart(2, '0')}
                    </span>
                  </p>
                  <p className="text-[11px] font-medium tabular-nums text-muted-foreground">
                    {String(s.number).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
                  </p>
                </div>
                {/* Rounded image frame (~40% of card height) */}
                <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-[16px] bg-[#EEF3FC] lg:h-[190px]">
                  <Image
                    src={s.image}
                    alt={isClone ? '' : s.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 27vw, (min-width: 640px) 380px, 88vw"
                    className="object-cover"
                    style={{ objectPosition: s.imagePosition }}
                  />
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 px-2.5 pb-1.5 pt-3.5">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-navy">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <p className="mt-auto border-t border-border pt-3 text-[13.5px] font-medium leading-snug text-brand-blue">
                    {s.takeaway}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous step"
          disabled={activeAbs === 0}
          onClick={() => step(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-navy transition-colors hover:border-brand-blue/40 hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" role="group" aria-label="Step progress">
          {SEVEN_STEPS.map((s, i) => (
            <button
              key={s.number}
              type="button"
              aria-label={`Go to step ${s.number}: ${s.title}`}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => goToStep(i)}
              className="flex h-8 w-6 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === active ? 'h-2 w-5 bg-brand-blue' : 'h-2 w-2 bg-navy/20',
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next step"
          disabled={activeAbs === maxIndex}
          onClick={() => step(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-navy transition-colors hover:border-brand-blue/40 hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}
