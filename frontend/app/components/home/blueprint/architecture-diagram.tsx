'use client'

/**
 * Code-native architecture diagram.
 *
 * Renders the structured `ArchitectureModel` (never a raster image) as a layered
 * left→right flow: four flow layers as columns, with a governance band spanning
 * beneath them as a shared control layer. Connector lines between adjacent layers
 * are drawn in an SVG overlay from *measured* node positions, so labels stay real
 * HTML text (always readable) while the flow is still shown with edges.
 *
 * Desktop: horizontal columns + measured connectors. Mobile: a vertical stack
 * with flow arrows (no shrunk SVG, no horizontal overflow). Selecting a node
 * reveals its description beside (desktop) or below (mobile) the diagram.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ArchLayerId, ArchNode, ArchNodeType, ArchitectureModel } from '@/lib/blueprint/model'
import { ChevronDown, UserCheck } from 'lucide-react'

const FLOW_LAYERS: ArchLayerId[] = ['sources', 'ingestion', 'intelligence', 'applications']

const TYPE_STYLE: Record<ArchNodeType, string> = {
  source: 'border-navy/15 bg-navy/[0.04] text-navy',
  ingestion: 'border-brand-blue/25 bg-brand-blue/[0.06] text-navy',
  intelligence: 'border-brand-purple/30 bg-brand-purple/[0.07] text-navy',
  application: 'border-brand-blue/25 bg-brand-blue/[0.06] text-navy',
  governance: 'border-border bg-secondary/70 text-navy',
  human: 'border-brand-red/30 bg-brand-red/[0.06] text-navy',
}

export function ArchitectureDiagram({ model }: { model: ArchitectureModel }) {
  const [selected, setSelected] = useState<ArchNode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>())
  const [paths, setPaths] = useState<{ d: string; key: string }[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const layerLabel = (id: ArchLayerId) => model.layers.find((l) => l.id === id)?.label ?? id
  const nodesIn = (id: ArchLayerId) => model.nodes.filter((n) => n.layer === id)
  const governanceNodes = model.nodes.filter((n) => n.layer === 'governance')

  const setNodeRef = useCallback((id: string) => (el: HTMLButtonElement | null) => {
    if (el) nodeRefs.current.set(id, el)
    else nodeRefs.current.delete(id)
  }, [])

  // Measure node centres and build connector paths (desktop columns only).
  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const box = container.getBoundingClientRect()
    setSize({ w: box.width, h: box.height })
    if (!isDesktop) {
      setPaths([])
      return
    }
    const centre = (id: string, side: 'l' | 'r') => {
      const el = nodeRefs.current.get(id)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: (side === 'r' ? r.right : r.left) - box.left, y: r.top + r.height / 2 - box.top }
    }
    const next: { d: string; key: string }[] = []
    for (const edge of model.edges) {
      const s = model.nodes.find((n) => n.id === edge.source)
      const t = model.nodes.find((n) => n.id === edge.target)
      if (!s || !t) continue
      // Only draw connectors within the horizontal flow (skip governance band).
      if (!FLOW_LAYERS.includes(s.layer) || !FLOW_LAYERS.includes(t.layer)) continue
      const a = centre(edge.source, 'r')
      const b = centre(edge.target, 'l')
      if (!a || !b) continue
      const mx = (a.x + b.x) / 2
      next.push({ key: `${edge.source}-${edge.target}`, d: `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}` })
    }
    setPaths(next)
  }, [model])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(() => measure())
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="min-w-0 flex-1">
        {/* Flow layers */}
        <div ref={containerRef} className="relative">
          {/* Connector overlay (desktop) */}
          {size.w > 0 && paths.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 hidden lg:block"
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`}
              aria-hidden="true"
            >
              {paths.map((p) => (
                <path key={p.key} d={p.d} fill="none" stroke="#155dfc" strokeOpacity="0.25" strokeWidth="1.5" />
              ))}
            </svg>
          )}

          <div className="grid grid-cols-1 gap-x-4 gap-y-3 lg:grid-cols-4">
            {FLOW_LAYERS.map((layer, li) => (
              <div key={layer} className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {layerLabel(layer)}
                </p>
                <div className="flex flex-col gap-2.5">
                  {nodesIn(layer).map((node) => (
                    <DiagramNode
                      key={node.id}
                      node={node}
                      selected={selected?.id === node.id}
                      onSelect={() => setSelected((s) => (s?.id === node.id ? null : node))}
                      innerRef={setNodeRef(node.id)}
                    />
                  ))}
                </div>
                {/* Mobile flow arrow between layers */}
                {li < FLOW_LAYERS.length - 1 && (
                  <div className="flex justify-center py-0.5 lg:hidden" aria-hidden="true">
                    <ChevronDown className="h-4 w-4 text-brand-blue/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Governance band — shared control layer wrapping the system */}
        <div className="mt-5 rounded-2xl border border-dashed border-brand-blue/30 bg-brand-blue/[0.03] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-blue">
            {layerLabel('governance')} · spans the system
          </p>
          <div className="flex flex-wrap gap-2.5">
            {governanceNodes.map((node) => (
              <DiagramNode
                key={node.id}
                node={node}
                selected={selected?.id === node.id}
                onSelect={() => setSelected((s) => (s?.id === node.id ? null : node))}
                innerRef={setNodeRef(node.id)}
                inline
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div className="lg:w-72 lg:shrink-0">
        <div className="rounded-2xl border border-border bg-background p-5">
          {selected ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-blue">
                {model.layers.find((l) => l.id === selected.layer)?.label}
              </p>
              <p className="mt-1.5 text-base font-semibold text-navy">{selected.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Select any component to see what it does. Governance and a human approval point wrap the whole system.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function DiagramNode({
  node,
  selected,
  onSelect,
  innerRef,
  inline = false,
}: {
  node: ArchNode
  selected: boolean
  onSelect: () => void
  innerRef: (el: HTMLButtonElement | null) => void
  inline?: boolean
}) {
  return (
    <button
      ref={innerRef}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'relative z-[1] flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all',
        'outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60',
        TYPE_STYLE[node.type],
        inline ? 'w-auto' : 'w-full',
        selected && 'ring-2 ring-brand-blue/60',
      )}
    >
      {node.type === 'human' && <UserCheck className="h-3.5 w-3.5 shrink-0 text-brand-red" aria-hidden="true" />}
      <span className="leading-tight">{node.label}</span>
    </button>
  )
}
