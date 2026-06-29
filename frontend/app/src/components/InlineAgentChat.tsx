import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import {
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
import type { TalkToAgentSession, AgentMessage, TalkToAgentState } from '@/types/talkToAgent';
import { quickActionChips, createMockSession, generateMockRecommendation } from '@/lib/mock/talkToAgentMock';
import { cn } from '@/lib/utils';

export interface InlineAgentIdentity {
  id: string;
  name: string;
  label?: string;
  title?: string;
  subtitle?: string;
  desc: string;
  color: string;
  image?: string;
  greeting?: string;
}

interface InlineAgentChatProps {
  selectedAgent?: InlineAgentIdentity;
}

export function InlineAgentChat({ selectedAgent }: InlineAgentChatProps) {
  const navigate = useNavigate();
  const [session, setSession] = useState<TalkToAgentSession | null>(null);
  const [input, setInput] = useState('');
  const [state, setState] = useState<TalkToAgentState>('welcome');
  const [recommendation, setRecommendation] = useState<ReturnType<typeof generateMockRecommendation> | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const baseSession = createMockSession();
    const intro = selectedAgent
      ? selectedAgent.greeting || `Hello! I'm your ${selectedAgent.name}. ${selectedAgent.subtitle || selectedAgent.desc}. Tell me about your challenge and I will guide your next steps.`
      : "Hello! I'm GFF AI, your enterprise transformation advisor. How can I help you today? Select a quick action below or type your question.";

    setSession({
      ...baseSession,
      messages: [
        {
          ...baseSession.messages[0],
          text: intro,
        },
      ],
    });
    setState('welcome');
    setRecommendation(null);
    setInput('');
  }, [selectedAgent]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [session?.messages, state]);

  const addMessage = (role: 'agent' | 'user', text: string) => {
    const newMsg: AgentMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      role,
      text,
      timestamp: new Date().toISOString(),
    };

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, newMsg],
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const processAgentResponse = (userText: string) => {
    setState('loading');

    setTimeout(() => {
      const seededPrompt = selectedAgent ? `${selectedAgent.title} ${userText}` : userText;
      const rec = generateMockRecommendation(seededPrompt);
      setRecommendation(rec);

      const responseText = `Thank you for sharing! Based on your inputs, I've identified key opportunities for ${rec.detectedIndustry.name} (confidence: ${Math.round(rec.detectedIndustry.confidence * 100)}%).

Your profile suggests you're focused on **${rec.roleObjective.split('seeking')[1]?.trim() || 'AI transformation'}**. I recommend exploring the ${rec.recommendedPaths[0].title} approach.

Here are your personalized next steps:`;

      addMessage('agent', responseText);
      setState('recommendations');
    }, 1500);
  };

  const handleQuickAction = (prompt: string) => {
    if (!session) return;
    addMessage('user', prompt);
    processAgentResponse(prompt);
  };

  const handleSend = () => {
    if (!input.trim() || !session) return;
    const text = input.trim();
    addMessage('user', text);
    setInput('');
    processAgentResponse(text);
  };

  const resetSession = () => {
    const baseSession = createMockSession();
    const intro = selectedAgent
      ? selectedAgent.greeting || `Hello! I'm your ${selectedAgent.name}. ${selectedAgent.subtitle || selectedAgent.desc}. Tell me about your challenge and I will guide your next steps.`
      : "Hello! I'm GFF AI, your enterprise transformation advisor. How can I help you today? Select a quick action below or type your question.";

    setSession({
      ...baseSession,
      messages: [
        {
          ...baseSession.messages[0],
          text: intro,
        },
      ],
    });
    setState('welcome');
    setRecommendation(null);
    setInput('');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-10 flex min-h-[560px] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-[color:var(--border-default)] bg-[var(--bg-card)] p-6 shadow-2xl lg:min-h-[600px] lg:p-8 xl:min-h-[620px] xl:p-10"
      style={{
        boxShadow: '0 24px 80px var(--gff-shadow), 0 0 32px rgb(var(--gff-blue-rgb) / 0.06)',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px rounded-full"
        style={{
          background: 'linear-gradient(90deg, #9A0003, #FF3040, #C03C85, #6B5BFF, #1173BC)',
        }}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {selectedAgent?.image ? (
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[var(--chip-bg)]">
                <img src={selectedAgent.image} alt={selectedAgent.name} className="h-full w-full object-contain p-1.5" />
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gff-gradient">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-base font-display font-bold text-[color:var(--text-primary)] lg:text-lg">
                {selectedAgent?.name || 'Talk to GFF AI'}
              </h3>
              <p className="text-xs text-[color:var(--text-secondary)] lg:text-sm">
                {selectedAgent?.subtitle || selectedAgent?.desc || 'AI Enterprise Advisor'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={resetSession}
          className="inline-flex items-center justify-center rounded-xl border border-[color:var(--border-default)] bg-[var(--chip-bg)] px-4 py-2 text-xs text-[color:var(--text-secondary)] transition-all hover:border-[color:var(--border-hover)] hover:text-[color:var(--text-primary)]"
        >
          New Chat
        </button>
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-dark)] p-5 min-h-[260px] lg:min-h-[300px] xl:min-h-[320px] lg:p-6"
        >
          <div className="space-y-4">
            {session?.messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'agent' && (
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gff-gradient">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed lg:max-w-[1100px]',
                    msg.role === 'user'
                      ? 'rounded-br-md bg-gff-gradient text-white'
                      : 'rounded-bl-md border border-[color:var(--border-subtle)] bg-[var(--bg-glass)] text-[color:var(--text-primary)]'
                  )}
                >
                  {msg.role === 'agent' ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[color:var(--text-primary)]">$1</strong>')
                          .replace(/\n/g, '<br/>'),
                      }}
                    />
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--chip-bg)] border border-[color:var(--border-subtle)]">
                    <User className="h-4 w-4 text-[color:var(--text-secondary)]" />
                  </div>
                )}
              </motion.div>
            ))}

            {state === 'loading' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gff-gradient">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-[color:var(--border-subtle)] bg-[var(--bg-glass)] px-4 py-3">
                  <span className="text-xs text-[color:var(--text-secondary)]">Analyzing your requirements...</span>
                </div>
              </motion.div>
            )}

            {state === 'recommendations' && recommendation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[var(--bg-glass)] p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-core-blue" />
                    <span className="text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">Detected Industry</span>
                  </div>
                  <span className="text-sm font-medium text-[color:var(--text-primary)]">{recommendation.detectedIndustry.name}</span>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]">
                    <div
                      className="h-full rounded-full bg-gff-gradient"
                      style={{ width: `${recommendation.detectedIndustry.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">Recommended Paths</span>
                  <div className="space-y-2">
                    {recommendation.recommendedPaths.map((path) => (
                      <div key={path.id} className="flex items-center gap-2 rounded-xl border border-[color:var(--border-subtle)] bg-[var(--bg-glass)] p-2.5">
                        <Lightbulb className="h-4 w-4 flex-shrink-0 text-core-blue" />
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-medium text-[color:var(--text-primary)]">{path.title}</span>
                          <span className="text-[10px] text-[color:var(--text-secondary)]">{path.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">Relevant Solutions</span>
                  <div className="space-y-2">
                    {recommendation.relevantSolutions.map((sol) => (
                      <div key={sol.id} className="flex items-center gap-2 rounded-xl border border-[color:var(--border-subtle)] bg-[var(--bg-glass)] p-2.5">
                        <Sparkles className="h-4 w-4 flex-shrink-0 text-core-blue" />
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-medium text-[color:var(--text-primary)]">{sol.name}</span>
                          <span className="text-[10px] text-[color:var(--text-secondary)]">{sol.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">Explore AI Labs</span>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.relevantLabs.map((lab) => (
                      <div
                        key={lab.id}
                        className="min-w-[10rem] flex-1 rounded-xl border border-[color:var(--border-subtle)] bg-[var(--bg-glass)] p-2.5 text-center"
                      >
                        <FlaskConical className="mx-auto mb-1 h-4 w-4 text-core-blue" />
                        <span className="block text-[10px] text-[color:var(--text-primary)]">{lab.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">Next Steps</span>
                  <div className="space-y-2">
                    {recommendation.nextStepActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleNavigate(action.href)}
                        className="flex w-full items-center justify-between rounded-xl bg-gff-gradient p-3 text-white transition-all hover:shadow-[0_0_20px_rgba(17,115,188,0.3)]"
                      >
                        <span className="text-xs font-medium">{action.title}</span>
                        <span className="flex items-center gap-1 text-[10px]">
                          {action.cta} <ChevronRight className="h-3 w-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-[color:var(--border-subtle)] pt-8">
          {state === 'welcome' && (
            <div>
              <span className="mb-4 block text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">Quick Actions</span>
              <div className="flex flex-wrap gap-3">
                {quickActionChips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleQuickAction(chip.prompt)}
                    className="rounded-full border border-[color:var(--border-default)] bg-[var(--chip-bg)] px-3 py-1.5 text-[11px] text-[color:var(--text-secondary)] transition-all duration-300 hover:border-[color:var(--border-hover)] hover:text-[color:var(--text-primary)]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={cn('flex flex-col gap-3 sm:flex-row', state === 'welcome' ? 'mt-6' : '')}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={state === 'welcome' ? 'Describe your challenge or ask anything...' : 'Continue the conversation...'}
              className="h-14 flex-1 rounded-xl border border-[color:var(--input-border)] bg-[var(--input-bg)] px-4 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] transition-colors focus:border-core-blue/40 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || state === 'loading'}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-gff-gradient px-5 text-white transition-all hover:shadow-[0_0_20px_rgba(17,115,188,0.3)] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
