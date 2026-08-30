'use client'

import { useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitContact } from '@/lib/api/forms'
import { trackEvent } from '@/lib/api/analytics'
import { leadMetadata } from '@/lib/attribution'
import { contact } from '@/data/site-content'

const INTENTS = [
  'Book Workshop',
  'Book Consultation',
  'Request Proposal',
  'Sales',
  'Support',
  'Partnership',
  'Media',
  'University',
  'Investors',
] as const

const inputClass =
  'w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-blue'

type Status = 'idle' | 'sending' | 'sent' | 'error'

// Intents that represent a specific conversion journey get their own event
// on top of the generic contact_form_submitted.
const INTENT_EVENTS: Record<string, 'workshop_booking_submitted' | 'consultation_requested' | 'proposal_requested'> = {
  'Book Workshop': 'workshop_booking_submitted',
  'Book Consultation': 'consultation_requested',
  'Request Proposal': 'proposal_requested',
}

export function ContactForm() {
  const [intent, setIntent] = useState<string>('Book Consultation')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const startedTracked = useRef(false)

  const trackStarted = () => {
    if (startedTracked.current) return
    startedTracked.current = true
    trackEvent({ eventName: 'contact_form_started', source: 'contact_page', component: 'ContactForm' })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setError(null)

    try {
      await submitContact({
        name,
        email,
        company,
        intent,
        message,
        source: 'contact_page',
        metadata: leadMetadata({ marketingConsent }),
      })
      setStatus('sent')
      trackEvent({
        eventName: 'contact_form_submitted',
        source: 'contact_page',
        component: 'ContactForm',
        payload: { intent },
      })
      const intentEvent = INTENT_EVENTS[intent]
      if (intentEvent) {
        trackEvent({ eventName: intentEvent, source: 'contact_page', component: 'ContactForm', payload: { intent } })
      }
    } catch {
      setStatus('error')
      trackEvent({
        eventName: 'form_submission_failed',
        source: 'contact_page',
        component: 'ContactForm',
        payload: { form: 'contact', intent },
      })
      setError(
        `We could not submit your message right now. Please email us directly at ${contact.email} and we will pick it up.`,
      )
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card p-12 text-center shadow-brand-soft">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-semibold text-navy">Message received</h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you — our team will get back to you shortly. For anything urgent, reach us at {contact.email}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 shadow-brand-soft md:p-10">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-navy">How can we help?</span>
        <div className="flex flex-wrap gap-2">
          {INTENTS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIntent(i)}
              aria-pressed={intent === i}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                intent === i
                  ? 'border-transparent bg-brand-blue text-white shadow-brand-soft'
                  : 'border-border bg-background text-navy hover:border-brand-blue/40 hover:text-brand-blue',
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-navy">Name</span>
          <input required value={name} onFocus={trackStarted} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-navy">Work email</span>
          <input
            required
            type="email"
            value={email}
            onFocus={trackStarted}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@company.com"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-navy">Company</span>
        <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} placeholder="Company name" />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-navy">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onFocus={trackStarted}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(inputClass, 'resize-y')}
          placeholder="Tell us about your transformation goals…"
        />
      </label>

      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#155DFC]"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Keep me informed about GFF AI insights, events and product updates. (Optional)
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-hover px-8 py-4 text-base font-medium text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(21,93,252,0.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By submitting this form you agree to GFF AI storing your details to respond to your enquiry.
      </p>
    </form>
  )
}
