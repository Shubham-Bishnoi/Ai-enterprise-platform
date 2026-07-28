/**
 * Geometry construction for the GFF AI Intelligence Forge.
 *
 * One persistent machine, assembled from independent components so every part
 * has its own transform/animation state (driven in forge-animation.ts):
 * ceramic base, glass core cluster, energy rings, radial rails, travelling
 * intelligence blocks, blueprint layers, connectors, ceramic housing halves,
 * indigo control modules, governance ring, data ribbons, outer operational
 * modules, and light-blue output connectors.
 *
 * All positions/curves are deterministic constants — no randomness — so the
 * construction state is a pure function of scroll progress.
 */

import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { MaterialKit } from './forge-materials'

export const CORE_Y = 1.55

/* -------------------------------------------------------------------------- */
/* Handle types                                                                */
/* -------------------------------------------------------------------------- */

export type BlockHandle = {
  mesh: THREE.Mesh
  mat: THREE.MeshPhysicalMaterial
  curve: THREE.CubicBezierCurve3
  /** [travelStart, travelEnd] on scroll progress. */
  window: [number, number]
  /** Seed blocks are visible (hovering at the curve start) from this progress. */
  appearAt: number
}

export type RibbonHandle = {
  mesh: THREE.Mesh
  mat: THREE.MeshPhysicalMaterial
  curve: THREE.CubicBezierCurve3
  pulses: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }[]
}

export type OutputHandle = {
  tube: THREE.Mesh
  cluster: THREE.Group
  pulses: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number; from: THREE.Vector3; to: THREE.Vector3 }[]
}

export type Forge = {
  root: THREE.Group
  shadow: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial }
  base: { group: THREE.Group; glowMat: THREE.MeshBasicMaterial }
  core: {
    group: THREE.Group
    cubes: { mesh: THREE.Mesh; dir: THREE.Vector3; home: THREE.Vector3 }[]
    glow: THREE.Mesh
    glowMat: THREE.MeshBasicMaterial
    glassMat: THREE.MeshPhysicalMaterial
  }
  innerRing: { mesh: THREE.Mesh; mat: THREE.MeshPhysicalMaterial }
  headRing: { group: THREE.Group; mat: THREE.MeshPhysicalMaterial }
  rails: { mesh: THREE.Mesh; mat: THREE.MeshPhysicalMaterial }[]
  blocks: BlockHandle[]
  layers: { mesh: THREE.Mesh; mat: THREE.MeshPhysicalMaterial; finalY: number }[]
  connectors: { mesh: THREE.Mesh; mat: THREE.MeshPhysicalMaterial }[]
  housing: { group: THREE.Group; left: THREE.Mesh; right: THREE.Mesh }
  controls: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3 }[]
  gov: { group: THREE.Group; ringMat: THREE.MeshPhysicalMaterial; nodes: THREE.Mesh[] }
  ribbons: RibbonHandle[]
  outerModules: { mesh: THREE.Mesh; to: THREE.Vector3 }[]
  outputs: OutputHandle[]
}

/* -------------------------------------------------------------------------- */
/* Deterministic layout tables                                                 */
/* -------------------------------------------------------------------------- */

const RIBBON_COLORS = [0xffa268, 0xf19ad2, 0x8fc6ff]

// Travelling intelligence blocks: colour honours the journey (coral/orange →
// dark purple → multicolour → indigo), start side, socket around the core.
type BlockSpec = { color: number; start: [number, number, number]; socket: [number, number, number]; loop?: boolean }

const BLOCK_SPECS: BlockSpec[] = [
  // Seed blocks (visible during Garage, travel first) — coral / orange.
  { color: 0xff8f7a, start: [2.9, 2.1, 0.9], socket: [0.62, 2.02, 0.18] },
  { color: 0xff9a4d, start: [3.3, 1.15, 0.5], socket: [1.0, 1.4, 0.55] },
  { color: 0xff8f7a, start: [-3.4, 2.4, 0.7], socket: [-0.62, 2.02, 0.2] },
  // Discovery arrivals — orange + dark purple.
  { color: 0xff9a4d, start: [-5.6, 1.9, -0.7], socket: [-1.02, 1.7, -0.3] },
  { color: 0x7b5bea, start: [-5.2, 0.8, 0.9], socket: [-1.05, 1.28, 0.4], loop: true },
  { color: 0xff9a4d, start: [-6.0, 2.6, 0.2], socket: [-0.35, 2.1, -0.45] },
  { color: 0x7b5bea, start: [-5.4, 1.3, -1.1], socket: [0.4, 1.15, -0.85] },
  // Blueprint arrivals — restrained multicolour.
  { color: 0xf2726f, start: [-5.8, 2.2, 0.8], socket: [1.15, 1.85, -0.2] },
  { color: 0xb18bf5, start: [-5.3, 1.0, 0.2], socket: [-0.85, 1.05, -0.6], loop: true },
  { color: 0x74b9ff, start: [-5.9, 1.6, 1.0], socket: [0.86, 1.1, 0.75] },
  { color: 0xf5a0c6, start: [-5.1, 2.5, -0.5], socket: [-0.3, 1.05, 0.95] },
  // Foundry arrival — indigo.
  { color: 0x6a78f2, start: [-5.5, 1.7, 0.5], socket: [0.0, 2.28, 0.0] },
]

const CONTROL_ANGLES = [90, 0, 180, 270] // top, right, left, bottom of the housing ring
const OUTER_MODULE_ANGLES = [15, 75, 135, 195, 255, 315]

/* -------------------------------------------------------------------------- */
/* Build                                                                       */
/* -------------------------------------------------------------------------- */

export function buildForge(kit: MaterialKit): Forge {
  const root = new THREE.Group()

  /* ------------------------------- Shadow -------------------------------- */
  const shadowMat = new THREE.MeshBasicMaterial({
    map: kit.shadowTexture(),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  const shadow = new THREE.Mesh(kit.trackG(new THREE.PlaneGeometry(5.6, 5.6)), shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.005
  root.add(shadow)

  /* -------------------------------- Base --------------------------------- */
  const base = new THREE.Group()
  const baseLower = new THREE.Mesh(kit.trackG(new THREE.CylinderGeometry(2.15, 2.3, 0.22, 64)), kit.ceramicBase)
  baseLower.position.y = 0.11
  const baseUpper = new THREE.Mesh(kit.trackG(new THREE.CylinderGeometry(1.5, 1.62, 0.24, 64)), kit.ceramic)
  baseUpper.position.y = 0.34
  const baseGlowMat = kit.emissive(0x8fd8ff, 0.5)
  const baseGlow = new THREE.Mesh(kit.trackG(new THREE.TorusGeometry(2.02, 0.035, 12, 72)), baseGlowMat)
  baseGlow.rotation.x = Math.PI / 2
  baseGlow.position.y = 0.045
  base.add(baseLower, baseUpper, baseGlow)
  root.add(base)

  /* ------------------------ Core cluster + inner glow --------------------- */
  const coreGroup = new THREE.Group()
  coreGroup.position.y = CORE_Y
  const coreGlass = kit.glass(0x9adcf0, 0.5, 0.4)
  const cubeGeo = kit.trackG(new RoundedBoxGeometry(0.46, 0.46, 0.46, 3, 0.09))
  const offsets: [number, number, number][] = [
    [0, 0, 0],
    [0.48, 0, 0], [-0.48, 0, 0],
    [0, 0.48, 0], [0, -0.48, 0],
    [0, 0, 0.48], [0, 0, -0.48],
  ]
  const cubes = offsets.map(([x, y, z]) => {
    const mesh = new THREE.Mesh(cubeGeo, coreGlass)
    const home = new THREE.Vector3(x, y, z)
    const dir = home.lengthSq() > 0 ? home.clone().normalize() : new THREE.Vector3(0, 1, 0)
    coreGroup.add(mesh)
    return { mesh, dir, home }
  })
  const glowMat = kit.emissive(0x2ec5e6, 0.85)
  const glow = new THREE.Mesh(kit.trackG(new THREE.SphereGeometry(0.3, 24, 24)), glowMat)
  coreGroup.add(glow)
  root.add(coreGroup)

  /* ----------------------------- Inner ring ------------------------------- */
  const innerRingMat = kit.glass(0xbfe8f2, 0.55, 0.5)
  const innerRing = new THREE.Mesh(kit.trackG(new THREE.TorusGeometry(0.92, 0.045, 14, 72)), innerRingMat)
  innerRing.rotation.x = Math.PI / 2
  innerRing.position.y = CORE_Y
  root.add(innerRing)

  /* -------------------- Head ring (dark purple, vertical) ------------------ */
  const headGroup = new THREE.Group()
  headGroup.position.set(0, CORE_Y, -0.22)
  const headMat = kit.glass(0x5b3fd4, 0.4, 0.4)
  const headRing = new THREE.Mesh(kit.trackG(new THREE.TorusGeometry(1.42, 0.09, 16, 80)), headMat)
  headGroup.add(headRing)
  root.add(headGroup)

  /* -------------------------------- Rails --------------------------------- */
  const rails = OUTER_MODULE_ANGLES.map((deg) => {
    const mat = kit.glass(0xffb37c, 0.65, 0.45)
    const geo = kit.trackG(new THREE.BoxGeometry(1.32, 0.055, 0.055))
    geo.translate(0.66, 0, 0) // anchor at the inner end so scale.x extends outward
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(Math.cos((deg * Math.PI) / 180) * 0.55, 1.02, Math.sin((deg * Math.PI) / 180) * 0.55)
    mesh.rotation.y = -(deg * Math.PI) / 180
    root.add(mesh)
    return { mesh, mat }
  })

  /* -------------------- Travelling intelligence blocks --------------------- */
  const blockGeo = kit.trackG(new RoundedBoxGeometry(0.3, 0.3, 0.3, 3, 0.07))
  const blocks: BlockHandle[] = BLOCK_SPECS.map((spec, i) => {
    const mat = kit.glass(spec.color, 0.7, 0.5)
    const mesh = new THREE.Mesh(blockGeo, mat)
    const start = new THREE.Vector3(...spec.start)
    const end = new THREE.Vector3(spec.socket[0], spec.socket[1], spec.socket[2])
    const mid1 = start.clone().lerp(end, 0.35).add(new THREE.Vector3(0, spec.loop ? 1.15 : 0.55, spec.loop ? -0.9 : 0.25))
    const mid2 = start.clone().lerp(end, 0.75).add(new THREE.Vector3(0, spec.loop ? -0.35 : 0.2, spec.loop ? 0.6 : -0.1))
    const curve = new THREE.CubicBezierCurve3(start, mid1, mid2, end)
    const a = 0.16 + i * 0.032
    const handle: BlockHandle = {
      mesh,
      mat,
      curve,
      window: [a, a + 0.09],
      appearAt: i < 3 ? 0.04 + i * 0.03 : a,
    }
    mesh.visible = false
    root.add(mesh)
    return handle
  })

  /* --------------------------- Blueprint layers ---------------------------- */
  const layerSpecs = [
    { finalY: CORE_Y - 0.88, radius: 1.34 },
    { finalY: CORE_Y, radius: 1.18 },
    { finalY: CORE_Y + 0.88, radius: 0.98 },
  ]
  const layers = layerSpecs.map(({ finalY, radius }) => {
    const mat = kit.glass(0x59d3c4, 0.24, 0.3)
    const mesh = new THREE.Mesh(kit.trackG(new THREE.CylinderGeometry(radius, radius, 0.05, 6)), mat)
    mesh.rotation.y = Math.PI / 6
    mesh.position.y = CORE_Y
    root.add(mesh)
    return { mesh, mat, finalY }
  })

  /* ------------------------------ Connectors ------------------------------- */
  const connectors = [45, 135, 225, 315].map((deg) => {
    const mat = kit.glass(0x7cd7cb, 0.5, 0.45)
    const geo = kit.trackG(new THREE.CylinderGeometry(0.03, 0.03, 1.76, 10))
    geo.translate(0, 0.88, 0) // anchor at the bottom so scale.y draws upward
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(Math.cos((deg * Math.PI) / 180) * 0.92, CORE_Y - 0.88, Math.sin((deg * Math.PI) / 180) * 0.92)
    root.add(mesh)
    return { mesh, mat }
  })

  /* ---------------------- Ceramic housing (two halves) --------------------- */
  const housingGroup = new THREE.Group()
  housingGroup.position.set(0, CORE_Y, -0.12)
  const halfGeo = kit.trackG(new THREE.TorusGeometry(1.95, 0.17, 20, 48, Math.PI))
  const housingRight = new THREE.Mesh(halfGeo, kit.ceramic)
  housingRight.rotation.z = -Math.PI / 2
  const housingLeft = new THREE.Mesh(halfGeo, kit.ceramic)
  housingLeft.rotation.z = Math.PI / 2
  housingGroup.add(housingRight, housingLeft)
  root.add(housingGroup)

  /* ------------------------ Indigo control modules ------------------------- */
  const controlGeo = kit.trackG(new RoundedBoxGeometry(0.34, 0.34, 0.3, 3, 0.08))
  const controlMat = kit.glass(0x6a78f2, 0.8, 0.5)
  const controls = CONTROL_ANGLES.map((deg) => {
    const rad = (deg * Math.PI) / 180
    const to = new THREE.Vector3(Math.cos(rad) * 1.95, CORE_Y + Math.sin(rad) * 1.95, -0.12)
    const from = new THREE.Vector3(Math.cos(rad) * 3.1, CORE_Y + Math.sin(rad) * 3.1, -0.12)
    const mesh = new THREE.Mesh(controlGeo, controlMat)
    mesh.visible = false
    root.add(mesh)
    return { mesh, from, to }
  })

  /* ---------------------------- Governance ring ---------------------------- */
  const govGroup = new THREE.Group()
  govGroup.position.set(0, CORE_Y, -0.05)
  const govMat = kit.glass(0x9d6cf0, 0.45, 0.5)
  const govRing = new THREE.Mesh(kit.trackG(new THREE.TorusGeometry(2.32, 0.05, 12, 90)), govMat)
  const nodeGeo = kit.trackG(new RoundedBoxGeometry(0.18, 0.18, 0.18, 2, 0.05))
  const nodes = [30, 160, 275].map((deg) => {
    const rad = (deg * Math.PI) / 180
    const node = new THREE.Mesh(nodeGeo, govMat)
    node.position.set(Math.cos(rad) * 2.32, Math.sin(rad) * 2.32, 0)
    govGroup.add(node)
    return node
  })
  govGroup.add(govRing)
  root.add(govGroup)

  /* ------------------------------ Data ribbons ----------------------------- */
  const ribbons: RibbonHandle[] = RIBBON_COLORS.map((color, i) => {
    const y = 2.15 - i * 0.42
    const start = new THREE.Vector3(-5.7, y - 0.35 + i * 0.18, -0.55 + i * 0.5)
    const end = new THREE.Vector3(-0.82, CORE_Y + 0.28 - i * 0.24, 0.02 + i * 0.04)
    const c1 = new THREE.Vector3(-3.6, y + 0.28, -0.25 + i * 0.3)
    const c2 = new THREE.Vector3(-1.9, CORE_Y + 0.42 - i * 0.28, 0.08)
    const curve = new THREE.CubicBezierCurve3(start, c1, c2, end)
    const mat = kit.glass(color, 0, 0.45)
    const mesh = new THREE.Mesh(kit.trackG(new THREE.TubeGeometry(curve, 48, 0.032, 8, false)), mat)
    root.add(mesh)
    const pulseGeo = kit.trackG(new THREE.SphereGeometry(0.06, 12, 12))
    const pulses = [0, 0.5].map((phase) => {
      const pmat = kit.emissive(color, 0)
      const pmesh = new THREE.Mesh(pulseGeo, pmat)
      pmesh.visible = false
      root.add(pmesh)
      return { mesh: pmesh, mat: pmat, phase }
    })
    return { mesh, mat, curve, pulses }
  })

  /* -------------------------- Outer operational modules -------------------- */
  const outerGeo = kit.trackG(new RoundedBoxGeometry(0.42, 0.36, 0.42, 3, 0.1))
  const outerModules = OUTER_MODULE_ANGLES.map((deg) => {
    const rad = ((deg + 28) * Math.PI) / 180
    const to = new THREE.Vector3(Math.cos(rad) * 2.52, 0.42, Math.sin(rad) * 2.52)
    const mesh = new THREE.Mesh(outerGeo, kit.ceramic)
    mesh.visible = false
    root.add(mesh)
    return { mesh, to }
  })

  /* ------------------------- Output connectors (scale) ---------------------- */
  const outColor = 0x74b9ff
  const outputs: OutputHandle[] = [0, 1, 2].map((i) => {
    const y = 1.15 + i * 0.42
    const tubeMat = kit.glass(outColor, 0.6, 0.5)
    const tubeGeo = kit.trackG(new THREE.CylinderGeometry(0.034, 0.034, 1.7, 10))
    tubeGeo.translate(0, 0.85, 0)
    const tube = new THREE.Mesh(tubeGeo, tubeMat)
    tube.position.set(1.35, y, 0.15)
    tube.rotation.z = -Math.PI / 2 + 0.12 * (i - 1) // fan slightly up/down
    root.add(tube)

    // End cluster: a small 3-block row (like the storyboard's output arrays).
    const cluster = new THREE.Group()
    const blockG = kit.trackG(new RoundedBoxGeometry(0.24, 0.24, 0.24, 2, 0.06))
    const cMat = kit.glass(outColor, 0.85, 0.55)
    for (let j = 0; j < 3; j++) {
      const m = new THREE.Mesh(blockG, cMat)
      m.position.z = (j - 1) * 0.3
      cluster.add(m)
    }
    cluster.position.set(3.25, y + 0.2 * (i - 1), 0.15)
    cluster.visible = false
    root.add(cluster)

    const from = new THREE.Vector3(1.35, y, 0.15)
    const to = cluster.position.clone()
    const pulses = [0, 0.45].map((phase) => {
      const pmat = kit.emissive(outColor, 0)
      const pmesh = new THREE.Mesh(kit.trackG(new THREE.SphereGeometry(0.055, 12, 12)), pmat)
      pmesh.visible = false
      root.add(pmesh)
      return { mesh: pmesh, mat: pmat, phase, from, to }
    })
    return { tube, cluster, pulses }
  })

  return {
    root,
    shadow: { mesh: shadow, mat: shadowMat },
    base: { group: base, glowMat: baseGlowMat },
    core: { group: coreGroup, cubes, glow, glowMat, glassMat: coreGlass },
    innerRing: { mesh: innerRing, mat: innerRingMat },
    headRing: { group: headGroup, mat: headMat },
    rails,
    blocks,
    layers,
    connectors,
    housing: { group: housingGroup, left: housingLeft, right: housingRight },
    controls,
    gov: { group: govGroup, ringMat: govMat, nodes },
    ribbons,
    outerModules,
    outputs,
  }
}
