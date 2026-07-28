'use client'

/**
 * Enterprise-visual layout system — the three Apple-inspired layouts used to
 * give each major GFF AI capability a strong, product-led visual identity.
 *
 * Deliberately just three types so the site keeps one visual grammar:
 *   • SplitVisualFeature — eyebrow / heading / short copy / optional CTA beside a
 *     large illustration. Used to introduce the interactive sections.
 *   • MediaFeatureCard   — media-dominant feature with a compact side column;
 *     supports a metrics/children slot (one message per card).
 *   • PanoramicFeature   — a single full-width rounded panel with a strong
 *     horizontal composition and one uninterrupted visual.
 *
 * All three share one media surface (VisualMedia): a stable 3:2 aspect-ratio
 * container (no layout shift), a rounded/bordered surface, a restrained accent
 * glow, and Next.js <Image>. Entrance motion is restrained (opacity + small rise
 * + ≤1.5% scale, once) and fully disabled under prefers-reduced-motion.
 *
 * Text never sits over the illustration — every layout keeps copy in its own
 * column or block, clear of the centred subject in these images.
 */

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { BrandButton } from '@/components/ui/brand-button'

const EASE = [0.21, 0.47, 0.32, 0.98] as const

type CTA = { href: string; label: string }

/* -------------------------------------------------------------------------- */
/* Shared media surface                                                        */
/* -------------------------------------------------------------------------- */

type VisualMediaProps = {
  src: string
  alt: string
  /** Subtle section-accent colour for the glow behind the surface. */
  accent?: string
  /** Responsive width hint for the optimizer. */
  sizes?: string
  className?: string
}

function VisualMedia({ src, alt, accent, sizes, className }: VisualMediaProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: EASE }}
      className={cn('relative w-full', className)}
    >
      {/* Restrained accent glow — the images already carry the colour. */}
      {accent && (
        <div
          aria-hidden="true"
          // Inset stays within the page padding while the media is full-width
          // (single column), so the glow never causes horizontal overflow. It only
          // spreads at lg, where the layout is two-column and the media is inset.
          className="pointer-events-none absolute -inset-3 -z-10 rounded-[44px] opacity-70 blur-2xl lg:-inset-8"
          style={{ background: `radial-gradient(58% 58% at 50% 45%, ${accent}, transparent 72%)` }}
        />
      )}
      {/* 3:2 surface keeps the full illustration visible and prevents CLS. */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[22px] border border-border bg-card shadow-brand-soft md:rounded-[30px]">
        <Image src={src} alt={alt} fill sizes={sizes ?? '(min-width: 1024px) 640px, 100vw'} className="object-cover" />
      </div>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Shared text column                                                          */
/* -------------------------------------------------------------------------- */

function FeatureCopy({
  eyebrow,
  title,
  description,
  cta,
  children,
  align = 'left',
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  cta?: CTA
  children?: ReactNode
  align?: 'left' | 'center'
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: EASE }}
      className={cn('flex flex-col gap-5', align === 'center' && 'items-center text-center')}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue sm:text-sm">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-navy md:text-5xl">{title}</h2>
      {description && (
        <p className="max-w-[520px] text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
      {children}
      {cta && (
        <div className="pt-1">
          <BrandButton href={cta.href}>{cta.label}</BrandButton>
        </div>
      )}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* 1 — SplitVisualFeature                                                       */
/* -------------------------------------------------------------------------- */

type SplitVisualFeatureProps = {
  eyebrow: string
  title: ReactNode
  description: string
  imageSrc: string
  imageAlt: string
  accent?: string
  /** Which side the illustration sits on at desktop. Default 'right'. */
  imageSide?: 'left' | 'right'
  cta?: CTA
  imageSizes?: string
  className?: string
}

export function SplitVisualFeature({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  accent,
  imageSide = 'right',
  cta,
  imageSizes,
  className,
}: SplitVisualFeatureProps) {
  const imageLeft = imageSide === 'left'
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14',
        className,
      )}
    >
      {/* Mobile: text first, image second. Desktop: honour imageSide. */}
      <div className={cn('lg:col-span-5', imageLeft && 'lg:order-2')}>
        <FeatureCopy eyebrow={eyebrow} title={title} description={description} cta={cta} />
      </div>
      <div className={cn('lg:col-span-7', imageLeft && 'lg:order-1')}>
        <VisualMedia
          src={imageSrc}
          alt={imageAlt}
          accent={accent}
          sizes={imageSizes ?? '(min-width: 1024px) 640px, 100vw'}
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 2 — MediaFeatureCard                                                         */
/* -------------------------------------------------------------------------- */

type MediaFeatureCardProps = {
  eyebrow: string
  title: ReactNode
  description?: string
  imageSrc: string
  imageAlt: string
  accent?: string
  imageSide?: 'left' | 'right'
  /** Media-dominant split. Default '7/5' (image 7, text 5). */
  ratio?: '7/5' | '6/6'
  cta?: CTA
  /** Optional metrics / supporting content beneath the copy (real HTML text). */
  children?: ReactNode
  imageSizes?: string
  className?: string
}

export function MediaFeatureCard({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  accent,
  imageSide = 'right',
  ratio = '7/5',
  cta,
  children,
  imageSizes,
  className,
}: MediaFeatureCardProps) {
  const imageLeft = imageSide === 'left'
  const imageCols = ratio === '6/6' ? 'lg:col-span-6' : 'lg:col-span-7'
  const textCols = ratio === '6/6' ? 'lg:col-span-6' : 'lg:col-span-5'
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14',
        className,
      )}
    >
      <div className={cn(textCols, imageLeft && 'lg:order-2')}>
        <FeatureCopy eyebrow={eyebrow} title={title} description={description} cta={cta}>
          {children}
        </FeatureCopy>
      </div>
      <div className={cn(imageCols, imageLeft && 'lg:order-1')}>
        <VisualMedia
          src={imageSrc}
          alt={imageAlt}
          accent={accent}
          sizes={imageSizes ?? '(min-width: 1024px) 700px, 100vw'}
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 3 — PanoramicFeature                                                         */
/* -------------------------------------------------------------------------- */

type PanoramicFeatureProps = {
  eyebrow: string
  title: ReactNode
  description: string
  imageSrc: string
  imageAlt: string
  accent?: string
  cta?: CTA
  children?: ReactNode
  className?: string
}

export function PanoramicFeature({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  accent,
  cta,
  children,
  className,
}: PanoramicFeatureProps) {
  return (
    <div
      className={cn(
        'relative mx-auto max-w-7xl overflow-hidden rounded-[24px] border border-border bg-card/70 p-6 shadow-brand-soft md:rounded-[34px] md:p-10 lg:p-14',
        className,
      )}
    >
      {accent && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{ background: `radial-gradient(48% 60% at 18% 30%, ${accent}, transparent 70%)` }}
        />
      )}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <FeatureCopy eyebrow={eyebrow} title={title} description={description} cta={cta}>
            {children}
          </FeatureCopy>
        </div>
        <div className="lg:col-span-7">
          <VisualMedia src={imageSrc} alt={imageAlt} sizes="(min-width: 1024px) 720px, 100vw" />
        </div>
      </div>
    </div>
  )
}
