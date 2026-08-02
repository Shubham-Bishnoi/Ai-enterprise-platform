'use client'

/**
 * Voluntary human-expert capture inside the Talk-to-Agent chat panel.
 * Email is never required to chat — this only records a lead when the
 * visitor explicitly asks a human to follow up. Success is shown only after
 * the backend confirms the insert. The summary sent is one safe sentence
 * (plus the visitor's own last question), never the chat transcript.
 */

import { useState } from 'react'
import { Check, Loader2, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createHandoff } from '@/lib/api/forms'
import { trackEvent } from '@/lib/api/analytics'
import { leadMetadata } from '@/lib/attribution'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const inputClass =
  'w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-blue'

type Phase = 'closed' | 'open' | 'sending' | 'sent'

export function HumanExpertForm({
  agentName,
  chatSessionId,
  lastUserMessage,
}: {
  agentName: string
  chatSessionId: string | null
  lastUserMessage: string | null
}) {
  const [phase, setPhase] = useState<Phase>('closed')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase === 'sending') return
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid work email so our team can reach you.')
      return
    }
    setError(null)
    setPhase('sending')

    trackEvent({
      eventName: 'human_expert_requested',
      source: 'talk_to_agent_chat',
      component: 'HumanExpertForm',
      payload: { has_session: Boolean(chatSessionId) },
    })

    let summary = `Visitor chatting with ${agentName} asked for a human expert follow-up.`
    if (lastUserMessage) summary += ` Last question: ${lastUserMessage.slice(0, 160)}`

    try {
      await createHandoff({
        handoffType: 'human_expert',
        summary,
        source: 'talk_to_agent_chat',
        email,
        name: name || undefined,
        company: company || undefined,
        chatSessionId: chatSessionId ?? undefined,
        metadata: leadMetadata(),
      })
      setPhase('sent')
    } catch {
      setPhase('open')
      setError('We could not submit that right now — please try again, or use the contact page.')
    }
  }

  if (phase === 'sent') {
    return (
      <div className="flex items-center gap-3 border-t border-border bg-secondary/50 px-6 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-navy">
          Thank you — a GFF AI expert will contact you at <span className="font-medium">{email}</span>.
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-border px-6 py-4">
      {phase === 'closed' ? (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          Prefer a person?
          <button
            type="button"
            onClick={() => setPhase('open')}
            className="inline-flex items-center gap-1.5 font-medium text-brand-blue transition-colors hover:text-brand-blue-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
            Talk to a human expert
          </button>
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <p className="text-sm font-medium text-navy">Request a human expert follow-up</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="sr-only">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Name (optional)" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="sr-only">Work email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@company.com"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="sr-only">Company</span>
              <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} placeholder="Company (optional)" />
            </label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-muted-foreground">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={phase === 'sending'}
              className={cn(
                'inline-flex items-center gap-2 rounded-full bg-brand-blue hover:bg-brand-blue-hover px-5 py-2.5 text-sm font-medium text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
              )}
            >
              {phase === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                'Request follow-up'
              )}
            </button>
            <button
              type="button"
              onClick={() => setPhase('closed')}
              className="text-sm text-muted-foreground transition-colors hover:text-navy"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            We use these details only to respond to your request. Your chat stays private — only your request and
            last question are shared with our team.
          </p>
        </form>
      )}
    </div>
  )
}
