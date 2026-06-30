import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { InlineAgentChat } from '@/components/InlineAgentChat';
import { fetchTalkToAgentAgents, trackTalkToAgentEvent } from '@/lib/api/talkToAgentApi';
import type { InlineAgentIdentity } from '@/types/talkToAgent';

const fallbackAgents: InlineAgentIdentity[] = [
  {
    id: 'strategy',
    name: 'Strategy Agent',
    label: 'STRATEGY AGENT',
    title: 'Strategy Agent',
    subtitle: 'AI transformation strategy and roadmap advisor',
    desc: 'AI transformation strategy and roadmap advisor',
    color: '#FF3040',
    image: '/assets/T1.png',
    greeting: "Hello! I'm your Strategy Agent. I can help shape your AI transformation roadmap, strategic priorities, and enterprise rollout plan.",
  },
  {
    id: 'architect',
    name: 'AI Architect Agent',
    label: 'AI ARCHITECT AGENT',
    title: 'AI Architect Agent',
    subtitle: 'Enterprise AI architecture and solution designer',
    desc: 'Enterprise AI architecture and solution designer',
    color: '#1173BC',
    image: '/assets/T2.png',
    greeting: "Hello! I'm your AI Architect Agent. I can help design your enterprise AI architecture, platforms, integration approach, and solution blueprint.",
  },
  {
    id: 'governance',
    name: 'Governance Agent',
    label: 'GOVERNANCE AGENT',
    title: 'Governance Agent',
    subtitle: 'AI governance, risk and compliance expert',
    desc: 'AI governance, risk and compliance expert',
    color: '#00FF99',
    image: '/assets/T3.png',
    greeting: "Hello! I'm your Governance Agent. I can guide you on AI governance, risk controls, trust, compliance, and operating guardrails.",
  },
  {
    id: 'industry',
    name: 'Industry Agent',
    label: 'INDUSTRY AGENT',
    title: 'Industry Agent',
    subtitle: 'Industry-specific AI use cases and transformation guide',
    desc: 'Industry-specific AI use cases and transformation guide',
    color: '#FF6B21',
    image: '/assets/T4.png',
    greeting: "Hello! I'm your Industry Agent. I can help identify sector-specific AI opportunities, use cases, and practical transformation priorities.",
  },
  {
    id: 'training',
    name: 'Training Advisor',
    label: 'TRAINING ADVISOR',
    title: 'Training Advisor',
    subtitle: 'AI talent, training and capability advisor',
    desc: 'AI talent, training and capability advisor',
    color: '#A855F7',
    image: '/assets/T5.png',
    greeting: "Hello! I'm your Training Advisor. I can help plan AI capability building, team enablement, training programs, and workforce readiness.",
  },
];

export default function TalkToAgent() {
  const [agents, setAgents] = useState<InlineAgentIdentity[]>(fallbackAgents);
  const [showInlineChat, setShowInlineChat] = useState(false);
  const [activeAgent, setActiveAgent] = useState<InlineAgentIdentity | undefined>(undefined);
  const [chatVersion, setChatVersion] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const openInlineChat = (agent?: InlineAgentIdentity) => {
    setActiveAgent(agent);
    setShowInlineChat(true);
    setChatVersion((prev) => prev + 1);

    void trackTalkToAgentEvent({
      eventName: 'talk_to_agent_opened',
      source: 'homepage_inline_chat',
      payload: { selected_agent_id: agent?.id ?? null },
    });

    if (agent) {
      void trackTalkToAgentEvent({
        eventName: 'selected_agent_clicked',
        source: 'homepage_inline_chat',
        payload: { selected_agent_id: agent.id },
      });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadAgents = async () => {
      try {
        const backendAgents = await fetchTalkToAgentAgents();
        if (cancelled) return;

        const fallbackMap = new Map(fallbackAgents.map((agent) => [agent.id, agent]));
        const mergedAgents = backendAgents.map((agent) => {
          const fallback = fallbackMap.get(agent.id);
          return {
            id: agent.id,
            name: agent.name,
            label: fallback?.label || agent.name.toUpperCase(),
            title: agent.name,
            subtitle: agent.subtitle || agent.title,
            desc: agent.description || agent.title,
            color: fallback?.color || '#1173BC',
            image: fallback?.image,
            greeting: agent.greeting || fallback?.greeting,
          } satisfies InlineAgentIdentity;
        });

        setAgents(mergedAgents.length > 0 ? mergedAgents : fallbackAgents);
      } catch {
        if (cancelled) return;
        setAgents(fallbackAgents);
      }
    };

    void loadAgents();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showInlineChat) return;
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  }, [showInlineChat, chatVersion]);

  return (
    <section id="talk-to-agent" className="pt-20 pb-10 lg:pt-24 lg:pb-12">
      <div id="agent" className="scroll-mt-28" />
      <div className="w-[95vw] max-w-[1800px] mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16 bg-[color:var(--border-default)]" />
            <span className="text-sm font-mono text-[color:var(--text-secondary)] tracking-wider uppercase">Talk to GFF AI</span>
            <span className="h-px w-16 bg-[color:var(--border-default)]" />
          </div>
          <h2 className="font-display font-extrabold text-[color:var(--text-primary)] leading-[1.05] tracking-[-0.02em] text-[32px] md:text-[48px] lg:text-[64px] mb-4">
            TALK TO AN <span className="text-gradient">AI SPECIALIST</span>
          </h2>
          <p className="text-[color:var(--text-secondary)] text-[18px] max-w-[700px] mx-auto">
            Get instant insights, strategies and roadmaps from our AI-powered expert agents.
            Select an agent or start a free-form conversation.
          </p>
        </motion.div>

        {/* CTA to open inline chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-10"
        >
          <button
            id="talk-to-agent-trigger"
            onClick={() => openInlineChat()}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gff-gradient text-white font-medium rounded-2xl sheen-btn hover-gff-glow-strong transition-all duration-300 text-lg"
          >
            <MessageSquare className="w-5 h-5" />
            Start Conversation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {agents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={i}
              onSelect={() => openInlineChat(agent)}
            />
          ))}
        </div>

        {showInlineChat && (
          <div ref={chatRef} className="mt-10 scroll-mt-28">
            <InlineAgentChat
              key={`${activeAgent?.id ?? 'general'}-${chatVersion}`}
              selectedAgent={activeAgent}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function AgentCard({
  agent,
  index,
  onSelect,
}: {
  agent: InlineAgentIdentity;
  index: number;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { r, g, b } = hexToRgb(agent.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      onClick={onSelect}
      className="group relative rounded-3xl p-5 cursor-pointer overflow-hidden h-[400px] flex flex-col text-center min-w-0"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        boxShadow: `inset 0 0 0 1px rgba(${r},${g},${b},0.22), inset 0 0 0 2px var(--border-subtle)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
        borderColor: agent.color,
        boxShadow: `0 0 0 1px ${agent.color}, 0 26px 70px rgba(${r},${g},${b},0.26), 0 0 28px rgba(${r},${g},${b},0.18)`,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(560px circle at 50% 40%, rgba(${r},${g},${b},0.18), transparent 55%)`,
        }}
      />

      <div className="flex items-center justify-center mt-1">
        <div className="relative w-[160px] h-[160px]">
          <motion.div
            initial={false}
            animate={
              hovered
                ? { opacity: 1, scale: [0.9, 1.25, 0.98] }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 rounded-[44px] blur-2xl"
            style={{ backgroundColor: `rgba(${r},${g},${b},0.22)` }}
          />
          <div
            className="absolute inset-0 rounded-[44px] blur-2xl opacity-60"
            style={{ backgroundColor: `rgba(${r},${g},${b},0.16)` }}
          />
          <img
            src={agent.image}
            alt={agent.title}
            className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            style={{
              filter: `drop-shadow(0 0 18px rgba(${r},${g},${b},0.20))`,
            }}
          />
        </div>
      </div>

      <h3 className="mt-4 text-sm font-display font-bold" style={{ color: agent.color }}>
        {agent.label || agent.name}
      </h3>
      <p className="mt-2 text-xs text-[color:var(--text-secondary)] leading-relaxed px-2">{agent.desc}</p>

      <div className="mt-auto pt-4">
        <div
          className="flex items-center justify-center gap-1 text-xs font-medium text-[color:var(--text-secondary)] group-hover:text-[color:var(--text-primary)] transition-colors"
          style={{ textShadow: `0 0 18px rgba(${r},${g},${b},0.20)` }}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          <span>TALK NOW</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
