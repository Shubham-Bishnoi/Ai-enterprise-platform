import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { footerNav } from '@/data/navigation'
import { contact, legalText } from '@/data/site-content'

export function Footer() {
  return (
    <footer className="gradient-footer border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2" aria-label="GFF AI home">
              <Image src="/images/gff-logo.png" alt="GFF AI logo" width={44} height={44} className="h-11 w-11 object-contain" />
              <span className="text-lg font-semibold tracking-tight text-navy">
                GFF <span className="text-brand-blue">AI</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              GFF AI applies Enterprise Intelligence Engineering to connect organisational knowledge, AI agents, governance and business operations.
            </p>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center rounded-full bg-brand-blue hover:bg-brand-blue-hover px-5 py-2.5 text-sm font-medium text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Consultation
            </Link>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer company links">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy">Company</p>
            {footerNav.company.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-navy">
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-3" aria-label="Footer offering links">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy">Offering</p>
            {footerNav.offering.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-navy">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy">Contact</p>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
              {contact.address}
            </p>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-navy">
              <Mail className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
              {contact.email}
            </a>
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-navy">
              <Phone className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
              {contact.phone}
            </a>
          </div>
        </div>

        <div className="divider-brand mt-12" />

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-medium text-navy">© 2026 GFF AI PTE. LTD. All Rights Reserved.</p>
          <p className="mx-auto max-w-4xl text-xs leading-relaxed text-muted-foreground">{legalText}</p>
        </div>
      </div>
    </footer>
  )
}
