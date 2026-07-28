/**
 * Quarter-circle arc geometry for the Talk to GFF AI agent carousel.
 *
 * The path is ONE continuous cubic Bézier approximating a 90° arc from the
 * top of the stage, bending smoothly to the right and exiting through the
 * right boundary. Every card samples the SAME curve — there are no separate
 * vertical/horizontal segments, so a corner is geometrically impossible.
 *
 * Card placement derives from a single shared `phase` value:
 *   rel = wrap(cardIndex - phase)   // cyclic, in [-2.5, 2.5)
 * rel +1 → incoming (top) · rel 0 → active (focus) · rel −1 → outgoing (right)
 * rel ±2 → fully hidden at the curve's ends. Values in between interpolate
 * continuously, so dragging moves cards fluidly along the arc.
 */

export const AGENT_COUNT = 5

/** Bézier control points in normalized stage coordinates (x right, y down). */
const P0 = { x: 0.4, y: -0.24 } // above the top edge, centre-left
const P1 = { x: 0.42, y: 0.22 }
const P2 = { x: 0.62, y: 0.55 }
const P3 = { x: 1.02, y: 1.0 } // beyond the right edge

function bezier(t: number): { x: number; y: number } {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return {
    x: a * P0.x + b * P1.x + c * P2.x + d * P3.x,
    y: a * P0.y + b * P1.y + c * P2.y + d * P3.y,
  }
}

/** Slot anchors along the curve, keyed by relative position. */
const ANCHORS: Array<{ rel: number; t: number; s: number; o: number; z: number; r: number }> = [
  { rel: -2, t: 1.0, s: 0.76, o: 0, z: 0, r: 2 }, // exited — offscreen right
  // Fade completes AT the right-edge wipe, before the curve's tail compresses
  // slot spacing near the corner — so no visible card can bunch up there.
  { rel: -1.4, t: 0.93, s: 0.77, o: 0, z: 1, r: 2 },
  { rel: -1, t: 0.88, s: 0.77, o: 0.68, z: 2, r: 2 }, // outgoing
  { rel: 0, t: 0.55, s: 1, o: 1, z: 4, r: 0 }, // active focus
  { rel: 1, t: 0.2, s: 0.76, o: 0.55, z: 1, r: -2 }, // incoming
  // Mirror guard at the top entry: cards materialise just above the edge.
  { rel: 1.4, t: 0.115, s: 0.75, o: 0, z: 0, r: -2 },
  { rel: 2, t: 0.05, s: 0.74, o: 0, z: 0, r: -2 }, // hidden above the top edge
]

export type ArcSlot = {
  x: number // normalized stage x of the card centre
  y: number
  scale: number
  opacity: number
  zIndex: number
  rotateZ: number
}

/** Cyclic relative position in [-2.5, 2.5). */
export function wrapRel(index: number, phase: number): number {
  return ((((index - phase) % AGENT_COUNT) + AGENT_COUNT + AGENT_COUNT / 2) % AGENT_COUNT) - AGENT_COUNT / 2
}

const lerp = (a: number, b: number, u: number) => a + (b - a) * u

/** Continuous slot interpolation for any relative position. */
export function slotFor(rel: number): ArcSlot {
  const r = Math.max(-2, Math.min(2, rel)) // beyond ±2 stays clamped (invisible)
  let hi = ANCHORS.length - 1
  for (let i = 1; i < ANCHORS.length; i++) {
    if (r <= ANCHORS[i].rel) {
      hi = i
      break
    }
  }
  const a = ANCHORS[hi - 1]
  const b = ANCHORS[hi]
  const u = (r - a.rel) / (b.rel - a.rel)

  const t = lerp(a.t, b.t, u)
  const pos = bezier(t)
  const clampedOpacity = Math.abs(rel) > 2 ? 0 : lerp(a.o, b.o, u)

  return {
    x: pos.x,
    y: pos.y,
    scale: lerp(a.s, b.s, u),
    opacity: clampedOpacity,
    zIndex: Math.round(lerp(a.z, b.z, u)),
    rotateZ: lerp(a.r, b.r, u),
  }
}

/** Shortest cyclic delta that brings `index` to the active slot. */
export function deltaToIndex(index: number, phase: number): number {
  return wrapRel(index, phase)
}

/* Timing — continuous rotation, no stationary holds. */
/** Seconds for one agent spacing at normal speed. The single tuning knob. */
export const SECONDS_PER_SLOT = 2.2
/** Short grace after a deliberate interaction before motion resumes. */
export const INTERACTION_GRACE_MS = 1500
export const TRANSITION_S = 1.1 // manual go-to-agent tween
export const AUTO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const SETTLE_SPRING = { type: 'spring', stiffness: 150, damping: 24, mass: 0.9 } as const
/** Drag distance (px) that advances the carousel by one agent. */
export const DRAG_PX_PER_SLOT = 300
