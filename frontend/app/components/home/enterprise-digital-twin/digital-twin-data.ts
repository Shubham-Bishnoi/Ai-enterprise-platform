/**
 * Geometry for the Enterprise AI Digital Twin.
 *
 * Everything is precomputed at module load from fixed constants — no randomness —
 * so the SVG is byte-identical between SSR and the client (no hydration drift).
 *
 * Coordinate space: a 420 x 420 viewBox with the intelligence core locked at the
 * exact centre (210, 210). Every layer is laid out around that one point, which is
 * what keeps the core visually anchored while the structure assembles around it.
 */

export const VIEW = 420
export const C = VIEW / 2 // 210 — the persistent core centre

const rad = (deg: number) => (deg * Math.PI) / 180

/* -------------------------------------------------------------------------- */
/* Stage windows — one normalized scroll value drives all five                  */
/* -------------------------------------------------------------------------- */

export const STAGE_WINDOWS = {
  discover: [0.0, 0.2],
  blueprint: [0.2, 0.4],
  agents: [0.4, 0.6],
  governance: [0.6, 0.8],
  scale: [0.8, 1.0],
} as const satisfies Record<string, readonly [number, number]>

/* -------------------------------------------------------------------------- */
/* Intelligence core (persistent, every stage)                                  */
/* -------------------------------------------------------------------------- */

export const CORE_RADIUS = 34

/** Point-up hexagon, expressed as an SVG polygon `points` string. */
function hexPoints(r: number): string {
  return [-90, -30, 30, 90, 150, 210]
    .map((a) => `${(C + r * Math.cos(rad(a))).toFixed(2)},${(C + r * Math.sin(rad(a))).toFixed(2)}`)
    .join(' ')
}

export const CORE_HEX = hexPoints(CORE_RADIUS)
export const CORE_HEX_INNER = hexPoints(CORE_RADIUS * 0.62)

/* -------------------------------------------------------------------------- */
/* Stage 1 — Discover: incoming data streams                                    */
/* -------------------------------------------------------------------------- */

/**
 * A stream keeps its endpoints fixed and moves only its quadratic control point,
 * so Blueprint can straighten it by interpolating two numbers — no path morphing
 * library, and it reverses exactly.
 */
export type Stream = {
  sx: number
  sy: number
  ex: number
  ey: number
  /** Bowed control point — loose, unstructured information. */
  loose: [number, number]
  /** Control point on the chord — an organized pathway. */
  straight: [number, number]
}

export const streamPath = (s: Stream, cx: number, cy: number) =>
  `M${s.sx},${s.sy} Q${cx.toFixed(2)},${cy.toFixed(2)} ${s.ex},${s.ey}`

const STREAM_STARTS: [number, number][] = [
  [30, 116],
  [392, 92],
  [22, 306],
  [396, 322],
]

export const STREAMS: Stream[] = STREAM_STARTS.map(([sx, sy], i) => {
  const dx = sx - C
  const dy = sy - C
  const len = Math.hypot(dx, dy)
  // Stop just outside the core so streams feed it rather than pierce it.
  const ex = C + (dx / len) * (CORE_RADIUS + 12)
  const ey = C + (dy / len) * (CORE_RADIUS + 12)
  const mx = (sx + ex) / 2
  const my = (sy + ey) / 2
  // Perpendicular bow, alternating side so the four streams read as a spread.
  const bow = i % 2 === 0 ? 38 : -38
  const nx = (-dy / len) * bow
  const ny = (dx / len) * bow
  return {
    sx: Number(sx.toFixed(2)),
    sy: Number(sy.toFixed(2)),
    ex: Number(ex.toFixed(2)),
    ey: Number(ey.toFixed(2)),
    loose: [Number((mx + nx).toFixed(2)), Number((my + ny).toFixed(2))],
    straight: [Number(mx.toFixed(2)), Number(my.toFixed(2))],
  }
})

/** A handful of drifting motes — deliberately few. */
export const PARTICLES: { x: number; y: number; r: number; delay: number }[] = [
  { x: 96, y: 148, r: 2.4, delay: 0 },
  { x: 322, y: 138, r: 2, delay: 1.4 },
  { x: 118, y: 288, r: 1.8, delay: 2.6 },
  { x: 306, y: 292, r: 2.2, delay: 3.8 },
]

/* -------------------------------------------------------------------------- */
/* Stage 2 — Blueprint: three architectural planes                              */
/* -------------------------------------------------------------------------- */

const PLANE_HALF_W = 150
const PLANE_HALF_H = 52

/** Isometric rhombus centred on (C, C + dy). */
function planePath(dy: number): string {
  const cy = C + dy
  return [
    `M${C},${(cy - PLANE_HALF_H).toFixed(2)}`,
    `L${C + PLANE_HALF_W},${cy.toFixed(2)}`,
    `L${C},${(cy + PLANE_HALF_H).toFixed(2)}`,
    `L${C - PLANE_HALF_W},${cy.toFixed(2)}`,
    'Z',
  ].join(' ')
}

/**
 * Bottom → top: data foundation, intelligence layer, application layer.
 * They unfold from the core outward to these offsets; never labelled in the art.
 */
export const PLANES: { id: string; path: string; offset: number }[] = [
  { id: 'data', path: planePath(78), offset: 78 },
  { id: 'intelligence', path: planePath(0), offset: 0 },
  { id: 'application', path: planePath(-78), offset: -78 },
]

/** Faint blueprint rules that flash while the architecture resolves. */
export const BLUEPRINT_GRID: string[] = [
  `M${C - PLANE_HALF_W},${C} L${C + PLANE_HALF_W},${C}`,
  `M${C},${C - 130} L${C},${C + 130}`,
  `M${C - 104},${C - 36} L${C + 104},${C + 36}`,
  `M${C - 104},${C + 36} L${C + 104},${C - 36}`,
]

/* -------------------------------------------------------------------------- */
/* Stage 3 — Agents: exactly five specialist nodes                              */
/* -------------------------------------------------------------------------- */

export type AgentShape = 'hex' | 'diamond' | 'triangle' | 'circle' | 'square'

export type AgentNode = {
  id: string
  x: number
  y: number
  shape: AgentShape
  /** Straight connection to the core, drawn from the core outward. */
  link: string
  /** True for the pathways governance briefly flags, then resolves. */
  flagged: boolean
}

const AGENT_RX = 128
const AGENT_RY = 96
const AGENT_ANGLES = [-90, -18, 54, 126, 198]
const AGENT_SHAPES: AgentShape[] = ['hex', 'diamond', 'triangle', 'circle', 'square']
// Conceptually: strategy, architecture, governance, industry, training.
const AGENT_IDS = ['strategy', 'architecture', 'governance', 'industry', 'training']

export const AGENTS: AgentNode[] = AGENT_ANGLES.map((angle, i) => {
  const x = C + AGENT_RX * Math.cos(rad(angle))
  const y = C + AGENT_RY * Math.sin(rad(angle))
  const dx = x - C
  const dy = y - C
  const len = Math.hypot(dx, dy)
  const sx = C + (dx / len) * (CORE_RADIUS + 6)
  const sy = C + (dy / len) * (CORE_RADIUS + 6)
  const ex = x - (dx / len) * 14
  const ey = y - (dy / len) * 14
  return {
    id: AGENT_IDS[i],
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    shape: AGENT_SHAPES[i],
    link: `M${sx.toFixed(2)},${sy.toFixed(2)} L${ex.toFixed(2)},${ey.toFixed(2)}`,
    flagged: i === 1 || i === 3,
  }
})

export const AGENT_NODE_SIZE = 9

/* -------------------------------------------------------------------------- */
/* Stage 4 — Governance: containment boundary                                   */
/* -------------------------------------------------------------------------- */

const GOV_RX = 176
const GOV_RY = 152
const GOV_ANGLES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

const GOV_POINTS: [number, number][] = GOV_ANGLES.map((a) => [
  C + GOV_RX * Math.cos(rad(a)),
  C + GOV_RY * Math.sin(rad(a)),
])

/** Closed polygon with softened corners — architectural, not a plain ellipse. */
function smoothClosedPath(pts: [number, number][], round = 0.24): string {
  const n = pts.length
  const seg: string[] = []
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[i]
    const [nx, ny] = pts[(i + 1) % n]
    const a: [number, number] = [px + (nx - px) * round, py + (ny - py) * round]
    const b: [number, number] = [px + (nx - px) * (1 - round), py + (ny - py) * (1 - round)]
    if (i === 0) seg.push(`M${a[0].toFixed(2)},${a[1].toFixed(2)}`)
    else seg.push(`Q${px.toFixed(2)},${py.toFixed(2)} ${a[0].toFixed(2)},${a[1].toFixed(2)}`)
    seg.push(`L${b[0].toFixed(2)},${b[1].toFixed(2)}`)
  }
  seg.push('Z')
  return seg.join(' ')
}

export const GOVERNANCE_PATH = smoothClosedPath(GOV_POINTS)

/** Short structural ticks at each boundary vertex — the glass frame reading. */
export const GOVERNANCE_TICKS: string[] = GOV_ANGLES.map((a) => {
  const ix = C + GOV_RX * 0.93 * Math.cos(rad(a))
  const iy = C + GOV_RY * 0.93 * Math.sin(rad(a))
  const ox = C + GOV_RX * 1.05 * Math.cos(rad(a))
  const oy = C + GOV_RY * 1.05 * Math.sin(rad(a))
  return `M${ix.toFixed(2)},${iy.toFixed(2)} L${ox.toFixed(2)},${oy.toFixed(2)}`
})

/* -------------------------------------------------------------------------- */
/* Stage 5 — Scale: enterprise endpoints                                        */
/* -------------------------------------------------------------------------- */

export type Endpoint = {
  id: string
  x: number
  y: number
  /** Connection from the governance boundary out to the endpoint. */
  link: string
}

const END_RX = 196
const END_RY = 172

export const ENDPOINTS: Endpoint[] = GOV_ANGLES.map((a, i) => {
  const x = C + END_RX * Math.cos(rad(a))
  const y = C + END_RY * Math.sin(rad(a))
  const [gx, gy] = GOV_POINTS[i]
  const dx = x - gx
  const dy = y - gy
  const len = Math.hypot(dx, dy) || 1
  return {
    id: `endpoint-${i}`,
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    link: `M${gx.toFixed(2)},${gy.toFixed(2)} L${(x - (dx / len) * 7).toFixed(2)},${(y - (dy / len) * 7).toFixed(2)}`,
  }
})

/** Compact viewports keep four endpoints instead of eight. */
export const COMPACT_ENDPOINTS = ENDPOINTS.filter((_, i) => i % 2 === 0)
