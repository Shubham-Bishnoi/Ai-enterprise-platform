'use client'

/**
 * IntelligenceForgeHero
 *
 * The interactive "Intelligence Forge" 3D emblem, ported from the approved
 * prototype at frontend/intelligence-forge/src/main.js into a reusable Next.js
 * client component. The Three.js scene (extruded hex body, front/rear emblem
 * faces, red/blue rim lights, pulsing data network, drag interaction) is
 * preserved as-is; only the surrounding lifecycle is production-hardened.
 *
 * Behaviour vs the prototype:
 * - three is dynamically imported and the scene is built ONLY on capable
 *   viewports (≥1024px, not reduced-motion) and only once the hero nears the
 *   viewport. Everything else sees a static emblem image (also the SSR output,
 *   so there is no layout shift and no window/WebGL access during render).
 * - The render loop pauses when the hero scrolls off-screen or the tab is
 *   hidden, and a single rAF loop is used.
 * - Intro plays one controlled 360° reveal, then eases into a much slower idle
 *   rotation. Dragging overrides auto-rotation; idle resumes after a short
 *   pause. (The prototype span an endless turn and never resumed after a drag.)
 * - Full disposal of geometries, materials (including clones), textures,
 *   renderer, observers and listeners on unmount.
 */

import { useEffect, useRef, useState } from 'react'
// Type-only import (erased at build) — lets us annotate scene objects without
// eagerly bundling three; the runtime module is loaded dynamically below.
import type * as THREE_T from 'three'

const EMBLEM_SRC = '/images/gff-emblem.png'

const INTRO_DURATION = 5.5 // seconds for the two-turn reveal
const INTRO_TURNS = 2 // controlled 360° rotations during the intro
const INTRO_SCALE_DURATION = 2.2 // seconds to grow from 0.92 → 1
const RESUME_DELAY = 2.5 // seconds of inactivity before idle rotation resumes
const IDLE_RATE = 0.15 // rad/s ≈ 42s per turn (spec: 35–50s)
const START_ANGLE = 0.28

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type ThreeModule = typeof import('three')

export function IntelligenceForgeHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglActive, setWebglActive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Capability gate — everything below stays on the static emblem image.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const capable = window.matchMedia('(min-width: 1024px)').matches
    if (reduceMotion || !capable) return

    let disposed = false
    let teardown: (() => void) | null = null

    // Only pay for three + scene construction once the hero is near view.
    const initObserver = new IntersectionObserver(
      (entries) => {
        if (disposed || teardown) return
        if (entries.some((e) => e.isIntersecting)) {
          initObserver.disconnect()
          void start()
        }
      },
      { rootMargin: '250px' },
    )
    initObserver.observe(container)

    async function start() {
      const THREE = await import('three')
      if (disposed || !container || !canvas) return
      teardown = buildForgeScene(THREE, canvas, container)
      setWebglActive(true)
    }

    return () => {
      disposed = true
      initObserver.disconnect()
      teardown?.()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[500px]">
      {/* Static emblem — SSR output, fallback, and pre-WebGL poster. Padded so
          it matches the in-scene emblem size, keeping the swap seamless. */}
      <img
        src={EMBLEM_SRC}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain p-[10%] transition-opacity duration-700 lg:p-[19%] ${
          webglActive ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${webglActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ touchAction: 'none', cursor: 'grab' }}
      />
    </div>
  )
}

/**
 * Builds the Three.js scene into `canvas`, sized to `container`. Returns a
 * teardown function that stops the loop, removes all listeners/observers and
 * disposes every GPU resource.
 */
function buildForgeScene(THREE: ThreeModule, canvas: HTMLCanvasElement, container: HTMLElement): () => void {
  const geometries: Array<{ dispose(): void }> = []
  const materials: Array<{ dispose(): void }> = []
  const textures: Array<{ dispose(): void }> = []

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
  camera.position.set(0, 0.05, 8.8)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const world = new THREE.Group()
  scene.add(world)
  const emblem = new THREE.Group()
  world.add(emblem)

  // --- Extruded hexagonal body ---
  const hex = new THREE.Shape()
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3
    const x = Math.cos(a) * 1.72
    const y = Math.sin(a) * 1.72
    i ? hex.lineTo(x, y) : hex.moveTo(x, y)
  }
  hex.closePath()
  const bodyGeo = new THREE.ExtrudeGeometry(hex, {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.055,
  })
  bodyGeo.center()
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x060a12, metalness: 0.9, roughness: 0.19 })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  emblem.add(body)
  geometries.push(bodyGeo)
  materials.push(bodyMat)

  const edgesGeo = new THREE.EdgesGeometry(bodyGeo, 18)
  const edgesMat = new THREE.LineBasicMaterial({ color: 0x8ab9ff, transparent: true, opacity: 0.34 })
  emblem.add(new THREE.LineSegments(edgesGeo, edgesMat))
  geometries.push(edgesGeo)
  materials.push(edgesMat)

  // --- Front + rear emblem faces ---
  const texture = new THREE.TextureLoader().load(EMBLEM_SRC)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  textures.push(texture)

  const faceGeo = new THREE.PlaneGeometry(3.64, 3.64)
  geometries.push(faceGeo)
  const faceMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.02, toneMapped: false, side: THREE.FrontSide })
  materials.push(faceMat)
  const front = new THREE.Mesh(faceGeo, faceMat)
  front.position.z = 0.271
  emblem.add(front)

  const backMat = faceMat.clone()
  materials.push(backMat)
  const back = new THREE.Mesh(faceGeo, backMat)
  back.rotation.y = Math.PI
  back.position.z = -0.271
  emblem.add(back)

  // --- Lighting ---
  const red = new THREE.PointLight(0xff183d, 14, 10, 2)
  red.position.set(-2.5, 1.2, 2.8)
  const blue = new THREE.PointLight(0x087dff, 18, 10, 2)
  blue.position.set(2.5, 0.4, 3.2)
  const rim = new THREE.DirectionalLight(0xd8e7ff, 2.2)
  rim.position.set(0, 3, 4)
  scene.add(red, blue, rim, new THREE.AmbientLight(0x172033, 1.6))

  // --- Data network ---
  const network = new THREE.Group()
  world.add(network)
  const nodeGeo = new THREE.SphereGeometry(0.022, 10, 10)
  geometries.push(nodeGeo)
  const lines: Array<{ nodeMat: THREE_T.MeshBasicMaterial; lineMat: THREE_T.LineBasicMaterial; node: THREE_T.Mesh; phase: number }> = []
  for (let i = 0; i < 22; i++) {
    const side = i % 2 ? 1 : -1
    const y = (Math.random() - 0.5) * 5.2
    const z = -1.1 - Math.random() * 2.8
    const points = [
      new THREE.Vector3(side * (1.7 + Math.random() * 0.3), y * 0.38, z),
      new THREE.Vector3(side * (2.35 + Math.random() * 0.45), y * 0.72, z - 0.25),
      new THREE.Vector3(side * (3.1 + Math.random() * 0.8), y, z - 0.55),
    ]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometries.push(geometry)
    const color = side < 0 ? 0xff2447 : 0x118cff
    const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.16 })
    materials.push(lineMat)
    network.add(new THREE.Line(geometry, lineMat))
    const nodeMat = new THREE.MeshBasicMaterial({ color })
    materials.push(nodeMat)
    const node = new THREE.Mesh(nodeGeo, nodeMat)
    node.position.copy(points[2])
    network.add(node)
    lines.push({ nodeMat, lineMat, node, phase: Math.random() * Math.PI * 2 })
  }

  // --- Interaction ---
  let targetY = START_ANGLE
  let targetX = -0.05
  let dragging = false
  let lastX = 0
  let phase: 'intro' | 'idle' = 'intro'
  let simTime = 0
  let lastInteract = -RESUME_DELAY

  const onPointerDown = (e: PointerEvent) => {
    dragging = true
    phase = 'idle' // interacting aborts the intro
    lastX = e.clientX
    canvas.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (dragging) {
      targetY += (e.clientX - lastX) * 0.008
      lastX = e.clientX
    } else {
      const r = canvas.getBoundingClientRect()
      targetX = ((e.clientY - r.top) / r.height - 0.5) * 0.18
    }
  }
  const onPointerUp = () => {
    dragging = false
    lastInteract = simTime
  }
  const onPointerLeave = () => {
    if (!dragging) targetX = -0.05
  }
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointerleave', onPointerLeave)

  // --- Sizing ---
  let baseScale = 0.82
  const resize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    baseScale = w < 620 ? 0.72 : 0.82
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  // --- Loop with pause on off-screen / hidden tab ---
  const clock = new THREE.Clock()
  let rafId = 0
  let running = false
  let onScreen = true

  const frame = () => {
    if (!running) return
    const dt = Math.min(0.05, clock.getDelta())
    simTime += dt

    // Depth reveal + grow from 0.92 → 1.
    const introP = Math.min(1, simTime / 1.8)
    emblem.visible = introP > 0.02
    emblem.position.z = -1.2 * (1 - easeOutCubic(introP))
    const introScale = 0.92 + 0.08 * easeOutCubic(Math.min(1, simTime / INTRO_SCALE_DURATION))
    emblem.scale.setScalar(baseScale * introScale)

    // Rotation: two controlled turns, then very slow idle; drag overrides.
    if (phase === 'intro') {
      const p = Math.min(1, simTime / INTRO_DURATION)
      targetY = START_ANGLE + Math.PI * 2 * INTRO_TURNS * easeInOutCubic(p)
      if (p >= 1) phase = 'idle'
    } else if (!dragging && simTime - lastInteract > RESUME_DELAY) {
      targetY += IDLE_RATE * dt
    }

    emblem.rotation.y += (targetY - emblem.rotation.y) * 0.06
    emblem.rotation.x += (targetX - emblem.rotation.x) * 0.05
    emblem.position.y = Math.sin(simTime * 0.65) * 0.055

    for (const { nodeMat, lineMat, node, phase: ph } of lines) {
      const pulse = 0.28 + 0.72 * Math.max(0, Math.sin(simTime * 1.35 + ph))
      node.scale.setScalar(0.7 + pulse * 1.45)
      nodeMat.opacity = 0.35 + pulse * 0.65
      nodeMat.transparent = true
      lineMat.opacity = 0.07 + pulse * 0.13
    }
    red.intensity = 12 + Math.sin(simTime * 1.1) * 2
    blue.intensity = 16 + Math.sin(simTime * 1.1 + 1.8) * 2

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(frame)
  }

  const startLoop = () => {
    if (running) return
    running = true
    clock.getDelta() // discard the gap accumulated while paused
    rafId = requestAnimationFrame(frame)
  }
  const stopLoop = () => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
  }

  const viewObserver = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((e) => e.isIntersecting)
      if (onScreen && !document.hidden) startLoop()
      else stopLoop()
    },
    { threshold: 0.01 },
  )
  viewObserver.observe(container)

  const onVisibility = () => {
    if (document.hidden) stopLoop()
    else if (onScreen) startLoop()
  }
  document.addEventListener('visibilitychange', onVisibility)

  startLoop()

  // --- Teardown ---
  return () => {
    stopLoop()
    viewObserver.disconnect()
    resizeObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    geometries.forEach((g) => g.dispose())
    materials.forEach((m) => m.dispose())
    textures.forEach((t) => t.dispose())
    renderer.dispose()
  }
}
