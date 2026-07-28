'use client'

/**
 * PageWideDataRibbons
 *
 * A production-grade SVG "data ribbon" field for the homepage hero. Thin curved
 * paths enter from both edges, sweep behind the copy, pinch to a waist behind
 * the 3D emblem (≈72% / 55%) and fan back out to the opposite edge — tying the
 * left copy, the emblem and the right edge into one continuous environment.
 *
 * Design rules honoured:
 * - Geometry is STATIC. Only travelling pulses, a few brightening nodes and a
 *   2–6px pointer parallax move.
 * - Colours run red/coral/magenta (left) → violet (centre) → blue/cyan (right)
 *   via one horizontal gradient shared by every ribbon.
 * - An invisible readability mask dims ribbons behind the left copy.
 * - No React state per frame: pulses use SMIL, nodes use CSS keyframes,
 *   parallax writes CSS variables smoothed by a CSS transition.
 * - Pauses (SMIL + CSS) when the hero leaves the viewport or the tab hides.
 * - Mobile trims paths/removes nodes+pulses+parallax; reduced-motion freezes.
 *
 * NOTE: every ribbon is SOLID. Dashed/dotted ribbon paths were removed on
 * purpose — because all ribbons pinch to the waist behind the emblem, any
 * dashed path read as a stray horizontal dashed line directly under the logo.
 */

import { useEffect, useRef } from 'react'

/* ------------------------------- geometry -------------------------------- */

const VB_W = 1440
const VB_H = 760
const WAIST_X = 1035 // ≈ 72%
const WAIST_Y = 415 // ≈ 55%
const MID_Y = 380
const N = 22

// Deterministic pseudo-random so SSR and client render identical paths.
const seeded = (i: number, s: number) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453
  return x - Math.floor(x)
}

type Ribbon = { id: string; d: string; opacity: number; width: number; mobile: boolean }

const RIBBONS: Ribbon[] = Array.from({ length: N }, (_, i): Ribbon => {
  const t = (i / (N - 1)) * 2 - 1
  const j1 = seeded(i, 1) - 0.5
  const j2 = seeded(i, 2) - 0.5
  const leftY = MID_Y + t * 300 + j1 * 42
  const waistY = WAIST_Y + t * 46 + j2 * 10
  const rightY = MID_Y - 8 + t * 252 + j1 * 34
  const x0 = -60
  const x1 = 1500
  const d =
    `M ${x0} ${leftY.toFixed(1)} ` +
    `C ${(x0 + (WAIST_X - x0) * 0.42).toFixed(1)} ${leftY.toFixed(1)}, ${(WAIST_X - 250).toFixed(1)} ${waistY.toFixed(1)}, ${WAIST_X} ${waistY.toFixed(1)} ` +
    `C ${(WAIST_X + 190).toFixed(1)} ${waistY.toFixed(1)}, ${(x1 - (x1 - WAIST_X) * 0.5).toFixed(1)} ${rightY.toFixed(1)}, ${x1} ${rightY.toFixed(1)}`

  // A few emphasised ribbons for depth; the rest faint. All solid.
  const emph = i % 6 === 2
  const opacity = emph ? +(0.28 + seeded(i, 3) * 0.14).toFixed(3) : +(0.1 + seeded(i, 5) * 0.13).toFixed(3)
  const width = emph ? 1.8 : 1.1

  return { id: `rib-${i}`, d, opacity, width, mobile: i % 2 === 0 }
})

// Pulses ride centre-ish ribbons so most motion passes through the emblem.
const PULSES = [
  { path: 'rib-10', dur: 5.5, begin: -1, reverse: false, warm: true },
  { path: 'rib-11', dur: 8, begin: -3, reverse: true, warm: false },
  { path: 'rib-9', dur: 12, begin: -5, reverse: false, warm: true },
  { path: 'rib-12', dur: 7, begin: -2, reverse: true, warm: false },
  { path: 'rib-13', dur: 14, begin: -8, reverse: false, warm: false },
  { path: 'rib-8', dur: 9.5, begin: -4, reverse: true, warm: true },
]

// Small abstract markers (solid only — no dashes). Kept out of the band
// directly under the logo.
type Node = { x: number; y: number; type: 'circle' | 'diamond' | 'tri'; c: string; d: number }
const NODES: Node[] = [
  { x: 250, y: 250, type: 'circle', c: '#FF4D6D', d: 4.5 },
  { x: 520, y: 470, type: 'diamond', c: '#EF233C', d: 6 },
  { x: 760, y: 300, type: 'circle', c: '#FF3D8B', d: 5 },
  { x: 700, y: 560, type: 'tri', c: '#C084FC', d: 7 },
  { x: 900, y: 250, type: 'tri', c: '#A855F7', d: 7.5 },
  { x: 1300, y: 300, type: 'circle', c: '#155DFC', d: 6 },
  { x: 1360, y: 470, type: 'diamond', c: '#22B0FF', d: 5 },
  { x: 1250, y: 250, type: 'circle', c: '#155DFC', d: 8 },
  { x: 430, y: 560, type: 'circle', c: '#FF4D6D', d: 6.5 },
  { x: 340, y: 340, type: 'circle', c: '#7C5CFC', d: 5.5 },
]

function NodeShape({ n }: { n: Node }) {
  if (n.type === 'diamond') return <rect x={-3.2} y={-3.2} width={6.4} height={6.4} transform="rotate(45)" fill="currentColor" />
  if (n.type === 'tri') return <polygon points="0,-4 3.6,3 -3.6,3" fill="currentColor" />
  return <circle r={3} fill="currentColor" />
}

/* ------------------------------ component -------------------------------- */

export function PageWideDataRibbons() {
  const svgRef = useRef<SVGSVGElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const root = rootRef.current
    const section = root?.closest('section')
    if (!svg || !root || !section) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 768px)').matches
    if (reduce || !desktop) {
      svg.pauseAnimations()
      return
    }

    // --- pointer parallax (CSS-var + CSS-transition, no rAF, no React state) ---
    let raf = 0
    let onScreen = true
    const onMove = (e: PointerEvent) => {
      if (raf || !onScreen) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = section.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        svg.style.setProperty('--pbx', `${(nx * 3).toFixed(2)}px`)
        svg.style.setProperty('--pby', `${(ny * 3).toFixed(2)}px`)
        svg.style.setProperty('--pfx', `${(nx * 6).toFixed(2)}px`)
        svg.style.setProperty('--pfy', `${(ny * 6).toFixed(2)}px`)
      })
    }
    const onLeave = () => {
      svg.style.setProperty('--pbx', '0px')
      svg.style.setProperty('--pby', '0px')
      svg.style.setProperty('--pfx', '0px')
      svg.style.setProperty('--pfy', '0px')
    }
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)

    // --- pause when off-screen or tab hidden ---
    const setPaused = (paused: boolean) => {
      if (paused) {
        svg.pauseAnimations()
        root.classList.add('ribbons-paused')
      } else {
        svg.unpauseAnimations()
        root.classList.remove('ribbons-paused')
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting)
        setPaused(!onScreen || document.hidden)
        if (!onScreen) onLeave()
      },
      { threshold: 0.01 },
    )
    io.observe(section)
    const onVis = () => setPaused(document.hidden || !onScreen)
    document.addEventListener('visibilitychange', onVis)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{RIBBON_CSS}</style>
      <svg ref={svgRef} className="ribbon-svg h-full w-full" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="rib-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VB_W} y2="0">
            <stop offset="0" stopColor="#EF233C" />
            <stop offset="0.12" stopColor="#FF4D6D" />
            <stop offset="0.26" stopColor="#FF3D8B" />
            <stop offset="0.42" stopColor="#C084FC" />
            <stop offset="0.55" stopColor="#A855F7" />
            <stop offset="0.7" stopColor="#7C5CFC" />
            <stop offset="0.82" stopColor="#155DFC" />
            <stop offset="0.95" stopColor="#22B0FF" />
          </linearGradient>

          <radialGradient id="pulse-warm">
            <stop offset="0" stopColor="#FFE3EC" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#FF5D86" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FF5D86" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pulse-cool">
            <stop offset="0" stopColor="#E3F0FF" stopOpacity="0.9" />
            <stop offset="0.4" stopColor="#3E9BFF" stopOpacity="0.6" />
            <stop offset="1" stopColor="#3E9BFF" stopOpacity="0" />
          </radialGradient>

          {/* vertical fade (top/bottom) + left readability dimming */}
          <linearGradient id="rib-vfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.14" stopColor="#fff" />
            <stop offset="0.86" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <radialGradient id="rib-readfade">
            <stop offset="0" stopColor="#000" stopOpacity="0.72" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <mask id="rib-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
            <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#rib-vfade)" />
            <ellipse cx="430" cy="470" rx="490" ry="265" fill="url(#rib-readfade)" />
          </mask>
        </defs>

        <g mask="url(#rib-mask)">
          {/* Back layer — the static ribbon structure (all solid) */}
          <g className="par-back">
            {RIBBONS.map((r) => (
              <path
                key={r.id}
                id={r.id}
                d={r.d}
                stroke="url(#rib-grad)"
                strokeWidth={r.width}
                strokeOpacity={r.opacity}
                strokeLinecap="round"
                className={r.mobile ? '' : 'rib-extra'}
              />
            ))}
          </g>

          {/* Front layer — pulses + nodes */}
          <g className="par-front">
            {NODES.map((n, i) => (
              <g key={i} transform={`translate(${n.x} ${n.y})`} className="rib-extra">
                <g className="rib-node" style={{ color: n.c, animationDuration: `${n.d}s`, animationDelay: `${-i * 0.9}s` } as React.CSSProperties}>
                  <NodeShape n={n} />
                </g>
              </g>
            ))}

            {PULSES.map((p, i) => (
              <circle key={i} r={5} fill={`url(#${p.warm ? 'pulse-warm' : 'pulse-cool'})`} className="rib-extra">
                <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="indefinite" calcMode="linear" keyPoints={p.reverse ? '1;0' : '0;1'} keyTimes="0;1">
                  <mpath href={`#${p.path}`} />
                </animateMotion>
              </circle>
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}

const RIBBON_CSS = `
.ribbon-svg { --pbx:0px; --pby:0px; --pfx:0px; --pfy:0px; }
.par-back { transform: translate(var(--pbx), var(--pby)); transition: transform .55s ease-out; }
.par-front { transform: translate(var(--pfx), var(--pfy)); transition: transform .5s ease-out; }
.rib-node { transform-box: fill-box; transform-origin: center; animation-name: ribNode; animation-timing-function: ease-in-out; animation-iteration-count: infinite; opacity: .16; }
@keyframes ribNode { 0%,100% { opacity:.12; transform: scale(.8); } 50% { opacity:.4; transform: scale(1.15); } }
.ribbons-paused .rib-node { animation-play-state: paused !important; }
@media (max-width: 767px) {
  .rib-extra { display: none; }
  .par-back, .par-front { transition: none; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .rib-node { animation: none !important; }
  .par-back, .par-front { transition: none; transform: none; }
}
`
