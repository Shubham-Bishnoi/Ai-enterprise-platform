'use client'

/**
 * IntelligenceForgeScene — the live 3D canvas.
 *
 * A transparent WebGL renderer (alpha: true, no clear colour, no border, no
 * card) so the machine floats directly in the section's own atmosphere. Scroll
 * progress arrives as a framer-motion MotionValue and is written into a ref —
 * no React state per frame. Rendering pauses when the section leaves the
 * viewport or the tab hides, and everything is disposed on unmount.
 */

import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { createMaterialKit } from './forge-materials'
import { buildForge } from './forge-components'
import { applyForgeCamera, applyForgeProgress } from './forge-animation'

export function IntelligenceForgeScene({ progress }: { progress: MotionValue<number> }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    /* ------------------------------ Renderer ------------------------------ */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0x000000, 0) // fully transparent — the page is the background
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    host.appendChild(renderer.domElement)

    /* ------------------------------- Scene -------------------------------- */
    const scene = new THREE.Scene()
    // Small generated environment for the ceramic/glass response — not a texture.
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture
    // Kept low so the pastel glass keeps its saturation (no washed-out white).
    scene.environmentIntensity = 0.42

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60)

    scene.add(new THREE.HemisphereLight(0xffffff, 0xe8ecfa, 0.6))
    const key = new THREE.DirectionalLight(0xffffff, 0.85)
    key.position.set(5, 8, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xdfe9ff, 0.3)
    fill.position.set(-6, 3, 4)
    scene.add(fill)

    const kit = createMaterialKit()
    const forge = buildForge(kit)
    scene.add(forge.root)

    /* --------------------------- Progress source --------------------------- */
    const progressRef = { current: progress.get() }
    const unsubscribe = progress.on('change', (v) => {
      progressRef.current = v
    })

    /* ------------------------- Visibility + resize ------------------------- */
    let inView = true
    let tabVisible = document.visibilityState === 'visible'
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    }, { rootMargin: '160px 0px' })
    io.observe(host)
    const onVisibility = () => {
      tabVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)

    const resize = () => {
      const w = host.clientWidth || 1
      const h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    /* ------------------------------ Render loop ---------------------------- */
    const clock = new THREE.Clock()
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!inView || !tabVisible) return
      const t = clock.getElapsedTime()
      const p = progressRef.current
      applyForgeProgress(forge, p, t)
      applyForgeCamera(camera, p)
      renderer.render(scene, camera)
    }
    loop()

    /* ------------------------------- Cleanup ------------------------------- */
    return () => {
      cancelAnimationFrame(raf)
      unsubscribe()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      kit.dispose()
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement)
    }
  }, [progress])

  // Decorative: the construction story is told by the adjacent text stages.
  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />
}

export default IntelligenceForgeScene
