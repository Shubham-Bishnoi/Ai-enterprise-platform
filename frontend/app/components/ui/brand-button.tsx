'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { trackCta } from '@/lib/api/analytics'
import type { ReactNode } from 'react'

type BrandButtonProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  className?: string
  /** When set, clicking records a `cta_clicked` analytics event with this id. */
  cta?: string
}

export function BrandButton({ href, children, variant = 'primary', size = 'md', className, cta }: BrandButtonProps) {
  return (
    <Link
      href={href}
      onClick={cta ? () => trackCta(cta, 'website', 'BrandButton') : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
        size === 'lg' ? 'px-6 py-3 text-[15px]' : 'px-5 py-2.5 text-sm',
        variant === 'primary'
          ? 'bg-brand-blue hover:bg-brand-blue-hover text-white shadow-brand-soft hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(21,93,252,0.28)]'
          : 'glass-panel border border-border text-navy shadow-brand-soft hover:-translate-y-0.5 hover:border-brand-blue/40',
        className,
      )}
    >
      {children}
    </Link>
  )
}
