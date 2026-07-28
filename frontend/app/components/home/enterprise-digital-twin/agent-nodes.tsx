'use client'

/**
 * Stage 3 — Agents.
 *
 * Exactly five specialist nodes activate in sequence around the existing
 * architecture: the node fades and scales in, its connection draws toward the
 * core, then a light pulse runs the line once. Nothing else in the object moves.
 * The nodes are geometry, not icons — no labels, no cards, no badges.
 */

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { AGENTS, AGENT_NODE_SIZE, type AgentNode, type AgentShape } from './digital-twin-data'
import styles from './enterprise-digital-twin.module.css'

export function AgentNodes({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  return (
    <>
      {AGENTS.map((agent, i) => (
        <Agent key={agent.id} agent={agent} index={i} progress={progress} compact={compact} />
      ))}
    </>
  )
}

function Agent({
  agent,
  index,
  progress,
  compact,
}: {
  agent: AgentNode
  index: number
  progress: MotionValue<number>
  compact: boolean
}) {
  // Five sequential activations packed into the Agents window (0.40 → 0.60).
  const start = 0.4 + index * 0.032
  const nodeIn = start + 0.045
  const linkEnd = nodeIn + 0.05

  const nodeOpacity = useTransform(progress, [start, nodeIn], [0, 1])
  const nodeScale = useTransform(progress, [start, nodeIn], [0.4, 1])
  const linkDraw = useTransform(progress, [start + 0.015, linkEnd], [0, 1])
  const linkOpacity = useTransform(progress, [start + 0.015, linkEnd], [0, 0.5])
  // Once the mesh is live the pulses become occasional rather than constant.
  const pulseOpacity = useTransform(progress, [linkEnd, linkEnd + 0.04], [0, 0.9])

  // Governance briefly flags two pathways, then resolves them back to blue.
  const flagOpacity = useTransform(
    progress,
    agent.flagged ? [0.63, 0.67, 0.72, 0.76] : [0, 0, 1, 1],
    agent.flagged ? [0, 0.85, 0.6, 0] : [0, 0, 0, 0],
  )

  return (
    <>
      <motion.path
        d={agent.link}
        fill="none"
        stroke="#155dfc"
        strokeWidth="1"
        strokeLinecap="round"
        style={{ pathLength: linkDraw, opacity: linkOpacity }}
      />

      {/* Unapproved pathway — colour only, never a warning card or badge. */}
      <motion.path
        d={agent.link}
        fill="none"
        stroke="#ef233c"
        strokeWidth="1.4"
        strokeLinecap="round"
        style={{ opacity: flagOpacity }}
      />

      <motion.path
        className={index % 2 === 0 ? styles.signal : styles.signalOut}
        d={agent.link}
        pathLength={100}
        fill="none"
        stroke="#a855f7"
        strokeWidth="3.2"
        strokeLinecap="round"
        style={{ opacity: pulseOpacity, animationDelay: `${index * 1.2}s` }}
      />

      <g transform={`translate(${agent.x} ${agent.y})`}>
        <motion.g style={{ opacity: nodeOpacity, scale: nodeScale, transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle r={AGENT_NODE_SIZE + 7} fill="url(#dtNodeGlow)" opacity="0.75" />
          <AgentGlyph shape={agent.shape} size={compact ? AGENT_NODE_SIZE - 1 : AGENT_NODE_SIZE} />
        </motion.g>
      </g>
    </>
  )
}

/**
 * Subtle geometric differentiation between the five specialists — enough that
 * they read as purposeful, not enough to become iconography.
 */
function AgentGlyph({ shape, size }: { shape: AgentShape; size: number }) {
  const common = {
    fill: 'url(#dtNodeFill)',
    stroke: '#155dfc',
    strokeWidth: 1.2,
    strokeLinejoin: 'round' as const,
  }

  switch (shape) {
    case 'hex': {
      const pts = [-90, -30, 30, 90, 150, 210]
        .map((a) => `${(size * Math.cos((a * Math.PI) / 180)).toFixed(2)},${(size * Math.sin((a * Math.PI) / 180)).toFixed(2)}`)
        .join(' ')
      return <polygon points={pts} {...common} />
    }
    case 'diamond':
      return <polygon points={`0,${-size} ${size},0 0,${size} ${-size},0`} {...common} />
    case 'triangle':
      return <polygon points={`0,${-size} ${size * 0.9},${size * 0.7} ${-size * 0.9},${size * 0.7}`} {...common} />
    case 'square':
      return <rect x={-size * 0.82} y={-size * 0.82} width={size * 1.64} height={size * 1.64} rx={2} {...common} />
    case 'circle':
    default:
      return <circle r={size * 0.92} {...common} />
  }
}
