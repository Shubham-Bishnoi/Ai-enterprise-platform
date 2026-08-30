'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { BrandButton } from '@/components/ui/brand-button'
import { IntelligenceForgeHero } from '@/components/home/intelligence-forge-hero'
import { PageWideDataRibbons } from '@/components/home/page-wide-data-ribbons'

/**
 * Primary landing hero — the first screen after the navbar.
 *
 * Left column: the existing GFF AI copy and CTAs (unchanged wording and
 * destinations). Right column: the interactive Intelligence Forge 3D emblem,
 * which composites over the light hero via a transparent canvas — no card,
 * border or seam. On mobile the two stack (copy first, then a static emblem).
 */
export function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="gradient-hero relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
      {/* Atmospheric wash: pale blue upper-right, lavender centre, faint pink
          left/lower — one continuous light environment (no panels/cards). */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[34rem] w-[38rem] rounded-full bg-brand-blue/[0.08] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[30rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand-purple/[0.06] blur-3xl" />
        <div className="absolute -left-24 top-8 h-[28rem] w-[28rem] rounded-full bg-brand-red/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[30rem] rounded-full bg-brand-coral/[0.05] blur-3xl" />
      </div>

      {/* Page-wide data ribbons — behind all content, in front of the wash. */}
      <PageWideDataRibbons />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[46%_54%] lg:gap-8 lg:px-8">
        {/* -------------------------------- Copy -------------------------------- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue shadow-brand-soft"
          >
            Enterprise Intelligence Engineering
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-7 text-balance text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-navy sm:text-5xl lg:text-[3.6rem]"
          >
            Building Intelligent Enterprises,
            <br />
            <span className="text-brand-gradient">Not AI Projects</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl lg:max-w-xl"
          >
            GFF AI helps organisations connect knowledge, people, systems, decisions, AI agents and governance into a
            secure, continuously improving enterprise intelligence model.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <BrandButton href="#talk-to-agent" size="lg" cta="hero_talk_to_gff_ai">
              Talk to GFF AI
            </BrandButton>
            <BrandButton href="#blueprint" variant="secondary" size="lg" cta="hero_generate_blueprint">
              Generate Blueprint
            </BrandButton>
            <BrandButton href="#interactive-experience" variant="secondary" size="lg" cta="hero_explore_platform">
              Explore Platform
            </BrandButton>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-5 text-sm text-muted-foreground/85"
          >
            Delivered through Garage → Foundry → Factory.
          </motion.p>
        </div>

        {/* ------------------------------ 3D emblem ----------------------------- */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="flex items-center justify-center"
        >
          <IntelligenceForgeHero />
        </motion.div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-2 text-muted-foreground lg:mt-4"
        aria-hidden="true"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.div>
    </section>
  )
}
