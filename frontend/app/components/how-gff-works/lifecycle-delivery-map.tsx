import { ArrowDown } from 'lucide-react'

/**
 * Two-layer relationship map: the enterprise lifecycle rail on top, the GFF AI
 * delivery model beneath, with thin cobalt connectors joining each mapped
 * group. Pure HTML/CSS, readable without hover, and understandable in DOM
 * order (each column is one mapping). Mobile stacks the five mappings as
 * lifecycle → connector → delivery rows.
 */

const GROUPS = [
  { lifecycle: ['Discover', 'Design'], delivery: 'Garage', tint: 'rgba(255,77,109,0.07)' },
  { lifecycle: ['Engineer', 'Integrate'], delivery: 'Foundry', tint: 'rgba(168,85,247,0.07)' },
  { lifecycle: ['Production deployment'], delivery: 'Factory', tint: 'rgba(21,93,252,0.07)' },
  { lifecycle: ['Operate and continuously improve'], delivery: 'Operate and Optimize', tint: 'rgba(14,165,233,0.07)' },
  { lifecycle: ['Organisational expansion'], delivery: 'Scale', tint: 'rgba(16,185,129,0.07)' },
]

export function LifecycleDeliveryMap() {
  return (
    <div className="flex flex-col gap-6">
      {/* Desktop / tablet-landscape: aligned rails with connectors */}
      <div className="hidden md:block">
        <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise lifecycle
        </p>
        <div className="grid grid-cols-5 gap-3">
          {GROUPS.map((g) => (
            <div key={g.delivery} className="flex flex-col">
              {/* Upper rail — lifecycle activities, softly tinted segment */}
              <div
                className="flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/70 p-3 text-center"
                style={{ backgroundColor: g.tint }}
              >
                {g.lifecycle.map((stage) => (
                  <span key={stage} className="text-[13px] font-medium leading-snug text-navy">
                    {stage}
                  </span>
                ))}
              </div>
              {/* Connector */}
              <span aria-hidden="true" className="mx-auto h-6 w-px bg-brand-blue/50" />
              {/* Lower rail — delivery stage, more prominent */}
              <div className="flex min-h-[58px] items-center justify-center rounded-2xl border border-brand-blue/25 bg-card p-3 text-center shadow-brand-soft">
                <span className="text-sm font-semibold leading-snug text-navy">{g.delivery}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
          GFF AI delivery model
        </p>
      </div>

      {/* Mobile: five stacked mapping rows */}
      <div className="flex flex-col gap-4 md:hidden">
        {GROUPS.map((g) => (
          <div key={g.delivery} className="flex flex-col items-center gap-1.5">
            <div
              className="flex w-full flex-col items-center gap-1 rounded-2xl border border-border/70 p-3 text-center"
              style={{ backgroundColor: g.tint }}
            >
              {g.lifecycle.map((stage) => (
                <span key={stage} className="text-sm font-medium text-navy">
                  {stage}
                </span>
              ))}
            </div>
            <ArrowDown className="h-4 w-4 text-brand-blue/60" aria-hidden="true" />
            <div className="flex w-full items-center justify-center rounded-2xl border border-brand-blue/25 bg-card p-3 shadow-brand-soft">
              <span className="text-sm font-semibold text-navy">{g.delivery}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
