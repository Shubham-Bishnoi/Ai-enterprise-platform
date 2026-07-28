'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navLinks } from '@/data/navigation'
import { useScrollDirection } from '@/lib/hooks/use-scroll-direction'

/**
 * Direction-aware floating navbar. Three states:
 *
 *   top    — integrated with the hero: transparent, full width, no border.
 *   hidden — scrolling down: the whole fixed header translates above the
 *            viewport (~300 ms; instant under reduced motion).
 *   pill   — scrolling up away from the top: the inner surface floats as a
 *            rounded, blurred, softly shadowed pill.
 *
 * The bar never hides while the mobile menu is open or while keyboard focus
 * is inside it. The header is fixed, so no state causes layout shift.
 */
export function Navbar() {
  const [open, setOpen] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const pathname = usePathname()
  const scrollState = useScrollDirection({ topThreshold: 12, delta: 8, resetKey: pathname })

  // Menu-open and focus-within force the bar to stay visible.
  const state = (open || focusWithin) && scrollState === 'hidden' ? 'pill' : scrollState
  const pill = state === 'pill' && !open

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false)
      }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none',
        state === 'hidden' ? '-translate-y-full' : 'translate-y-0',
        open && 'glass-panel border-b border-border shadow-brand-soft',
      )}
    >
      <div
        className={cn(
          'transition-all duration-300 motion-reduce:transition-none',
          pill
            ? 'mx-auto mt-3 w-[calc(100%-24px)] max-w-7xl rounded-full border border-black/5 bg-white/85 shadow-[0_12px_40px_rgba(7,22,47,0.1)] backdrop-blur-xl sm:w-[calc(100%-40px)] md:mt-4'
            : 'w-full border border-transparent bg-transparent',
        )}
      >
        <nav
          className={cn(
            'mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6',
            pill ? 'lg:px-6 xl:h-[68px]' : 'lg:px-8',
          )}
          aria-label="Main navigation"
        >
          <Link href="/" className="flex shrink-0 items-center" aria-label="GFF AI home">
            <Image
              src="/images/gff-ai-logo.png"
              alt="GFF AI"
              width={792}
              height={240}
              className="h-auto w-[118px] shrink-0 object-contain sm:w-[132px] xl:w-[150px]"
              priority
            />
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-navy',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <Link
              href="/portal"
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-secondary"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="whitespace-nowrap rounded-full bg-brand-blue hover:bg-brand-blue-hover px-5 py-2.5 text-sm font-medium text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(21,93,252,0.3)]"
            >
              Book a Consultation
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy transition-colors hover:bg-secondary xl:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {open && (
        <div className="glass-panel border-t border-border xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-xl px-4 py-3 text-base font-medium transition-colors',
                  pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-navy hover:bg-secondary',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <Link
                href="/portal"
                className="rounded-full border border-border px-5 py-3 text-center text-sm font-medium text-navy transition-colors hover:bg-secondary"
              >
                Client Login
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-brand-blue px-5 py-3 text-center text-sm font-medium text-white shadow-brand-soft transition-colors hover:bg-brand-blue-hover"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
