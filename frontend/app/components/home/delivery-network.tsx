'use client'

/**
 * DeliveryNetworkExplorer — the location block beneath the (protected)
 * "Global AI Transformation Presence" card. Editorial two-column layout:
 * a lightweight dotted SVG world map with six synchronised location nodes on
 * the left; eyebrow, heading, description, a pill location explorer, the
 * selected-location panel and contact actions on the right. Active network
 * paths draw once on entry (skipped under reduced motion); nothing moves
 * continuously. No mapping libraries — the landmass is a dot grid generated
 * from coarse continent polygons at module load.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Mail, MapPin, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { contact } from '@/data/site-content'

/* ------------------------------------------------------------------ data */

type NetworkLocation = {
  id: string
  name: string
  role: string
  leader: string | null
  status: 'active' | 'future'
  /** Equirectangular position inside the 800x440 viewBox. */
  x: number
  y: number
  /** Which side the map label sits on, to avoid collisions. */
  label: 'right' | 'left' | 'top' | 'bottom'
  hub?: boolean
}

const LOCATIONS: NetworkLocation[] = [
  { id: 'singapore', name: 'Singapore', role: 'Global hub', leader: 'Ashish Chandra', status: 'active', x: 626, y: 246, label: 'right', hub: true },
  { id: 'india', name: 'India', role: 'Engineering and delivery', leader: 'Malvika Singh — Chief Operating Officer', status: 'active', x: 567, y: 179, label: 'top' },
  { id: 'australia', name: 'Australia', role: 'Risk and governance', leader: 'Meenakshi Arekar — Chief Risk Officer', status: 'active', x: 695, y: 335, label: 'bottom' },
  { id: 'london', name: 'London', role: 'Future expansion market', leader: null, status: 'future', x: 388, y: 76, label: 'top' },
  { id: 'usa', name: 'USA', role: 'Future expansion market', leader: null, status: 'future', x: 165, y: 119, label: 'bottom' },
  { id: 'middle-east', name: 'Middle East', role: 'Future expansion market', leader: null, status: 'future', x: 495, y: 167, label: 'left' },
]

const byId = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]))

/** Solid network paths between the three active locations. */
const ACTIVE_LINKS: [string, string][] = [
  ['singapore', 'india'],
  ['singapore', 'australia'],
  ['india', 'australia'],
]

/** Dashed expansion paths from the active network towards future markets. */
const FUTURE_LINKS: [string, string][] = [
  ['india', 'london'],
  ['singapore', 'usa'],
  ['india', 'middle-east'],
]

/* ------------------------------------------------- dotted world landmass */

const VIEW_W = 800
const VIEW_H = 440
// Projection: lon -170..180 -> x 0..800, lat 74..-56 -> y 0..440
const px = (lon: number) => ((lon + 170) / 350) * VIEW_W
const py = (lat: number) => ((74 - lat) / 130) * VIEW_H

type Poly = [number, number][] // [lon, lat]

const LAND: Poly[] = [
  // North America (incl. Mexico)
  [[-166, 62], [-152, 61], [-140, 70], [-122, 68], [-105, 69], [-90, 70], [-80, 66], [-75, 61], [-58, 52], [-65, 46], [-70, 43], [-74, 40], [-76, 35], [-81, 31], [-80, 26], [-84, 30], [-90, 29], [-95, 27], [-97, 22], [-105, 20], [-107, 25], [-111, 24], [-114, 30], [-121, 35], [-125, 41], [-124, 48], [-132, 55], [-140, 59], [-152, 58], [-160, 56], [-168, 55]],
  // Central America
  [[-97, 21], [-90, 16], [-84, 10], [-78, 8], [-80, 10], [-87, 15], [-93, 18], [-98, 24]],
  // Greenland
  [[-51, 61], [-42, 60], [-25, 69], [-20, 76], [-30, 81], [-50, 79], [-58, 72], [-53, 66]],
  // South America
  [[-77, 8], [-62, 6], [-52, 2], [-35, -7], [-38, -15], [-48, -25], [-56, -32], [-63, -40], [-68, -46], [-70, -54], [-66, -55], [-72, -48], [-73, -36], [-70, -20], [-76, -8], [-80, -3], [-78, 5]],
  // Europe (incl. Scandinavia)
  [[-9, 43], [-9, 37], [-2, 36], [3, 40], [8, 43], [14, 40], [19, 40], [23, 37], [26, 40], [30, 45], [40, 46], [48, 47], [55, 52], [60, 57], [62, 66], [55, 70], [42, 68], [30, 70], [22, 70], [14, 66], [6, 61], [8, 57], [1, 52], [-4, 49], [-9, 47]],
  // British Isles
  [[-5, 50], [1, 51], [0, 53], [-2, 56], [-4, 58], [-7, 57], [-8, 54], [-5, 53]],
  // Africa
  [[-16, 14], [-17, 21], [-12, 30], [-5, 34], [3, 36], [10, 34], [19, 32], [30, 31], [34, 28], [37, 20], [43, 12], [50, 12], [47, 4], [41, -2], [40, -14], [35, -22], [32, -29], [25, -34], [19, -34], [14, -25], [12, -16], [9, -1], [9, 4], [0, 6], [-8, 4], [-13, 8]],
  // Arabia / Middle East
  [[35, 31], [39, 20], [43, 12], [52, 14], [59, 22], [56, 25], [48, 29], [40, 32]],
  // Northern & central Asia
  [[50, 50], [62, 46], [75, 46], [90, 49], [105, 46], [118, 49], [132, 45], [140, 49], [152, 59], [162, 60], [172, 66], [179, 68], [179, 71], [160, 72], [140, 73], [112, 74], [92, 73], [72, 71], [62, 69], [58, 60], [50, 55]],
  // Mid-Asia band joining north to south
  [[50, 51], [70, 44], [90, 47], [110, 44], [130, 47], [140, 50], [140, 43], [112, 41], [92, 44], [70, 39], [55, 41], [48, 46]],
  // South Asia + Indochina
  [[61, 26], [68, 25], [71, 22], [76, 8], [80, 13], [85, 20], [90, 22], [93, 21], [96, 16], [99, 9], [104, 1], [103, 8], [100, 15], [98, 21], [95, 26], [88, 28], [79, 31], [70, 33], [64, 31], [60, 28]],
  // China / East Asia
  [[95, 26], [104, 22], [110, 20], [116, 23], [121, 30], [122, 37], [126, 41], [131, 43], [135, 46], [126, 46], [118, 45], [108, 41], [99, 34], [94, 30]],
  // Japan
  [[130, 31], [134, 34], [139, 35], [141, 40], [144, 44], [141, 43], [137, 37], [132, 34]],
  // Maritime Southeast Asia
  [[95, 5], [104, -1], [113, -7], [121, -9], [131, -3], [139, -5], [147, -6], [142, -9], [131, -8], [119, -10], [110, -8], [101, -1], [96, 3]],
  // Australia
  [[114, -22], [122, -18], [130, -13], [137, -12], [142, -11], [146, -15], [149, -20], [153, -27], [151, -33], [146, -39], [140, -38], [134, -35], [129, -32], [123, -34], [115, -34], [113, -26]],
]

function inPoly(lon: number, lat: number, poly: Poly): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

const DOTS: { x: number; y: number }[] = (() => {
  const dots: { x: number; y: number }[] = []
  for (let lat = -55; lat <= 73; lat += 2.9) {
    for (let lon = -169; lon <= 179; lon += 2.9) {
      if (LAND.some((p) => inPoly(lon, lat, p))) dots.push({ x: px(lon), y: py(lat) })
    }
  }
  return dots
})()

/** Curved path between two locations, bowed perpendicular to the chord. */
function arc(a: NetworkLocation, b: NetworkLocation, bow: number): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  return `M ${a.x} ${a.y} Q ${mx - (dy / len) * bow} ${my + (dx / len) * bow} ${b.x} ${b.y}`
}

/* -------------------------------------------------------------- component */

export function DeliveryNetworkExplorer() {
  const reduceMotion = useReducedMotion()
  const [selectedId, setSelectedId] = useState('singapore')
  const [open, setOpen] = useState(false)
  const [activeOption, _setActiveOption] = useState(0)
  // The ref is the synchronous source of truth (state renders it) so a
  // same-frame Enter always reads the latest option, even before React has
  // re-rendered between keystrokes.
  const activeOptionRef = useRef(0)
  const setActiveOption = useCallback((updater: number | ((i: number) => number)) => {
    const next = typeof updater === 'function' ? updater(activeOptionRef.current) : updater
    activeOptionRef.current = next
    _setActiveOption(next)
  }, [])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverId = useId()
  const selected = byId[selectedId]
  const selectedIndex = LOCATIONS.findIndex((l) => l.id === selectedId)

  const select = useCallback((id: string) => setSelectedId(id), [])

  const stepTo = (dir: 1 | -1) => {
    const next = (selectedIndex + dir + LOCATIONS.length) % LOCATIONS.length
    setSelectedId(LOCATIONS[next].id)
  }

  const openList = () => {
    setActiveOption(selectedIndex)
    setOpen(true)
  }
  const closeList = (refocus = true) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  // Close the popover on any outside pointer press.
  useEffect(() => {
    if (!open) return
    const onPress = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPress)
    return () => document.removeEventListener('pointerdown', onPress)
  }, [open])

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveOption((i) => Math.min(LOCATIONS.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveOption((i) => Math.max(0, i - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveOption(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveOption(LOCATIONS.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(LOCATIONS[activeOptionRef.current].id)
      closeList()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeList()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const linkTouches = (pair: [string, string]) => pair.includes(selectedId)

  return (
    <div ref={rootRef} className="relative">
      {/* Quiet atmospheric wash behind the block */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[48px]"
        style={{
          background:
            'radial-gradient(46rem 28rem at 28% 45%, rgba(21,93,252,0.055), transparent 68%), radial-gradient(30rem 20rem at 78% 20%, rgba(168,85,247,0.04), transparent 70%)',
        }}
      />

      <div className="grid gap-10 lg:min-h-[620px] lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:grid-rows-[auto_1fr] lg:items-center lg:gap-x-20 lg:gap-y-8">
        {/* -------------------------------------------------- editorial copy */}
        <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:self-end">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">Global Delivery Network</p>
          <h3 className="text-balance text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-navy md:text-[2.75rem] xl:text-[3.4rem]">
            One delivery network
          </h3>
          <p className="max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Singapore as global hub, India for engineering and delivery, Australia for risk and governance — expanding
            into London, the USA, and the Middle East.
          </p>
        </div>

        {/* ---------------------------------------------------------- map */}
        <div className="relative lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div className="relative mx-auto h-[320px] w-full max-w-[560px] sm:h-[380px] lg:h-auto lg:max-w-none lg:[aspect-ratio:800/440]">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="dn-link" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#155DFC" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
                <radialGradient id="dn-fade" cx="50%" cy="50%" r="62%">
                  <stop offset="72%" stopColor="#fff" stopOpacity="0" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="1" />
                </radialGradient>
              </defs>

              {/* Dotted landmass */}
              <g fill="#155DFC">
                {DOTS.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={1.7} opacity={0.22} />
                ))}
              </g>

              {/* Expansion paths (dashed, quiet) */}
              {FUTURE_LINKS.map((pair) => {
                const [a, b] = pair
                const highlighted = linkTouches(pair)
                return (
                  <motion.path
                    key={`${a}-${b}`}
                    d={arc(byId[a], byId[b], a === 'singapore' && b === 'usa' ? -70 : -26)}
                    fill="none"
                    stroke="#155DFC"
                    strokeWidth={highlighted ? 1.6 : 1.1}
                    strokeDasharray="3 6"
                    strokeLinecap="round"
                    className="hidden sm:block"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    whileInView={{ opacity: highlighted ? 0.5 : 0.24 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    animate={{ opacity: highlighted ? 0.5 : 0.24 }}
                  />
                )
              })}

              {/* Active network paths (draw once on entry) */}
              {ACTIVE_LINKS.map((pair, i) => {
                const [a, b] = pair
                const highlighted = linkTouches(pair)
                return (
                  <motion.path
                    key={`${a}-${b}`}
                    d={arc(byId[a], byId[b], i === 1 ? 36 : 24)}
                    fill="none"
                    stroke="url(#dn-link)"
                    strokeWidth={highlighted ? 2.4 : 1.6}
                    strokeLinecap="round"
                    initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: highlighted ? 0.85 : 0.4 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 1.05, delay: 0.15 * i, ease: 'easeInOut' }}
                    animate={{ opacity: highlighted ? 0.85 : 0.4 }}
                  />
                )
              })}

              {/* Soft edge fade above the dots, below the markers */}
              <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#dn-fade)" />
            </svg>

            {/* Location markers (HTML buttons over the SVG) */}
            {LOCATIONS.map((loc) => {
              const isSelected = loc.id === selectedId
              const active = loc.status === 'active'
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => select(loc.id)}
                  onMouseEnter={() => select(loc.id)}
                  onFocus={() => select(loc.id)}
                  aria-pressed={isSelected}
                  aria-label={`${loc.name} — ${loc.role}${active ? '' : ', future'}`}
                  className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none"
                  style={{ left: `${(loc.x / VIEW_W) * 100}%`, top: `${(loc.y / VIEW_H) * 100}%` }}
                >
                  {/* Marker */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative flex items-center justify-center rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-brand-blue group-focus-visible:ring-offset-2',
                      active
                        ? cn(
                            'bg-brand-blue shadow-[0_0_0_5px_rgba(21,93,252,0.14)]',
                            loc.hub ? 'h-[18px] w-[18px]' : 'h-[14px] w-[14px]',
                            isSelected && 'shadow-[0_0_0_8px_rgba(21,93,252,0.18)]',
                          )
                        : cn(
                            'h-[13px] w-[13px] border-[1.5px] border-dashed bg-white/80',
                            isSelected ? 'border-brand-blue' : 'border-navy/40',
                          ),
                    )}
                  >
                    {active && <span className="h-[5px] w-[5px] rounded-full bg-white" />}
                  </span>
                  {/* Label */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute whitespace-nowrap text-[11px] font-medium leading-none transition-colors duration-200',
                      isSelected ? 'text-brand-blue' : active ? 'text-navy/80' : 'text-navy/45',
                      loc.label === 'right' && 'left-[calc(50%+14px)] top-1/2 -translate-y-1/2',
                      loc.label === 'left' && 'right-[calc(50%+14px)] top-1/2 -translate-y-1/2',
                      loc.label === 'top' && 'bottom-[calc(50%+11px)] left-1/2 -translate-x-1/2',
                      loc.label === 'bottom' && 'left-1/2 top-[calc(50%+11px)] -translate-x-1/2',
                    )}
                  >
                    {loc.name}
                    {!active && <span className="ml-1 font-normal text-navy/35">· Future</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ---------------------------------------------- explorer + panel */}
        <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-2 lg:self-start">
          {/* Pill selector */}
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-controls={popoverId}
                aria-haspopup="listbox"
                onClick={() => (open ? closeList(false) : openList())}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' && !open) {
                    e.preventDefault()
                    openList()
                  }
                }}
                className="flex min-h-[56px] flex-1 items-center gap-3 rounded-full border border-navy/10 bg-white py-2.5 pl-4 pr-5 text-left shadow-[0_10px_30px_rgba(7,22,47,0.07)] transition-all duration-300 hover:border-brand-blue/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold text-navy">{selected.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{selected.role}</span>
                </span>
                <ChevronDown
                  className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300', open && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                aria-label="Previous location"
                onClick={() => stepTo(-1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition-colors hover:border-brand-blue/35 hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next location"
                onClick={() => stepTo(1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition-colors hover:border-brand-blue/35 hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Popover listbox */}
            {open && (
              <ul
                ref={listRef}
                id={popoverId}
                role="listbox"
                tabIndex={-1}
                aria-label="GFF AI locations"
                aria-activedescendant={`${popoverId}-${LOCATIONS[activeOption].id}`}
                onKeyDown={onListKeyDown}
                className="absolute inset-x-0 top-[calc(100%+8px)] z-20 flex flex-col gap-0.5 rounded-[22px] border border-navy/10 bg-white/95 p-1.5 shadow-[0_24px_60px_rgba(7,22,47,0.14)] backdrop-blur-md focus:outline-none"
              >
                {LOCATIONS.map((loc, i) => {
                  const isSel = loc.id === selectedId
                  return (
                    <li
                      key={loc.id}
                      id={`${popoverId}-${loc.id}`}
                      role="option"
                      aria-selected={isSel}
                      onClick={() => {
                        select(loc.id)
                        closeList()
                      }}
                      onMouseMove={() => setActiveOption(i)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-colors',
                        i === activeOption ? 'bg-brand-blue/10' : 'bg-transparent',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-2.5 w-2.5 shrink-0 rounded-full',
                          loc.status === 'active' ? 'bg-brand-blue' : 'border-[1.5px] border-dashed border-navy/40 bg-transparent',
                        )}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium text-navy">
                          {loc.name}
                          {loc.status === 'future' && <span className="text-muted-foreground"> — Future</span>}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">{loc.role}</span>
                      </span>
                      {isSel && <Check className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Selected-location panel */}
          <div
            aria-live="polite"
            className={cn(
              'rounded-[22px] border p-5 transition-colors duration-300',
              selected.status === 'active' ? 'border-brand-blue/20 bg-white shadow-brand-soft' : 'border-dashed border-navy/15 bg-white/60',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <p className="text-lg font-semibold leading-none text-navy">{selected.name}</p>
                <p className="text-sm text-muted-foreground">{selected.role}</p>
                {selected.leader && <p className="text-sm font-medium text-navy">{selected.leader}</p>}
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                  selected.status === 'active'
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'border border-dashed border-navy/25 text-muted-foreground',
                )}
              >
                {selected.status === 'active' ? 'Active' : 'Future'}
              </span>
            </div>
          </div>

          {/* Contact actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2.5 rounded-full border border-navy/10 bg-white px-4 py-2.5 transition-colors hover:border-brand-blue/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <Mail className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Email GFF AI</span>
                <span className="text-sm font-medium text-navy">{contact.email}</span>
              </span>
            </a>
            <a
              href="tel:+6593239991"
              className="flex items-center gap-2.5 rounded-full border border-navy/10 bg-white px-4 py-2.5 transition-colors hover:border-brand-blue/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <Phone className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Call Singapore</span>
                <span className="text-sm font-medium text-navy">{contact.phone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
