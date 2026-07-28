'use client'

/**
 * The Enterprise AI Digital Twin.
 *
 * One persistent object that gains a layer per scroll stage — it is never torn
 * down and rebuilt:
 *
 *   Discover   0–20%   a luminous core drawing in raw information
 *   Blueprint  20–40%  three architectural planes unfold around it
 *   Agents     40–60%  five specialists activate and connect inward
 *   Governance 60–80%  a glass containment boundary encloses the system
 *   Scale      80–100% the governed system connects out to the enterprise
 *
 * A single normalized scroll value (0 → 1) drives every layer through Framer
 * motion values, so nothing is stateful, nothing re-renders per frame, and
 * scrolling upward runs the exact same interpolations backwards.
 *
 * The object floats directly in the section background — there is no card, no
 * panel, no border, and no text anywhere inside it.
 */

import { useEffect, useRef, useState, type RefObject } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { VIEW } from './digital-twin-data'
import { DigitalTwinCore, DiscoverField } from './digital-twin-core'
import { ArchitecturePlanes } from './architecture-planes'
import { AgentNodes } from './agent-nodes'
import { GovernanceBoundary } from './governance-boundary'
import { ScaleEndpoints } from './scale-endpoints'
import styles from './enterprise-digital-twin.module.css'

type Props = {
  /**
   * Normalized scroll progress for the pinned section. Omit to render the
   * finished, calm state (used by the non-pinned fallback).
   */
  progress?: MotionValue<number>
  /** Reduced depth and half the endpoints, for short/narrow frames. */
  compact?: boolean
  className?: string
}

export function EnterpriseDigitalTwin({ progress, compact = false, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const active = useAmbientMotion(hostRef)

  // Fallback source keeps the hook order stable when no scroll driver is passed.
  const settled = useMotionValue(1)
  const p = progress ?? settled

  // The whole structure expands 13% as it completes, and the camera drifts by
  // ~3% of the frame — enough to feel alive, never enough to move the core.
  const groupScale = useTransform(p, [0, 0.8, 1], [0.88, 0.9, 1])
  const groupY = useTransform(p, [0, 0.5, 1], [0, -6, -13])
  const atmosphere = useTransform(p, [0, 0.4, 0.8, 1], [0.35, 0.5, 0.6, 0.9])

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={[styles.host, active ? '' : styles.paused, className].filter(Boolean).join(' ')}
    >
      <svg className={styles.stage} viewBox={`0 0 ${VIEW} ${VIEW}`} fill="none" focusable="false">
        <TwinDefs />

        {/* Borderless atmosphere — the only thing behind the object. */}
        <motion.circle cx={VIEW / 2} cy={VIEW / 2} r={VIEW / 2} fill="url(#dtAtmosphere)" style={{ opacity: atmosphere }} />

        <motion.g style={{ scale: groupScale, y: groupY }}>
          <DiscoverField progress={p} compact={compact} />
          <ArchitecturePlanes progress={p} compact={compact} />
          <AgentNodes progress={p} compact={compact} />
          <GovernanceBoundary progress={p} compact={compact} />
          <ScaleEndpoints progress={p} compact={compact} />
          {/* Last, and therefore always on top. */}
          <DigitalTwinCore progress={p} />
        </motion.g>
      </svg>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * Ambient (CSS) motion runs only while the object is near the viewport and the
 * tab is visible. Returns false to have the host apply `animation-play-state:
 * paused`, which costs nothing and needs no cleanup beyond the observer itself.
 */
function useAmbientMotion(ref: RefObject<HTMLDivElement | null>) {
  const [visible, setVisible] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '200px 0px',
    })
    observer.observe(node)

    const onVisibility = () => setTabVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ref])

  return visible && tabVisible
}

/* -------------------------------------------------------------------------- */
/* Paint: gradients only — no SVG filters, which are the expensive part.        */
/* -------------------------------------------------------------------------- */

function TwinDefs() {
  return (
    <defs>
      <radialGradient id="dtAtmosphere">
        <stop offset="0%" stopColor="#155dfc" stopOpacity="0.14" />
        <stop offset="45%" stopColor="#a855f7" stopOpacity="0.07" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
      </radialGradient>

      <radialGradient id="dtCoreGlow">
        <stop offset="0%" stopColor="#155dfc" stopOpacity="0.34" />
        <stop offset="55%" stopColor="#a855f7" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
      </radialGradient>

      <linearGradient id="dtCoreFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#dbe6ff" stopOpacity="0.85" />
      </linearGradient>

      <linearGradient id="dtCoreStroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#155dfc" />
        <stop offset="60%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ef233c" />
      </linearGradient>

      <linearGradient id="dtPlaneFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#155dfc" stopOpacity="0.07" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.04" />
      </linearGradient>

      <linearGradient id="dtPlaneStroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#155dfc" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.55" />
      </linearGradient>

      <radialGradient id="dtNodeGlow">
        <stop offset="0%" stopColor="#155dfc" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#155dfc" stopOpacity="0" />
      </radialGradient>

      <linearGradient id="dtNodeFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e6edff" />
      </linearGradient>

      <radialGradient id="dtGovFill">
        <stop offset="70%" stopColor="#155dfc" stopOpacity="0" />
        <stop offset="100%" stopColor="#155dfc" stopOpacity="0.06" />
      </radialGradient>

      <linearGradient id="dtGovStroke" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.42" />
        <stop offset="50%" stopColor="#155dfc" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.38" />
      </linearGradient>

      <linearGradient id="dtSweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#155dfc" stopOpacity="0" />
        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#155dfc" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}
