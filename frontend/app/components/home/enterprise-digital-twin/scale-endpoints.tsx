'use client'

/**
 * Stage 5 — Scale.
 *
 * The governed system reaches outward: up to eight enterprise endpoints connect
 * to the boundary and exchange occasional signals in both directions. This is the
 * only stage where the object is complete, and it stays calm once it gets there.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { COMPACT_ENDPOINTS, ENDPOINTS, type Endpoint } from './digital-twin-data'
import styles from './enterprise-digital-twin.module.css'

export function ScaleEndpoints({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  const endpoints = compact ? COMPACT_ENDPOINTS : ENDPOINTS
  return (
    <>
      {endpoints.map((endpoint, i) => (
        <EndpointNode key={endpoint.id} endpoint={endpoint} index={i} total={endpoints.length} progress={progress} />
      ))}
    </>
  )
}

function EndpointNode({
  endpoint,
  index,
  total,
  progress,
}: {
  endpoint: Endpoint
  index: number
  total: number
  progress: MotionValue<number>
}) {
  // Spread the arrivals across the Scale window so the ring resolves in order
  // rather than popping in as a set.
  const start = 0.8 + (index / total) * 0.1
  const end = start + 0.07

  const draw = useTransform(progress, [start, end], [0, 1])
  const linkOpacity = useTransform(progress, [start, start + 0.02], [0, 0.4])
  const nodeOpacity = useTransform(progress, [start + 0.03, end], [0, 1])
  const nodeScale = useTransform(progress, [start + 0.03, end], [0.3, 1])
  const signalOpacity = useTransform(progress, [end, end + 0.03], [0, 0.85])

  return (
    <>
      <motion.path
        d={endpoint.link}
        fill="none"
        stroke="#155dfc"
        strokeWidth="0.9"
        strokeLinecap="round"
        style={{ pathLength: draw, opacity: linkOpacity }}
      />

      {/* Signals run outward on even links and inward on odd ones. */}
      <motion.path
        className={index % 2 === 0 ? styles.signalOut : styles.signal}
        d={endpoint.link}
        pathLength={100}
        fill="none"
        stroke={index % 3 === 0 ? '#a855f7' : '#155dfc'}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ opacity: signalOpacity, animationDelay: `${index * 0.85}s` }}
      />

      <g transform={`translate(${endpoint.x} ${endpoint.y})`}>
        <motion.g style={{ opacity: nodeOpacity, scale: nodeScale, transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle
            className={styles.endpointPulse}
            r={9}
            fill="#155dfc"
            opacity="0.12"
            style={{ animationDelay: `${index * 0.7}s` }}
          />
          <circle r={4} fill="#ffffff" stroke="#155dfc" strokeWidth="1.3" />
        </motion.g>
      </g>
    </>
  )
}
