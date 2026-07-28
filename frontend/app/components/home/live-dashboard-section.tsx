'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/section-header'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { dashboardMetrics } from '@/data/site-content'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    const duration = 1400
    const start = performance.now()
    let frame: number
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, reduceMotion])

  return (
    <span ref={ref} className="text-4xl font-semibold tracking-tight text-navy md:text-5xl">
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

export function LiveDashboardSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Platform Operating View"
          title="Live AI Transformation Dashboard"
          subtitle="A command-center view of the GFF AI ecosystem."
        />

        <ScrollReveal>
          <div className="glass-panel rounded-3xl border border-border p-6 shadow-brand-soft md:p-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dashboardMetrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-2 rounded-2xl bg-card p-6 shadow-brand-soft">
                  <Counter value={m.value} suffix={m.suffix} />
                  <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Platform operating view — figures are illustrative of the GFF AI ecosystem in motion.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
