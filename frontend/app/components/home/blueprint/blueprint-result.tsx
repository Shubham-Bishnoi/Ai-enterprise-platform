'use client'

/**
 * Generated blueprint — a concise, visual enterprise decision document.
 *
 * A personalised summary panel leads, followed by a compact tab rail
 * (Overview · Opportunities · 90-Day Roadmap · Architecture · Governance) and a
 * single next-action area. All content is driven by the structured blueprint
 * model; the architecture tab renders a code-native diagram (never a raster).
 */

import { useCallback, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Compass,
  Database,
  Download,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/api/analytics'
import type { Complexity, Priority, StructuredBlueprint } from '@/lib/blueprint/model'
import { ArchitectureDiagram } from './architecture-diagram'

type TabId = 'overview' | 'opportunities' | 'roadmap' | 'architecture' | 'governance'

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'roadmap', label: '90-Day Roadmap' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'governance', label: 'Governance' },
]

const LEVEL_TONE: Record<Complexity, string> = {
  Low: 'bg-emerald-500/10 text-emerald-700',
  Medium: 'bg-amber-500/10 text-amber-700',
  High: 'bg-brand-red/10 text-brand-red',
}

export function BlueprintResult({
  blueprint,
  onReset,
}: {
  blueprint: StructuredBlueprint
  onReset: () => void
}) {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<TabId>('overview')
  const contentRef = useRef<HTMLDivElement>(null)

  const changeTab = useCallback(
    (id: TabId) => {
      setTab(id)
      // Bring the result content back to its beginning — never the page header.
      requestAnimationFrame(() => {
        const el = contentRef.current
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top < 96) el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
      })
    },
    [reduce],
  )

  const download = useCallback(() => {
    trackEvent({
      eventName: 'blueprint_downloaded',
      source: 'homepage',
      component: 'BlueprintResult',
      payload: { industry: blueprint.industryVisualKey },
    })
    const text = blueprintToText(blueprint)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gff-ai-blueprint-${blueprint.industryVisualKey}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [blueprint])

  const onAction = useCallback(
    (key: string) => {
      if (key === 'refine') onReset()
      else if (key === 'download') download()
      else if (key === 'specialist') document.getElementById('talk-to-agent')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
      else if (key === 'workshop') window.location.href = '/contact'
    },
    [onReset, download, reduce],
  )

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_18px_48px_rgba(7,22,47,0.1)]">
      {/* ------------------------------ Summary ------------------------------ */}
      <div className="scroll-mt-24 border-b border-border p-6 md:p-10" ref={contentRef}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1 lg:basis-[62%]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">{blueprint.industryLabel}</span>
              <span className="text-muted-foreground" aria-hidden="true">·</span>
              <span className="text-xs font-medium text-muted-foreground">{blueprint.companySizeLabel}</span>
              {blueprint.isDemo && (
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">Illustrative sample</span>
              )}
            </div>
            <h3 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-navy md:text-4xl">
              {blueprint.blueprintTitle}
            </h3>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {blueprint.executiveSummary}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Indicator icon={Target} {...blueprint.indicators.primaryOpportunity} />
              <Indicator icon={Clock} {...blueprint.indicators.timeToValue} />
              <Indicator icon={Compass} {...blueprint.indicators.firstPhase} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-brand-blue/40 hover:text-brand-blue">
                <Download className="h-4 w-4" aria-hidden="true" /> Download
              </button>
              <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-brand-blue/40 hover:text-brand-blue">
                <RefreshCw className="h-4 w-4" aria-hidden="true" /> Regenerate
              </button>
            </div>
          </div>

          {/* Compact industry illustration — not a hero banner */}
          <div className="lg:basis-[38%]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[340px] overflow-hidden rounded-3xl border border-border bg-secondary/40">
              <Image
                src={blueprint.industryVisualSrc}
                alt={blueprint.industryVisualAlt}
                fill
                sizes="(min-width: 1024px) 340px, 80vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------- Tabs -------------------------------- */}
      <div className="sticky top-16 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
        <div
          role="tablist"
          aria-label="Blueprint sections"
          className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-3 md:px-8"
          onKeyDown={(e) => {
            const i = TABS.findIndex((t) => t.id === tab)
            if (e.key === 'ArrowRight') { e.preventDefault(); changeTab(TABS[(i + 1) % TABS.length].id) }
            if (e.key === 'ArrowLeft') { e.preventDefault(); changeTab(TABS[(i - 1 + TABS.length) % TABS.length].id) }
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`bp-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`bp-panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => changeTab(t.id)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                tab === t.id ? 'bg-brand-blue text-white shadow-brand-soft' : 'text-muted-foreground hover:bg-secondary hover:text-navy',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------ Panels ------------------------------- */}
      <div className="px-5 py-8 md:px-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            role="tabpanel"
            id={`bp-panel-${tab}`}
            aria-labelledby={`bp-tab-${tab}`}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            {tab === 'overview' && <OverviewPanel blueprint={blueprint} />}
            {tab === 'opportunities' && <OpportunitiesPanel priorities={blueprint.priorities} />}
            {tab === 'roadmap' && <RoadmapPanel blueprint={blueprint} />}
            {tab === 'architecture' && <ArchitectureDiagram model={blueprint.architecture} />}
            {tab === 'governance' && <GovernancePanel blueprint={blueprint} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --------------------------- Next actions ---------------------------- */}
      <div className="border-t border-border bg-secondary/30 px-5 py-8 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Next actions</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {blueprint.nextActions.map((a, i) => (
            <button
              key={a.key}
              type="button"
              onClick={() => onAction(a.key)}
              className={cn(
                'group flex h-full flex-col gap-1.5 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5',
                i === 0 ? 'border-transparent bg-brand-blue text-white shadow-brand-soft' : 'border-border bg-card hover:border-brand-blue/40',
              )}
            >
              <span className={cn('inline-flex items-center gap-1.5 text-sm font-semibold', i === 0 ? 'text-white' : 'text-navy')}>
                {a.key === 'download' && <Download className="h-4 w-4" aria-hidden="true" />}
                {a.key === 'specialist' && <MessageSquare className="h-4 w-4" aria-hidden="true" />}
                {a.key === 'workshop' && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                {a.key === 'refine' && <RefreshCw className="h-4 w-4" aria-hidden="true" />}
                {a.label}
              </span>
              <span className={cn('text-xs leading-relaxed', i === 0 ? 'text-white/85' : 'text-muted-foreground')}>{a.description}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={onReset} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-blue">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Start over
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Panels                                                                      */
/* -------------------------------------------------------------------------- */

function Indicator({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3.5">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-brand-blue" aria-hidden="true" />
        {label}
      </span>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-navy">{value}</p>
    </div>
  )
}

function OverviewPanel({ blueprint }: { blueprint: StructuredBlueprint }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-3">
        {blueprint.priorities.slice(0, 3).map((p) => (
          <OpportunityCard key={p.title} priority={p} compact />
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-background p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">Why this fits your organisation</p>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {blueprint.whyItFits.map((w) => (
            <li key={w} className="flex items-start gap-2 text-sm leading-relaxed text-navy">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
              {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function OpportunitiesPanel({ priorities }: { priorities: Priority[] }) {
  // Deterministic 3×3 impact × effort matrix (positions come from the data).
  const cell = (level: Complexity) => (level === 'High' ? 2 : level === 'Medium' ? 1 : 0)
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-border bg-background p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">Impact vs. effort</p>
        <div className="flex gap-3">
          <div className="flex flex-col items-center justify-center">
            <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground [writing-mode:vertical-rl] rotate-180">
              Business impact →
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
              {[2, 1, 0].map((row) =>
                [0, 1, 2].map((col) => {
                  const here = priorities.filter((p) => cell(p.impact) === row && cell(p.effort) === col)
                  return (
                    <div key={`${row}-${col}`} className={cn('relative flex min-h-[62px] items-center justify-center gap-1 rounded-lg border p-1', row >= 2 && col <= 0 ? 'border-brand-blue/30 bg-brand-blue/[0.04]' : 'border-border bg-secondary/30')}>
                      {here.map((p) => (
                        <span key={p.title} title={p.title} className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-blue px-2 text-xs font-semibold text-white">
                          {priorities.indexOf(p) + 1}
                        </span>
                      ))}
                    </div>
                  )
                }),
              )}
            </div>
            <p className="mt-1.5 text-right text-[11px] font-medium text-muted-foreground">Implementation effort →</p>
          </div>
        </div>
      </div>

      <ol className="flex flex-col gap-4">
        {priorities.map((p, i) => (
          <li key={p.title} className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <OpportunityCard priority={p} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function OpportunityCard({ priority, compact = false }: { priority: Priority; compact?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <h4 className="text-base font-semibold leading-snug text-navy">{priority.title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{priority.outcome}</p>
      {!compact && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-navy">Problem: </span>
          {priority.problem}
        </p>
      )}
      <div className="mt-auto flex flex-col gap-2.5 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone={LEVEL_TONE[priority.complexity]}>{priority.complexity} complexity</Tag>
          <Tag tone="bg-secondary text-muted-foreground">{priority.timeToValue}</Tag>
          <Tag tone="bg-brand-blue/10 text-brand-blue">{priority.impact} impact</Tag>
        </div>
        {priority.dataRequired.length > 0 && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span><span className="font-medium text-navy">Data: </span>{priority.dataRequired.join(', ')}</span>
          </p>
        )}
      </div>
    </div>
  )
}

function Tag({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', tone)}>{children}</span>
}

function RoadmapPanel({ blueprint }: { blueprint: StructuredBlueprint }) {
  const labels: Record<string, string> = { '0-30': 'Days 0–30', '31-60': 'Days 31–60', '61-90': 'Days 61–90' }
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {blueprint.roadmap.map((phase, i) => (
        <div key={phase.phase} className="relative flex flex-col gap-4 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">{i + 1}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue">{labels[phase.phase]}</p>
              <h4 className="text-base font-semibold text-navy">{phase.title}</h4>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{phase.objective}</p>

          <RoadmapBlock label="Deliverables">
            <ul className="flex flex-col gap-1.5">
              {phase.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-navy">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </RoadmapBlock>

          <div className="grid gap-3 border-t border-border pt-3">
            <MetaRow label="Owner" value={phase.owners.join(', ')} />
            <MetaRow label="Decision gate" value={phase.decisionGate} />
            <MetaRow label="Success signal" value={phase.successSignal} />
            <MetaRow label="Dependencies" value={phase.dependencies.join(', ')} />
          </div>
        </div>
      ))}
    </div>
  )
}

function RoadmapBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="font-medium text-navy">{label}: </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

function GovernancePanel({ blueprint }: { blueprint: StructuredBlueprint }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        Guidance to consider — not a compliance assessment. Validate applicability with your legal, risk, and compliance teams before relying on any control.
      </p>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-secondary/50 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              <th className="px-4 py-3">Control</th>
              <th className="px-4 py-3">Why it matters</th>
              <th className="px-4 py-3">Implementation</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {blueprint.governanceControls.map((c) => (
              <tr key={c.control} className="border-t border-border align-top">
                <td className="px-4 py-3 font-medium text-navy">{c.control}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.reason}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.implementation}</td>
                <td className="px-4 py-3 text-navy">{c.owner}</td>
                <td className="px-4 py-3"><span className="whitespace-nowrap rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue">{c.stage}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {blueprint.governanceControls.map((c) => (
          <div key={c.control} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-navy">{c.control}</h4>
              <span className="whitespace-nowrap rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue">{c.stage}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.reason}</p>
            <p className="mt-2 text-sm text-muted-foreground"><span className="font-medium text-navy">How: </span>{c.implementation}</p>
            <p className="mt-2 text-sm text-muted-foreground"><span className="font-medium text-navy">Owner: </span>{c.owner}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function blueprintToText(b: StructuredBlueprint): string {
  const lines: string[] = []
  lines.push(b.blueprintTitle)
  lines.push(`${b.industryLabel} · ${b.companySizeLabel}`)
  lines.push('')
  lines.push(b.executiveSummary)
  lines.push('')
  lines.push('PRIORITIES')
  b.priorities.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.title} — ${p.complexity} complexity, ${p.timeToValue}`)
    lines.push(`   Problem: ${p.problem}`)
    lines.push(`   Outcome: ${p.outcome}`)
    lines.push(`   Data: ${p.dataRequired.join(', ')}`)
  })
  lines.push('')
  lines.push('90-DAY ROADMAP')
  b.roadmap.forEach((r) => {
    lines.push(`${r.phase}: ${r.title} — ${r.objective}`)
    lines.push(`   Deliverables: ${r.deliverables.join('; ')}`)
    lines.push(`   Owner: ${r.owners.join(', ')} | Gate: ${r.decisionGate}`)
    lines.push(`   Success: ${r.successSignal}`)
  })
  lines.push('')
  lines.push('GOVERNANCE (guidance — validate applicability)')
  b.governanceControls.forEach((c) => lines.push(`- ${c.control} (${c.stage}, ${c.owner}): ${c.implementation}`))
  return lines.join('\n')
}
