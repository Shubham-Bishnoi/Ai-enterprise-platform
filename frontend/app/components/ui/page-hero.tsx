import { ScrollReveal } from '@/components/ui/scroll-reveal'
import type { ReactNode } from 'react'

type PageHeroProps = {
  eyebrow: string
  title: ReactNode
  subtitle: string
  children?: ReactNode
}

export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="gradient-hero pt-28 pb-12 md:pt-36 md:pb-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col items-center gap-5">
          <p className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue shadow-brand-soft">
            {eyebrow}
          </p>
          <h1 className="text-balance text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{subtitle}</p>
          {children}
        </ScrollReveal>
      </div>
    </section>
  )
}
