/**
 * Material kit for the Intelligence Forge.
 *
 * Everything is created through the kit so it can be disposed in one call on
 * unmount. The palette is the approved light language: white ceramic, frosted
 * transparent glass, and soft emissive colour accents — no dark surfaces.
 */

import * as THREE from 'three'

export type MaterialKit = ReturnType<typeof createMaterialKit>

export function createMaterialKit() {
  const materials: THREE.Material[] = []
  const geometries: THREE.BufferGeometry[] = []
  const textures: THREE.Texture[] = []

  const trackM = <T extends THREE.Material>(m: T): T => {
    materials.push(m)
    return m
  }
  const trackG = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g)
    return g
  }
  const trackT = <T extends THREE.Texture>(t: T): T => {
    textures.push(t)
    return t
  }

  /** Rounded white ceramic. */
  const ceramic = trackM(
    new THREE.MeshStandardMaterial({ color: 0xf6f7fb, roughness: 0.34, metalness: 0.02 }),
  )

  /** Slightly warmer ceramic for the base. */
  const ceramicBase = trackM(
    new THREE.MeshStandardMaterial({ color: 0xf1f2f8, roughness: 0.42, metalness: 0.02 }),
  )

  /** Frosted tinted glass. The animation retints shared instances per frame. */
  const glass = (hex: number, opacity = 0.42, emissiveScale = 0.35) =>
    trackM(
      new THREE.MeshPhysicalMaterial({
        color: hex,
        roughness: 0.14,
        metalness: 0,
        transparent: true,
        opacity,
        emissive: hex,
        emissiveIntensity: emissiveScale,
        depthWrite: false,
      }),
    )

  /** Soft self-lit accent (glow cores, pulses). */
  const emissive = (hex: number, opacity = 0.9) =>
    trackM(new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity, depthWrite: false }))

  /** Soft radial contact-shadow texture (drawn once, client-side). */
  const shadowTexture = () => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, 'rgba(30,40,70,0.55)')
    grad.addColorStop(0.55, 'rgba(30,40,70,0.18)')
    grad.addColorStop(1, 'rgba(30,40,70,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    return trackT(new THREE.CanvasTexture(canvas))
  }

  const dispose = () => {
    materials.forEach((m) => m.dispose())
    geometries.forEach((g) => g.dispose())
    textures.forEach((t) => t.dispose())
    materials.length = geometries.length = textures.length = 0
  }

  return { ceramic, ceramicBase, glass, emissive, shadowTexture, trackG, dispose }
}
