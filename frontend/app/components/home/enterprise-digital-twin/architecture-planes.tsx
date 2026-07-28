'use client'

/**
 * Stage 2 — Blueprint.
 *
 * Three transparent planes unfold *out of* the core rather than flying in from
 * off-screen: each starts collapsed at the centre line and slides to its final
 * offset (data foundation below, intelligence at the core, application above).
 * Reversing the scroll folds them back into the core along the same path.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { BLUEPRINT_GRID, PLANES } from './digital-twin-data'

export function ArchitecturePlanes({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  // The blueprint rules flash while the structure resolves, then mostly recede.
  const gridOpacity = useTransform(progress, [0.2, 0.28, 0.38, 0.48], [0, 0.55, 0.3, 0.1])

  return (
    <>
      <motion.g style={{ opacity: gridOpacity }}>
        {BLUEPRINT_GRID.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#155dfc" strokeWidth="0.5" strokeDasharray="3 5" />
        ))}
      </motion.g>

      {PLANES.map((plane, i) => (
        <Plane key={plane.id} plane={plane} index={i} progress={progress} compact={compact} />
      ))}
    </>
  )
}

function Plane({
  plane,
  index,
  progress,
  compact,
}: {
  plane: (typeof PLANES)[number]
  index: number
  progress: MotionValue<number>
  compact: boolean
}) {
  // Staggered unfold, ~0.05 of scroll apart — reads as one controlled motion.
  const start = 0.21 + index * 0.045
  const end = start + 0.13

  const opacity = useTransform(progress, [start, start + 0.06], [0, 1])
  // Slide from the core plane out to the layer's own offset.
  const y = useTransform(progress, [start, end], [-plane.offset * (compact ? 0.6 : 1), 0])
  const scale = useTransform(progress, [start, end], [0.62, 1])
  // Scale locks the planes into precise alignment at the very end.
  const align = useTransform(progress, [0.8, 0.95], [1, 1.03])
  const edge = useTransform(progress, [start + 0.06, 0.6, 0.95], [0.5, 0.42, 0.6])

  // Compact viewports flatten the stack so the object keeps its silhouette in
  // a shorter frame.
  const compactY = useTransform(y, (v) => (compact ? v - plane.offset * 0.4 : v))

  return (
    <motion.g style={{ opacity, y: compactY, scale, transformBox: 'fill-box', transformOrigin: 'center' }}>
      <motion.g style={{ scale: align, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d={plane.path} fill="url(#dtPlaneFill)" />
        <motion.path
          d={plane.path}
          fill="none"
          stroke="url(#dtPlaneStroke)"
          strokeWidth="1.1"
          strokeLinejoin="round"
          style={{ opacity: edge }}
        />
      </motion.g>
    </motion.g>
  )
}
