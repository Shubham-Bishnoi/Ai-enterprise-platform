'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { initAttribution } from '@/lib/attribution'
import { trackEvent } from '@/lib/api/analytics'

/**
 * Site-wide analytics bootstrap. Renders nothing and never blocks paint:
 * - captures first-touch UTM/referrer once per session,
 * - records one `page_viewed` per route change (`session_started` is emitted
 *   automatically by trackEvent when a new session begins).
 *
 * The ref guard keeps React strict-mode double effects from double-counting;
 * the server-side event_id idempotency backs it up.
 */
export function AttributionInit() {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    initAttribution()
  }, [])

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) return
    lastTracked.current = pathname
    trackEvent({ eventName: 'page_viewed', source: 'website', component: 'AttributionInit' })
  }, [pathname])

  return null
}
