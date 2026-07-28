'use client'

/**
 * Stage 1 — Discover, plus the persistent intelligence core.
 *
 * The core is the one element that exists at every scroll position: it is never
 * unmounted, never re-entered, and never moves off the viewBox centre. Discover
 * only adds the things that feed it — a few streams, a handful of motes, and one
 * slow scanning pass.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { C, CORE_HEX, CORE_HEX_INNER, PARTICLES, STREAMS, streamPath, type Stream } from './digital-twin-data'
import styles from './enterprise-digital-twin.module.css'

/**
 * Everything Discover *adds* around the core. Rendered beneath the architecture
 * so the later layers stack cleanly on top of it.
 */
export function DiscoverField({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  // The scanning pass: one slow outward sweep, scrubbed by scroll so it rewinds.
  const scanRadius = useTransform(progress, [0.02, 0.18], [34, 168])
  const scanOpacity = useTransform(progress, [0.02, 0.06, 0.14, 0.19], [0, 0.42, 0.24, 0])

  const motes = compact ? PARTICLES.slice(0, 2) : PARTICLES

  return (
    <>
      {/* Incoming data — loose at Discover, straightened by Blueprint. */}
      {STREAMS.map((stream, i) => (
        <DataStream key={i} stream={stream} index={i} progress={progress} />
      ))}

      {/* Drifting motes: deliberately four, deliberately faint. */}
      <MoteField progress={progress} motes={motes} />

      {/* Scanning ring */}
      <motion.circle
        cx={C}
        cy={C}
        r={scanRadius}
        fill="none"
        stroke="#155dfc"
        strokeWidth="0.9"
        style={{ opacity: scanOpacity }}
      />
    </>
  )
}

/**
 * The persistent intelligence core. Rendered last, so it is always the top of the
 * visual hierarchy, and always at the same point on screen.
 */
export function DigitalTwinCore({ progress }: { progress: MotionValue<number> }) {
  // The core grows once — Blueprint promotes it from "a signal" to "the hub".
  const coreScale = useTransform(progress, [0.2, 0.34], [1, 1.07])
  // A 7° settle across the whole story, never a continuous spin.
  const coreRotate = useTransform(progress, [0, 1], [0, 7])
  const coreGlow = useTransform(progress, [0, 0.2, 0.8, 1], [0.5, 0.62, 0.72, 1])
  const coreEdge = useTransform(progress, [0, 0.2], [0.55, 0.9])

  return (
    <>
      {/* Core glow — the only element that keeps breathing once assembled. */}
      <motion.g style={{ opacity: coreGlow }}>
        <circle className={styles.breathe} cx={C} cy={C} r={92} fill="url(#dtCoreGlow)" />
      </motion.g>

      {/* Core */}
      <motion.g style={{ scale: coreScale, rotate: coreRotate }}>
        <polygon points={CORE_HEX} fill="url(#dtCoreFill)" />
        <motion.polygon
          points={CORE_HEX}
          fill="none"
          stroke="url(#dtCoreStroke)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          style={{ opacity: coreEdge }}
        />
        <polygon points={CORE_HEX_INNER} fill="none" stroke="#155dfc" strokeOpacity="0.4" strokeWidth="0.9" strokeLinejoin="round" />
        <circle cx={C} cy={C} r={7} fill="url(#dtCoreStroke)" opacity="0.9" />
      </motion.g>
    </>
  )
}

/* -------------------------------------------------------------------------- */

function DataStream({ stream, index, progress }: { stream: Stream; index: number; progress: MotionValue<number> }) {
  // Blueprint does two things to every stream, both by interpolating numbers, so
  // both reverse exactly: it pulls the bowed control point onto the chord
  // (loose information becoming an organized pathway), and it retracts the far
  // end inward so the pathways stay inside the architecture instead of running
  // across the whole frame.
  const bow = useTransform(progress, [0.2, 0.36], [1, 0])
  const reach = useTransform(progress, [0.2, 0.4], [1, 0.52])

  const d = useTransform([bow, reach], ([b, r]: number[]) => {
    const sx = C + (stream.sx - C) * r
    const sy = C + (stream.sy - C) * r
    const mx = (sx + stream.ex) / 2
    const my = (sy + stream.ey) / 2
    return streamPath(
      { ...stream, sx, sy },
      mx + (stream.loose[0] - stream.straight[0]) * b * r,
      my + (stream.loose[1] - stream.straight[1]) * b * r,
    )
  })

  // Loud during Discover, then quiet — they stay, they just stop competing.
  const opacity = useTransform(progress, [0, 0.04, 0.2, 0.4], [0, 0.7, 0.7, 0.22])
  const signalOpacity = useTransform(progress, [0.02, 0.08, 0.4, 0.55], [0, 0.9, 0.9, 0.3])

  return (
    <>
      <motion.path d={d} fill="none" stroke="#155dfc" strokeWidth="0.9" strokeLinecap="round" style={{ opacity }} />
      <motion.path
        className={styles.signal}
        d={d}
        pathLength={100}
        fill="none"
        stroke="#155dfc"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ opacity: signalOpacity, animationDelay: `${index * 1.5}s` }}
      />
    </>
  )
}

function MoteField({ progress, motes }: { progress: MotionValue<number>; motes: typeof PARTICLES }) {
  // Present while the system is still gathering; they settle away once there is
  // an architecture to be part of.
  const opacity = useTransform(progress, [0, 0.05, 0.24, 0.42], [0, 1, 1, 0])
  return (
    <motion.g style={{ opacity }}>
      {motes.map((p, i) => (
        <circle
          key={i}
          className={styles.mote}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill="#155dfc"
          opacity="0.4"
          style={{ animationDelay: `${p.delay}s` }}
        />
      ))}
    </motion.g>
  )
}
