import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import {
  X,
  Send,
  Loader2,
  Bot,
  Sparkles,
  Target,
  FlaskConical,
  Lightbulb,
  User,
  ChevronRight,
} from 'lucide-react';
import {
  LEGACY_TALK_TO_AGENT_QUICK_ACTIONS,
  appendLocalMessage,
  buildOfflineMessage,
  createLocalSession,
  createTalkToAgentSession,
  requestTalkToAgentHandoff,
  sendTalkToAgentMessage,
  trackTalkToAgentEvent,
} from '@/lib/api/talkToAgentApi';
import { cn } from '@/lib/utils';
import type {
  AgentRecommendation,
  NextStepAction,
  TalkToAgentSession,
  TalkToAgentState,
} from '@/types/talkToAgent';

interface TalkToAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TalkToAgentDrawer({ isOpen, onClose }: TalkToAgentDrawerProps) {
  const navigate = useNavigate();
  const [session, setSession] = useState<TalkToAgentSession | null>(null);
  const [input, setInput] = useState('');
  const [state, setState] = useState<TalkToAgentState>('welcome');
  const [recommendation, setRecommendation] = useState<AgentRecommendation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sourceSurface = 'build_with_gff_drawer';

  const handleNavigate = (href?: string) => {
    if (!href) return;

    if (href.startsWith('#')) {
      const targetId = href.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (targetId === 'contact') {
        navigate('/contact');
        return;
      }

      if (targetId === 'ai-labs') {
        navigate('/capabilities?cap=ai-labs');
        return;
      }

      navigate({ pathname: '/', hash: href });
      return;
    }

    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const initializeSession = useCallback(async () => {
    setState('loading');
    setRecommendation(null);
    setInput('');

    try {
      const nextSession = await createTalkToAgentSession(undefined, sourceSurface);
      setSession(nextSession);
      setState(nextSession.state);
      void trackTalkToAgentEvent({
        eventName: 'talk_to_agent_opened',
        source: sourceSurface,
        sessionId: nextSession.id,
        payload: { entry_point: 'build_with_gff' },
      });
    } catch {
      const fallbackSession = createLocalSession(undefined, LEGACY_TALK_TO_AGENT_QUICK_ACTIONS);
      setSession({
        ...fallbackSession,
        messages: [...fallbackSession.messages, buildOfflineMessage()],
      });
      setState('welcome');
    }
  }, []);

  useEffect(() => {
    if (isOpen && !session) {
      void initializeSession();
    }
  }, [initializeSession, isOpen, session]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, state]);

  const handleBackendFailure = () => {
    setSession((prev) => {
      if (!prev) {
        return createLocalSession(undefined, LEGACY_TALK_TO_AGENT_QUICK_ACTIONS);
      }
      return appendLocalMessage(prev, 'agent', buildOfflineMessage().text);
    });
    setState(recommendation ? 'recommendations' : 'welcome');
  };

  const handleNextAction = async (action: NextStepAction) => {
    if (
      session &&
      (action.type === 'request_handoff' || action.type === 'book_workshop')
    ) {
      void trackTalkToAgentEvent({
        eventName: 'talk_to_agent_handoff_requested',
        source: sourceSurface,
        sessionId: session.id,
        payload: { action_type: action.type },
      });

      try {
        await requestTalkToAgentHandoff({
          sessionId: session.id,
          selectedAgentId: session.selectedAgentId,
          target: action.type === 'book_workshop' ? 'workshop' : 'human_expert',
        });
      } catch {
        // Preserve the current drawer experience on handoff failure.
      }
    }

    onClose();
    setTimeout(() => {
      handleNavigate(action.href);
    }, 300);
  };

  const processAgentResponse = async (userText: string) => {
    if (!session) return;
    setState('loading');

    try {
      const response = await sendTalkToAgentMessage({
        sessionId: session.id,
        message: userText,
        selectedAgentId: session.selectedAgentId,
        sourceSurface,
      });

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          state: response.state,
          selectedAgentId: response.recommendation.recommendedPaths[0]?.icon || prev.selectedAgentId || null,
          recommendation: response.recommendation,
          messages: [...prev.messages, response.assistantMessage],
          updatedAt: response.assistantMessage.timestamp,
        };
      });
      setRecommendation(response.recommendation);
      setState(response.state);

      void trackTalkToAgentEvent({
        eventName: 'talk_to_agent_recommendation_shown',
        source: sourceSurface,
        sessionId: session.id,
        payload: { recommended_path_count: response.recommendation.recommendedPaths.length },
      });
    } catch {
      handleBackendFailure();
    }
  };

  const handleQuickAction = async (chip: { id: string; prompt: string }) => {
    if (!session) return;
    setSession((prev) => (prev ? appendLocalMessage(prev, 'user', chip.prompt) : prev));
    void trackTalkToAgentEvent({
      eventName: 'talk_to_agent_quick_action_clicked',
      source: sourceSurface,
      sessionId: session.id,
      payload: { quick_action_id: chip.id },
    });
    await processAgentResponse(chip.prompt);
  };

  const handleSend = async () => {
    if (!input.trim() || !session) return;
    const text = input.trim();

    setSession((prev) => (prev ? appendLocalMessage(prev, 'user', text) : prev));
    setInput('');

    void trackTalkToAgentEvent({
      eventName: 'talk_to_agent_message_sent',
      source: sourceSurface,
      sessionId: session.id,
      payload: { message_length: text.length },
    });

    await processAgentResponse(text);
  };

  const resetSession = () => {
    void initializeSession();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ WebkitBackdropFilter: 'blur(4px)' }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-lg flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              background: 'linear-gradient(180deg, var(--bg-glass-strong) 0%, var(--bg-card) 100%)',
              borderLeft: '1px solid var(--border-default)',
              boxShadow: `-20px 0 60px var(--gff-shadow), -4px 0 40px rgb(var(--gff-blue-rgb) / 0.08)`,
            }}
          >
            {/* Top gradient accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 z-10"
              style={{
                background: 'linear-gradient(90deg, #9A0003, #FF3040, #C03C85, #6B5BFF, #1173BC)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gff-gradient flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-[color:var(--text-primary)]">Talk to GFF AI</h3>
                  <span className="text-[10px] text-[color:var(--text-secondary)]">AI Enterprise Advisor</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetSession}
                  className="text-[10px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--chip-bg)]"
                >
                  New Chat
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--chip-bg)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-all border border-[color:var(--border-subtle)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {session?.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'agent' && (
                    <div className="w-7 h-7 rounded-lg bg-gff-gradient flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-gff-gradient text-white rounded-br-md'
                        : 'bg-[var(--bg-glass)] text-[color:var(--text-primary)] border border-[color:var(--border-subtle)] rounded-bl-md'
                    )}
                  >
                    {msg.role === 'agent' ? (
                      <div dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[color:var(--text-primary)]">$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-[var(--chip-bg)] border border-[color:var(--border-subtle)] flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-[color:var(--text-secondary)]" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading State */}
              {state === 'loading' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-gff-gradient flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)] rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[color:var(--text-secondary)]">Analyzing your requirements...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recommendations */}
              {state === 'recommendations' && recommendation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Detected Industry */}
                  <div className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-3.5 h-3.5 text-core-blue" />
                      <span className="text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-wider">Detected Industry</span>
                    </div>
                    <span className="text-sm font-medium text-[color:var(--text-primary)]">{recommendation.detectedIndustry.name}</span>
                    <div className="mt-1 w-full h-1 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gff-gradient"
                        style={{ width: `${recommendation.detectedIndustry.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommended Paths */}
                  <div>
                    <span className="text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-wider block mb-2">Recommended Paths</span>
                    <div className="space-y-2">
                      {recommendation.recommendedPaths.map((path, _pi) => (
                        <div
                          key={path.id}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
                        >
                          <Lightbulb className="w-4 h-4 text-core-blue flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-[color:var(--text-primary)] block">{path.title}</span>
                            <span className="text-[10px] text-[color:var(--text-secondary)]">{path.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relevant Solutions */}
                  <div>
                    <span className="text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-wider block mb-2">Relevant Solutions</span>
                    <div className="space-y-2">
                      {recommendation.relevantSolutions.map((sol) => (
                        <div
                          key={sol.id}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
                        >
                          <Sparkles className="w-4 h-4 text-core-blue flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-[color:var(--text-primary)] block">{sol.name}</span>
                            <span className="text-[10px] text-[color:var(--text-secondary)]">{sol.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relevant Labs */}
                  <div>
                    <span className="text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-wider block mb-2">Explore AI Labs</span>
                    <div className="flex gap-2">
                      {recommendation.relevantLabs.map((lab) => (
                        <div
                          key={lab.id}
                          className="flex-1 p-2.5 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)] text-center"
                        >
                          <FlaskConical className="w-4 h-4 text-core-blue mx-auto mb-1" />
                          <span className="text-[10px] text-[color:var(--text-primary)] block">{lab.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Actions */}
                  <div>
                    <span className="text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-wider block mb-2">Next Steps</span>
                    <div className="space-y-2">
                      {recommendation.nextStepActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => void handleNextAction(action)}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-gff-gradient text-white hover:shadow-[0_0_20px_rgba(17,115,188,0.3)] transition-all"
                        >
                          <span className="text-xs font-medium">{action.title}</span>
                          <span className="flex items-center gap-1 text-[10px]">
                            {action.cta} <ChevronRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Welcome State) */}
            {state === 'welcome' && (
              <div className="px-5 pb-3">
                <span className="text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-wider block mb-2">Quick Actions</span>
                <div className="flex flex-wrap gap-1.5">
                  {LEGACY_TALK_TO_AGENT_QUICK_ACTIONS.map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => void handleQuickAction(chip)}
                      className="px-3 py-1.5 rounded-full text-[11px] bg-[var(--chip-bg)] border border-[color:var(--border-default)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:border-[color:var(--border-hover)] transition-all duration-300"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="px-5 py-4 border-t border-[color:var(--border-subtle)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={state === 'welcome' ? "Describe your challenge or ask anything..." : "Continue the conversation..."}
                  className="flex-1 bg-[var(--input-bg)] border border-[color:var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:border-core-blue/40 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || state === 'loading'}
                  className="w-10 h-10 rounded-xl bg-gff-gradient flex items-center justify-center text-white hover:shadow-[0_0_20px_rgba(17,115,188,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
