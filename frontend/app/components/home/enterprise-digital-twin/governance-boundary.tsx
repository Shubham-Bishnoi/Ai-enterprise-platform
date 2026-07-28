'use client'

/**
 * Stage 4 — Governance.
 *
 * A thin glass containment boundary draws itself around everything that already
 * exists, plus one verification sweep that passes through the object once. The
 * meaning comes from containment and validated movement — no shield, no padlock,
 * no badge, no compliance text.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { C, GOVERNANCE_PATH, GOVERNANCE_TICKS } from './digital-twin-data'

export function GovernanceBoundary({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  // The boundary draws once and then stays for the rest of the story.
  const draw = useTransform(progress, [0.61, 0.74], [0, 1])
  const opacity = useTransform(progress, [0.61, 0.66], [0, 1])
  const fill = useTransform(progress, [0.64, 0.78], [0, 1])
  const ticks = useTransform(progress, [0.68, 0.78], [0, 0.45])

  // A single verification pass sweeps down through the system, scroll-scrubbed.
  const sweepY = useTransform(progress, [0.66, 0.78], [C - 170, C + 170])
  const sweepOpacity = useTransform(progress, [0.66, 0.7, 0.75, 0.78], [0, 0.5, 0.35, 0])

  // The verification light: a brief confirmation at the core, then gone.
  const verifyOpacity = useTransform(progress, [0.74, 0.77, 0.8, 0.83], [0, 0.8, 0.5, 0])
  const verifyScale = useTransform(progress, [0.74, 0.83], [0.7, 1.25])

  return (
    <>
      {/* Containment surface — encloses without hiding what is inside. */}
      <motion.path d={GOVERNANCE_PATH} fill="url(#dtGovFill)" style={{ opacity: fill }} />

      <motion.path
        d={GOVERNANCE_PATH}
        fill="none"
        stroke="url(#dtGovStroke)"
        strokeWidth={compact ? 1.4 : 1.2}
        strokeLinejoin="round"
        style={{ pathLength: draw, opacity }}
      />

      {/* Structural ticks give the boundary its architectural, framed reading. */}
      <motion.g style={{ opacity: ticks }}>
        {GOVERNANCE_TICKS.map((d, i) => (
          <path key={i} d={d} stroke="#155dfc" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        ))}
      </motion.g>

      {/* Verification sweep */}
      <motion.g style={{ opacity: sweepOpacity, y: sweepY }}>
        <rect x={C - 180} y={-3} width={360} height={6} fill="url(#dtSweep)" />
      </motion.g>

      {/* Verification light */}
      <motion.circle
        cx={C}
        cy={C}
        r={58}
        fill="none"
        stroke="#a855f7"
        strokeWidth="1.2"
        style={{ opacity: verifyOpacity, scale: verifyScale }}
      />
    </>
  )
}
