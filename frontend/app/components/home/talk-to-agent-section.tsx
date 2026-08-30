'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUp,
  Blocks,
  Building2,
  Compass,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AgentArcCarousel, SimpleAgentCarousel } from '@/components/home/talk-to-agent/agent-arc-carousel'
import { type AgentDisplay } from '@/components/home/talk-to-agent/agent-data'
import { HumanExpertForm } from '@/components/home/talk-to-agent/human-expert-form'
import {
  FALLBACK_AGENTS,
  fetchAgents,
  sendAgentMessage,
  sendAgentQuickAction,
  startAgentSession,
  type BackendAgent,
  type ChatMessage,
} from '@/lib/api/agents'
import { trackEvent } from '@/lib/api/analytics'

const AGENT_ICONS: Record<string, typeof Compass> = {
  strategy: Compass,
  architect: Blocks,
  governance: ShieldCheck,
  industry: Building2,
  training: GraduationCap,
}

const AGENT_ACCENTS: Record<string, string> = {
  strategy: 'bg-brand-blue/10 text-brand-blue',
  architect: 'bg-brand-purple/10 text-brand-purple',
  governance: 'bg-brand-red/10 text-brand-red',
  industry: 'bg-brand-blue/10 text-brand-blue',
  training: 'bg-brand-purple/10 text-brand-purple',
}

function iconFor(agent: BackendAgent) {
  return AGENT_ICONS[agent.id] ?? Sparkles
}

export function TalkToAgentSection() {
  const reduceMotion = useReducedMotion()

  const [agents, setAgents] = useState<BackendAgent[]>(FALLBACK_AGENTS)
  const [offline, setOffline] = useState(false)
  // The continuous 3D motion stage only runs on wide, motion-friendly
  // viewports; everything else gets an accessible static presentation.
  const [enhanced, setEnhanced] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const update = () => setEnhanced(wide.matches)
    update()
    wide.addEventListener('change', update)
    return () => wide.removeEventListener('change', update)
  }, [])

  const [activeAgent, setActiveAgent] = useState<BackendAgent | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [starting, setStarting] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  // Chat sessions whose conversation-started event has already been sent.
  const conversationTracked = useRef<Set<string>>(new Set())

  const trackConversationStarted = useCallback((chatSessionId: string | null, agentId: string) => {
    const key = chatSessionId ?? 'no-session'
    if (conversationTracked.current.has(key)) return
    conversationTracked.current.add(key)
    trackEvent({
      eventName: 'agent_conversation_started',
      source: 'homepage',
      component: 'TalkToAgentSection',
      sessionId: chatSessionId,
      payload: { agent_id: agentId },
    })
  }, [])

  // Load the live agent roster; fall back to the static mirror on failure.
  useEffect(() => {
    let cancelled = false
    fetchAgents()
      .then((live) => {
        if (cancelled || !live?.length) return
        setAgents(live)
        setOffline(false)
      })
      .catch(() => {
        if (!cancelled) setOffline(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, sending])

  const openAgent = useCallback(
    async (agent: BackendAgent) => {
      setActiveAgent(agent)
      setError(null)
      setMessages([{ id: 'greeting', role: 'agent', text: agent.greeting }])
      setStarting(true)

      trackEvent({
        eventName: 'talk_to_agent_opened',
        source: 'homepage',
        component: 'TalkToAgentSection',
        payload: { agent_id: agent.id },
      })

      try {
        const session = await startAgentSession(agent.id)
        setSessionId(session.sessionId)
        if (session.messages.length) setMessages(session.messages)
      } catch {
        // Keep the greeting visible; the panel degrades to a static preview.
        setSessionId(null)
        setError('Live chat is unavailable right now. You can still explore this specialist below, or contact our team.')
      } finally {
        setStarting(false)
      }
    },
    [],
  )

  /** Bridge from the motion-stage cards (display ids) to the existing chat launch. */
  const startFromCard = useCallback(
    (id: AgentDisplay['id']) => {
      const agent = agents.find((a) => a.id === id) ?? FALLBACK_AGENTS.find((a) => a.id === id)
      if (agent) void openAgent(agent)
    },
    [agents, openAgent],
  )

  const closeAgent = useCallback(() => {
    // Leaving the panel after actually chatting ends the conversation.
    if (activeAgent && messages.some((m) => m.role === 'user')) {
      trackEvent({
        eventName: 'agent_conversation_completed',
        source: 'homepage',
        component: 'TalkToAgentSection',
        sessionId,
        payload: { agent_id: activeAgent.id, user_messages: messages.filter((m) => m.role === 'user').length },
      })
    }
    setActiveAgent(null)
    setSessionId(null)
    setMessages([])
    setInput('')
    setError(null)
  }, [activeAgent, messages, sessionId])

  const pushUser = (text: string) => {
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: 'user', text }])
  }

  const submitMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || sending || !activeAgent) return

      pushUser(trimmed)
      setInput('')
      setError(null)

      if (!sessionId) {
        setError('Live chat is unavailable right now. Please reach our team via the contact page.')
        return
      }

      trackConversationStarted(sessionId, activeAgent.id)
      setSending(true)
      try {
        const turn = await sendAgentMessage({
          sessionId,
          message: trimmed,
          selectedAgentId: activeAgent.id,
        })
        setMessages((prev) => [...prev, turn.message])
      } catch {
        setError('That message could not be delivered. Please try again in a moment.')
      } finally {
        setSending(false)
      }
    },
    [activeAgent, sending, sessionId, trackConversationStarted],
  )

  const runQuickAction = useCallback(
    async (quickActionId: string, label: string) => {
      if (!activeAgent || sending) return

      pushUser(label)
      setError(null)

      if (!sessionId) {
        setError('Live chat is unavailable right now. Please reach our team via the contact page.')
        return
      }

      trackEvent({
        eventName: 'starter_chip_selected',
        source: 'homepage',
        component: 'TalkToAgentSection',
        sessionId,
        payload: { agent_id: activeAgent.id, chip: label },
      })
      trackConversationStarted(sessionId, activeAgent.id)
      setSending(true)
      try {
        const turn = await sendAgentQuickAction({
          sessionId,
          quickActionId,
          selectedAgentId: activeAgent.id,
        })
        setMessages((prev) => [...prev, turn.message])
      } catch {
        setError('That action could not be completed. Please try again in a moment.')
      } finally {
        setSending(false)
      }
    },
    [activeAgent, sending, sessionId, trackConversationStarted],
  )

  const online = !offline

  return (
    <section id="talk-to-agent" className="relative scroll-mt-24 overflow-hidden py-20 md:py-24">
      {/* Full-section washes — merge behind copy and stage, no boxed panel. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[18%] h-[24rem] w-[24rem] rounded-full blur-3xl" style={{ background: 'rgba(255,77,109,0.05)' }} />
        <div className="absolute right-[6%] top-[8%] h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ background: 'rgba(14,165,233,0.06)' }} />
        <div className="absolute right-[24%] bottom-[6%] h-[24rem] w-[24rem] rounded-full blur-3xl" style={{ background: 'rgba(16,185,129,0.05)' }} />
        <div className="absolute right-[2%] bottom-[26%] h-[20rem] w-[20rem] rounded-full blur-3xl" style={{ background: 'rgba(249,115,22,0.05)' }} />
        <div className="absolute left-[30%] bottom-[10%] h-[22rem] w-[22rem] rounded-full blur-3xl" style={{ background: 'rgba(139,92,246,0.05)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait" initial={false}>
          {!activeAgent ? (
            /* -------------------- Specialist selection (motion stage) -------------------- */
            <motion.div
              key="stage"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[32%_minmax(0,1fr)] lg:gap-6"
            >
              {/* Left — stable copy block (compact) */}
              <div className="mx-auto flex max-w-[440px] flex-col gap-5 text-center lg:mx-0 lg:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">Talk to GFF AI</p>
                <h2 className="text-balance text-[2.25rem] font-semibold leading-[1.08] tracking-tight text-navy xl:text-[2.75rem]">
                  Enterprise AI specialists, ready to help
                </h2>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  Choose a specialist for practical guidance on strategy, architecture, governance, industry
                  transformation or AI training.
                </p>
                {offline && (
                  <p className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-brand-soft lg:justify-start lg:self-start">
                    <WifiOff className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
                    Showing our specialists offline — live chat will connect when the service is available.
                  </p>
                )}
              </div>

              {/* Right — interactive quarter-circle carousel, or the simple
                  single-card carousel (mobile, tablet portrait, reduced motion). */}
              {enhanced && !reduceMotion ? (
                <AgentArcCarousel online={online} onStart={startFromCard} />
              ) : (
                <SimpleAgentCarousel online={online} onStart={startFromCard} />
              )}
            </motion.div>
          ) : (
            /* ----------------------------- Chat panel ----------------------------- */
            <motion.div
              key="chat"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_48px_rgba(7,22,47,0.1)]"
            >
              {/* Panel header */}
              <div className="flex items-center gap-4 border-b border-border px-6 py-5">
                <button
                  type="button"
                  onClick={closeAgent}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                  aria-label="Back to specialists"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                    AGENT_ACCENTS[activeAgent.id] ?? 'bg-brand-blue/10 text-brand-blue',
                  )}
                >
                  {(() => {
                    const Icon = iconFor(activeAgent)
                    return <Icon className="h-5 w-5" aria-hidden="true" />
                  })()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-navy">{activeAgent.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{activeAgent.subtitle}</p>
                </div>
              </div>

              {/* Transcript */}
              <div ref={scrollRef} className="max-h-[26rem] min-h-[18rem] overflow-y-auto px-6 py-6">
                <div className="flex flex-col gap-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn('flex w-full', m.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed',
                          m.role === 'user'
                            ? 'bg-brand-blue text-white'
                            : 'bg-secondary text-navy',
                        )}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {(starting || sending) && (
                    <div className="flex justify-start">
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        {starting ? 'Connecting…' : 'Thinking…'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              {activeAgent.quick_actions?.length > 0 && (
                <div className="flex flex-wrap gap-2 border-t border-border px-6 py-4">
                  {activeAgent.quick_actions.slice(0, 4).map((qa) => (
                    <button
                      key={qa.id}
                      type="button"
                      disabled={sending || starting}
                      onClick={() => runQuickAction(qa.id, qa.label)}
                      className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-navy transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:text-brand-blue hover:shadow-brand-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Voluntary human-expert follow-up (the only email capture in chat) */}
              <HumanExpertForm
                agentName={activeAgent.name}
                chatSessionId={sessionId}
                lastUserMessage={[...messages].reverse().find((m) => m.role === 'user')?.text ?? null}
              />

              {error && (
                <p role="status" className="border-t border-border bg-secondary/60 px-6 py-3 text-sm text-muted-foreground">
                  {error}
                </p>
              )}

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void submitMessage(input)
                }}
                className="flex items-center gap-3 border-t border-border px-6 py-4"
              >
                <label htmlFor="tta-input" className="sr-only">
                  Message {activeAgent.name}
                </label>
                <input
                  id="tta-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sending || starting}
                  placeholder={`Ask ${activeAgent.name} about your transformation…`}
                  className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-muted-foreground focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/40 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending || starting}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue hover:bg-brand-blue-hover text-white shadow-brand-soft transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
