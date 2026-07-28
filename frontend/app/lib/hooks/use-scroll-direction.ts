'use client'

import { useEffect, useState } from 'react'

export type NavbarScrollState = 'top' | 'hidden' | 'pill'

/**
 * Direction-aware navbar state (Academy-style):
 *
 *   'top'    — scrollY <= topThreshold: bar integrated with the hero.
 *   'hidden' — below the threshold and the last meaningful scroll was
 *              downward: bar slides fully above the viewport.
 *   'pill'   — below the threshold and the last meaningful scroll was
 *              upward: bar returns as a floating pill.
 *
 * Movements smaller than `delta` are ignored to avoid jitter; scroll events
 * are coalesced through requestAnimationFrame; Safari rubber-band overscroll
 * is clamped to 0. Pass a changing `resetKey` (e.g. the pathname) to
 * re-evaluate after route changes — a restored deep scroll position starts
 * visible ('pill'), never hidden.
 */
export function useScrollDirection({
  topThreshold = 12,
  delta = 8,
  resetKey,
}: {
  topThreshold?: number
  delta?: number
  resetKey?: string
} = {}): NavbarScrollState {
  const [state, setState] = useState<NavbarScrollState>('top')

  useEffect(() => {
    let lastY = Math.max(0, window.scrollY)
    let raf = 0
    // Grace window after mount/route change: browser scroll restoration fires
    // programmatic scrolls that must not read as "user scrolled down".
    const graceUntil = performance.now() + 600

    setState(lastY <= topThreshold ? 'top' : 'pill')

    const measure = () => {
      raf = 0
      const y = Math.max(0, window.scrollY)
      if (y <= topThreshold) {
        lastY = y
        setState('top')
        return
      }
      if (performance.now() < graceUntil) {
        lastY = y
        setState('pill')
        return
      }
      const diff = y - lastY
      if (Math.abs(diff) < delta) return
      lastY = y
      setState(diff > 0 ? 'hidden' : 'pill')
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [topThreshold, delta, resetKey])

  return state
}
