/**
 * Scroll → construction mapping for the Intelligence Forge.
 *
 * `applyForgeProgress(forge, p, t)` sets every component's transform from one
 * normalized progress value p ∈ [0,1], so the assembly is deterministic:
 * scrolling up disassembles exactly, stopping freezes the state, and refreshing
 * mid-section restores it. `t` (elapsed seconds) drives only small ambient
 * motion — ring rotation, glow breathing, data pulses — and each of those is
 * gated so it starts only after its component has activated.
 *
 * Colour journey (interpolated continuously, never five hard cuts):
 * cyan → coral → orange → dark purple → multicolour (per-block) → teal →
 * indigo → purple → orange → light blue.
 */

import * as THREE from 'three'
import { CORE_Y, type Forge } from './forge-components'

/* ------------------------------ Small helpers ------------------------------ */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** Normalized position of p inside [a, b]. */
const win = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
/** Smoothstep easing. */
const ease = (x: number) => x * x * (3 - 2 * x)
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
/** Deterministic bell around c with half-width w (activation flashes). */
const bell = (p: number, c: number, w: number) => Math.exp(-((p - c) * (p - c)) / (w * w))

/* --------------------------- Core colour journey --------------------------- */

const GRADIENT: [number, number][] = [
  [0.0, 0x2ec5e6], // cyan
  [0.13, 0xff8f7a], // warm coral
  [0.25, 0xff9a4d], // orange
  [0.36, 0x6b4fd8], // dark purple (kept luminous)
  [0.46, 0xc66ae0], // multicolour proxy at the core (blocks carry the spread)
  [0.55, 0x2fc4b2], // teal
  [0.66, 0x6a78f2], // indigo
  [0.76, 0x9d6cf0], // purple
  [0.88, 0xff9a4d], // orange
  [1.0, 0x6ab8ff], // light blue
]
const GRAD_COLORS = GRADIENT.map(([, hex]) => new THREE.Color(hex))

const COL = new THREE.Color()
const TMP = new THREE.Color()
const WHITE = new THREE.Color(0xffffff)
const V3 = new THREE.Vector3()

export function forgeColor(p: number, out: THREE.Color) {
  for (let i = 0; i < GRADIENT.length - 1; i++) {
    const [a] = GRADIENT[i]
    const [b] = GRADIENT[i + 1]
    if (p <= b || i === GRADIENT.length - 2) {
      out.lerpColors(GRAD_COLORS[i], GRAD_COLORS[i + 1], win(p, a, b))
      return out
    }
  }
  return out.copy(GRAD_COLORS[GRAD_COLORS.length - 1])
}

/* ------------------------------ The mapping ------------------------------- */

export function applyForgeProgress(f: Forge, rawP: number, t: number) {
  const p = clamp01(rawP)
  forgeColor(p, COL)

  // The whole machine turns ~13° across the journey — scroll-driven (fully
  // reversible), never a continuous spin.
  f.root.rotation.y = -0.3 + 0.23 * ease(p)

  /* ------------------------------- Base ---------------------------------- */
  // Window starts below 0 so the seed state (podium + small core) is already
  // present at 0% — "the machine is only a seed", never an empty scene.
  const sBase = ease(win(p, -0.1, 0.05))
  f.base.group.visible = sBase > 0.001
  f.base.group.scale.setScalar(0.65 + 0.35 * sBase)
  f.base.group.position.y = -0.5 * (1 - sBase)
  f.base.glowMat.opacity = 0.35 * sBase + 0.25 * ease(win(p, 0.8, 1))
  f.base.glowMat.color.copy(TMP.copy(COL).lerp(WHITE, 0.35))
  f.shadow.mat.opacity = 0.17 * sBase
  f.shadow.mesh.scale.setScalar(0.75 + 0.45 * ease(win(p, 0, 0.9)))

  /* ----------------------- Core cluster + inner glow ---------------------- */
  f.core.cubes.forEach((cube, i) => {
    // Centre cube pre-exists at 0% (the seed); the rest assemble through Garage.
    const s = ease(win(p, -0.09 + i * 0.022, 0.03 + i * 0.022))
    cube.mesh.visible = s > 0.001
    cube.mesh.scale.setScalar(Math.max(s, 0.001))
    cube.mesh.position.copy(cube.home).addScaledVector(cube.dir, (1 - s) * 0.85)
  })
  // Core glass keeps a saturated tint of the journey colour; emissive follows it.
  f.core.glassMat.color.copy(TMP.copy(COL).lerp(WHITE, 0.35))
  f.core.glassMat.emissive.copy(COL)
  f.core.glassMat.emissiveIntensity = 0.5 + 0.25 * ease(win(p, 0.8, 1)) + 0.5 * bell(p, 0.97, 0.02)

  const glowIn = ease(win(p, -0.09, 0.03))
  const breathe = 1 + 0.05 * Math.sin(t * 1.1) * glowIn
  f.core.glow.visible = glowIn > 0.001
  f.core.glow.scale.setScalar(Math.max(glowIn * breathe, 0.001))
  f.core.glowMat.color.copy(COL)
  f.core.glowMat.opacity = 0.75 * glowIn + 0.25 * bell(p, 0.97, 0.02)

  /* ------------------------------ Inner ring ------------------------------ */
  const sInner = ease(win(p, 0.06, 0.16))
  f.innerRing.mesh.visible = sInner > 0.001
  f.innerRing.mesh.scale.setScalar(Math.max(sInner, 0.001))
  f.innerRing.mesh.rotation.z = t * 0.12 * sInner // slow pass, gated by activation
  f.innerRing.mat.opacity = 0.55 * sInner
  f.innerRing.mat.emissive.copy(COL)

  /* --------------------- Head ring (dark purple, rises) -------------------- */
  const sHead = ease(win(p, 0.25, 0.4))
  f.headRing.group.visible = sHead > 0.001
  f.headRing.group.scale.setScalar(Math.max(0.75 + 0.25 * sHead, 0.001))
  f.headRing.group.position.y = CORE_Y - 0.55 * (1 - sHead)
  f.headRing.mat.opacity = 0.4 * sHead
  // Dark purple hands over to indigo/purple as governance forms.
  f.headRing.mat.color.set(0x6b4fd8).lerp(TMP.set(0x9d6cf0), ease(win(p, 0.58, 0.8)))

  /* -------------------------------- Rails --------------------------------- */
  f.rails.forEach((rail, i) => {
    const s = ease(win(p, 0.22 + i * 0.022, 0.32 + i * 0.022))
    rail.mesh.visible = s > 0.001
    rail.mesh.scale.x = Math.max(s, 0.001)
    // Orange guides cool down to neutral glass once assembly begins.
    rail.mat.color.set(0xffb37c).lerp(TMP.set(0xdfe7f5), ease(win(p, 0.58, 0.78)))
    rail.mat.opacity = 0.65 * s
  })

  /* ---------------------- Travelling intelligence blocks ------------------- */
  f.blocks.forEach((block) => {
    const [a, b] = block.window
    const appear = ease(win(p, block.appearAt, block.appearAt + 0.03))
    const travel = win(p, a, b)
    block.mesh.visible = appear > 0.001
    if (appear <= 0.001) return
    const tt = ease(travel)
    block.curve.getPoint(tt, V3)
    block.mesh.position.copy(V3)
    block.mesh.scale.setScalar(Math.max(appear * (0.85 + 0.15 * tt), 0.001))
    block.mesh.rotation.y = tt * 1.4
    block.mat.opacity = 0.8 * appear
    // Lock flash as the block seats into its socket.
    block.mat.emissiveIntensity = 0.6 + 0.9 * bell(travel, 0.96, 0.06)
  })

  /* --------------------------- Blueprint layers ---------------------------- */
  f.layers.forEach((layer, i) => {
    const s = ease(win(p, 0.38 + i * 0.03, 0.52 + i * 0.03))
    layer.mesh.visible = s > 0.001
    layer.mesh.position.y = CORE_Y + (layer.finalY - CORE_Y) * s
    layer.mesh.scale.setScalar(Math.max(0.7 + 0.3 * s, 0.001))
    layer.mat.opacity = 0.24 * s
    // Multicolour inputs resolve into a coherent teal system.
    layer.mat.color.set(0xb9a7ec).lerp(TMP.set(0x59d3c4), ease(win(p, 0.44, 0.58)))
  })

  /* ------------------------------ Connectors ------------------------------- */
  f.connectors.forEach((conn, i) => {
    const s = ease(win(p, 0.46 + i * 0.02, 0.56 + i * 0.02))
    conn.mesh.visible = s > 0.001
    conn.mesh.scale.y = Math.max(s, 0.001)
    conn.mat.opacity = 0.5 * s
  })

  /* ----------------------- Housing halves close ---------------------------- */
  const sHouse = ease(win(p, 0.58, 0.72))
  const open = (1 - sHouse) * 0.85
  f.housing.group.visible = sHouse > 0.001
  f.housing.right.rotation.z = -Math.PI / 2 - open
  f.housing.left.rotation.z = Math.PI / 2 + open
  f.housing.group.scale.setScalar(Math.max(1.08 - 0.08 * sHouse, 0.001))
  // Settled, restrained rotation only once the machine is operational.
  f.housing.group.rotation.z = t * 0.02 * ease(win(p, 0.94, 1))

  /* ------------------------- Indigo control modules ------------------------ */
  f.controls.forEach((ctrl, i) => {
    const s = ease(win(p, 0.62 + i * 0.03, 0.7 + i * 0.03))
    ctrl.mesh.visible = s > 0.001
    ctrl.mesh.position.lerpVectors(ctrl.from, ctrl.to, easeOut(s))
    ctrl.mesh.scale.setScalar(Math.max(s, 0.001))
  })

  /* ---------------------------- Governance ring ---------------------------- */
  const sGov = ease(win(p, 0.66, 0.8))
  f.gov.group.visible = sGov > 0.001
  f.gov.group.scale.setScalar(Math.max(1.22 - 0.22 * sGov, 0.001))
  f.gov.ringMat.opacity = 0.45 * sGov
  f.gov.group.rotation.z = t * 0.05 * ease(win(p, 0.8, 0.92)) // gentle patrol once active
  f.gov.nodes.forEach((node, i) => {
    node.scale.setScalar(Math.max(ease(win(p, 0.7 + i * 0.03, 0.78 + i * 0.03)), 0.001))
  })

  /* ------------------------------ Data ribbons ----------------------------- */
  f.ribbons.forEach((ribbon, i) => {
    const s = ease(win(p, 0.4 + i * 0.03, 0.52 + i * 0.03))
    ribbon.mesh.visible = s > 0.001
    ribbon.mat.opacity = 0.42 * s
    const act = ease(win(p, 0.5, 0.6))
    ribbon.pulses.forEach((pulse) => {
      const u = (t * 0.11 + pulse.phase + i * 0.21) % 1
      pulse.mesh.visible = act > 0.01
      if (!pulse.mesh.visible) return
      ribbon.curve.getPoint(u, V3)
      pulse.mesh.position.copy(V3)
      pulse.mat.opacity = 0.85 * act * Math.sin(u * Math.PI) // fade at the ends
    })
  })

  /* ----------------------- Outer operational modules ----------------------- */
  f.outerModules.forEach((mod, i) => {
    const s = ease(win(p, 0.74 + i * 0.022, 0.82 + i * 0.022))
    mod.mesh.visible = s > 0.001
    mod.mesh.position.copy(mod.to)
    mod.mesh.position.y = mod.to.y + (1 - easeOut(s)) * 0.9
    mod.mesh.scale.setScalar(Math.max(s, 0.001))
  })

  /* --------------------------- Output connectors --------------------------- */
  f.outputs.forEach((out, i) => {
    const s = ease(win(p, 0.82 + i * 0.02, 0.9 + i * 0.02))
    out.tube.visible = s > 0.001
    out.tube.scale.y = Math.max(s, 0.001)
    const sc = ease(win(p, 0.86 + i * 0.02, 0.94 + i * 0.02))
    out.cluster.visible = sc > 0.001
    out.cluster.scale.setScalar(Math.max(sc, 0.001))
    const act = ease(win(p, 0.9, 0.97))
    out.pulses.forEach((pulse) => {
      const u = (t * 0.16 + pulse.phase) % 1
      pulse.mesh.visible = act > 0.01
      if (!pulse.mesh.visible) return
      pulse.mesh.position.lerpVectors(pulse.from, pulse.to, u)
      pulse.mat.opacity = 0.85 * act * Math.sin(u * Math.PI)
    })
  })
}

/* ------------------------------ Camera path ------------------------------- */

const CAM_FROM = new THREE.Vector3(4.15, 2.7, 7.9)
const CAM_TO = new THREE.Vector3(3.8, 2.35, 7.0)
const LOOK_AT = new THREE.Vector3(0.25, 1.42, 0)

/** Small forward dolly across the journey — no orbiting, no jumps. */
export function applyForgeCamera(camera: THREE.PerspectiveCamera, p: number) {
  camera.position.lerpVectors(CAM_FROM, CAM_TO, ease(clamp01(p)))
  camera.lookAt(LOOK_AT)
}
