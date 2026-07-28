import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/ui/page-hero'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ContactForm } from '@/components/contact/contact-form'
import { contact, locations } from '@/data/site-content'

export const metadata: Metadata = {
  title: 'Contact — GFF AI',
  description:
    'Book a workshop or consultation, or reach GFF AI for sales, support, partnership, media, university, and investor enquiries.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Start your <span className="text-brand-gradient">AI transformation</span>
          </>
        }
        subtitle="Tell us where you are on the journey and we will route you to the right specialist."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:px-8">
          <ScrollReveal>
            <ContactForm />
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-brand-soft">
              <h2 className="text-lg font-semibold text-navy">Reach us directly</h2>
              <p className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
                {contact.address}
              </p>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-navy"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-navy"
              >
                <Phone className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
                {contact.phone}
              </a>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-brand-soft">
              <h2 className="text-lg font-semibold text-navy">Regional contacts</h2>
              {locations.active.map((l) => (
                <div key={l.city} className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-navy">{l.city}</span>
                  <span className="text-sm text-muted-foreground">{l.lead ?? l.role}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
