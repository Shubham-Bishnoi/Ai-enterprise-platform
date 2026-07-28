import Link from 'next/link'
import { ArrowRight, MessageSquare, FileText, Gauge, Calculator, Store, Boxes } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { experiences } from '@/data/site-content'
import { cn } from '@/lib/utils'

const icons = [MessageSquare, FileText, Gauge, Calculator, Store, Boxes]

const accentBg: Record<string, string> = {
  blue: 'bg-brand-blue/10 text-brand-blue',
  purple: 'bg-brand-purple/10 text-brand-purple',
  red: 'bg-brand-red/10 text-brand-red',
}

export function InteractiveExperienceSection() {
  return (
    <section id="interactive-experience" className="scroll-mt-24 bg-brand-soft-gradient py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Experience the Platform"
          title="Start With an Interactive AI Experience"
          subtitle="Product-grade entry points into the GFF AI ecosystem — explore before you commit."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, i) => {
            const Icon = icons[i % icons.length]
            return (
              <ScrollReveal key={exp.name} delay={(i % 3) * 0.08}>
                <Link
                  href={exp.href}
                  className="group flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-8 shadow-brand-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(7,22,47,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  <span className={cn('flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110', accentBg[exp.accent])}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-navy">{exp.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{exp.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue">
                    {exp.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
