'use client'

import { useEffect } from 'react'
import { initAttribution } from '@/lib/attribution'

/** Captures first-touch UTM/referrer once per session. Renders nothing. */
export function AttributionInit() {
  useEffect(() => {
    initAttribution()
  }, [])
  return null
}
