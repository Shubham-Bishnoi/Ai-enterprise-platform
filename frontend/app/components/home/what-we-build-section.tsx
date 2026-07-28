import Link from 'next/link'
import {
  Compass,
  Cpu,
  Bot,
  ShieldCheck,
  FlaskConical,
  Factory,
  Store,
  Activity,
} from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { capabilities } from '@/data/site-content'

const icons = [Compass, Cpu, Bot, ShieldCheck, FlaskConical, Factory, Store, Activity]

const iconStyles = [
  'bg-brand-blue/10 text-brand-blue',
  'bg-brand-purple/10 text-brand-purple',
  'bg-brand-red/10 text-brand-red',
  'bg-brand-blue/10 text-brand-blue',
  'bg-brand-purple/10 text-brand-purple',
  'bg-brand-red/10 text-brand-red',
  'bg-brand-blue/10 text-brand-blue',
  'bg-brand-purple/10 text-brand-purple',
]

export function WhatWeBuildSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What We Engineer"
          title="Capabilities for the Intelligent Enterprise"
          subtitle="Strategy, enterprise memory, AI agents, governance, platforms and managed operations — engineered as connected capabilities rather than isolated AI projects."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, i) => {
            const Icon = icons[i % icons.length]
            return (
              <ScrollReveal key={cap.name} delay={(i % 4) * 0.08}>
                <Link
                  href="/capabilities"
                  className="group flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconStyles[i % iconStyles.length]}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold text-navy">{cap.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
                  </div>
                  <p className="mt-auto text-sm font-medium text-brand-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {cap.outcome}
                  </p>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
