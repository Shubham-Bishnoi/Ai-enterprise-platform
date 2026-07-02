import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router';
import {
  BrainCircuit, Wrench, Gavel, Settings2, FlaskConical, Network, ShieldCheck,
  ArrowRight, Layers, Rocket, Target, Cpu, BookOpen
} from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GradientText } from '@/components/shared/GradientText';
import { CTAButton } from '@/components/shared/CTAButton';
import { trackAnalyticsEvent } from '@/lib/api/analyticsApi';
import { fetchCapabilities } from '@/lib/api/capabilitiesApi';
import { siteContainerClass } from '@/lib/siteContent';

const capabilities = [
  {
    id: 'ai-strategy',
    title: 'AI Strategy',
    icon: Target,
    color: '#FF3040',
    tagline: 'Define the transformation thesis',
    description: 'Executive alignment, use-case prioritization, and value case design for AI transformation programs.',
    items: ['Executive alignment', 'Use-case prioritization', 'Value case design', 'Investment sequencing', 'Portfolio roadmap'],
    deliverables: ['Transformation thesis', 'AI portfolio roadmap', 'Business case'],
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    icon: Wrench,
    color: '#1173BC',
    tagline: 'Build enterprise-grade AI systems',
    description: 'Reference architectures, integration patterns, and production delivery of AI systems.',
    items: ['Reference architectures', 'Integration patterns', 'Production delivery', 'Model pipelines', 'Data engineering'],
    deliverables: ['Architecture blueprint', 'Production system', 'Integration map'],
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    icon: BrainCircuit,
    color: '#6B5BFF',
    tagline: 'Design and orchestrate AI agents',
    description: 'Agent design, human-in-loop controls, and task orchestration across enterprise workflows.',
    items: ['Agent design', 'Human-in-loop controls', 'Task orchestration', 'Agent factories', 'Multi-agent systems'],
    deliverables: ['Agent architecture', 'Orchestration layer', 'Governance controls'],
  },
  {
    id: 'ai-governance',
    title: 'AI Governance',
    icon: Gavel,
    color: '#C03C85',
    tagline: 'Establish trust and compliance',
    description: 'Policy controls, responsible AI practices, and operational guardrails for scaled deployment.',
    items: ['Policy controls', 'Responsible AI', 'Operational guardrails', 'Audit readiness', 'Risk management'],
    deliverables: ['Governance framework', 'Policy library', 'Compliance dashboard'],
  },
  {
    id: 'ai-operations',
    title: 'AI Operations',
    icon: Settings2,
    color: '#00A3FF',
    tagline: 'Run AI systems reliably',
    description: 'Model operations, prompt and agent monitoring, and service management for production AI.',
    items: ['Model operations', 'Prompt monitoring', 'Agent monitoring', 'Service management', 'Cost optimization'],
    deliverables: ['Ops dashboard', 'Monitoring stack', 'Runbook library'],
  },
  {
    id: 'ai-labs',
    title: 'AI Labs',
    icon: FlaskConical,
    color: '#FF9F1A',
    tagline: 'Accelerate experimentation',
    description: 'Rapid pilots, concept validation, and innovation transfer programs.',
    items: ['Rapid pilots', 'Concept validation', 'Innovation transfer', 'PoC development', 'Benchmarking'],
    deliverables: ['Pilot report', 'Validated concept', 'Transfer plan'],
  },
  {
    id: 'knowledge-graph',
    title: 'Knowledge Graph',
    icon: Network,
    color: '#A855F7',
    tagline: 'Connect enterprise knowledge',
    description: 'Semantic layers, knowledge assets, and reasoning context for reliable AI outcomes.',
    items: ['Semantic layers', 'Knowledge assets', 'Reasoning context', 'Graph engineering', 'Ontology design'],
    deliverables: ['Knowledge graph', 'Semantic model', 'Query interface'],
  },
  {
    id: 'managed-services',
    title: 'Managed Services',
    icon: ShieldCheck,
    color: '#10B981',
    tagline: 'Sustain enterprise AI',
    description: 'Run and support, platform reliability, and continuous optimization of AI systems.',
    items: ['Run and support', 'Platform reliability', 'Continuous optimization', 'SLA management', 'Incident response'],
    deliverables: ['Service agreement', 'Support model', 'Optimization plan'],
  },
];

export default function Capabilities() {
  const location = useLocation();
  const [activeCap, setActiveCap] = useState(0);
  const [capabilitiesData, setCapabilitiesData] = useState(capabilities);

  const iconMap = useMemo(() => {
    return {
      Target,
      Wrench,
      BrainCircuit,
      Gavel,
      Settings2,
      FlaskConical,
      Network,
      ShieldCheck,
    } as const;
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchCapabilities()
      .then((items) => {
        if (!mounted) return;
        if (!items || items.length === 0) return;
        setCapabilitiesData(
          items.map((cap) => {
            const Icon = (iconMap as Record<string, any>)[cap.ui_icon || ''] || Target;
            return {
              id: cap.slug,
              title: cap.title,
              icon: Icon,
              color: cap.ui_color || '#1173BC',
              tagline: cap.tagline || '',
              description: cap.description,
              items: cap.items || [],
              deliverables: cap.deliverables || [],
            };
          }),
        );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [iconMap]);

  const active = capabilitiesData[activeCap] || capabilitiesData[0];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requested = params.get('cap');
    if (!requested) return;
    const index = capabilitiesData.findIndex((cap) => cap.id === requested);
    if (index >= 0) setActiveCap(index);
  }, [location.search, capabilitiesData]);

  return (
    <main className="overflow-x-hidden">
      <PageHero
        eyebrow="Capabilities"
        title={<>AI <GradientText>Capabilities</GradientText></>}
        subtitle="Strategy, engineering, governance, operations, and agentic AI systems for enterprise transformation."
        intro="The capability stack spans advisory through industrialized delivery so enterprises can move from exploration to managed AI operations with one partner."
        actions={
          <>
            <CTAButton to="/#talk-to-agent">Talk to GFF AI</CTAButton>
            <CTAButton to="/#blueprint-generator" variant="secondary">Generate a Blueprint</CTAButton>
          </>
        }
      />

      {/* Capability Architecture */}
      <section className="py-16 lg:py-20">
        <div className={siteContainerClass}>
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Capability Rail */}
            <div className="space-y-2">
              <p className="mb-4 text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Select capability</p>
              {capabilitiesData.map((cap, index) => (
                <button
                  key={cap.id}
                  onClick={() => {
                    setActiveCap(index);
                    trackAnalyticsEvent({
                      eventName: 'content_clicked',
                      source: 'capabilities_page',
                      component: 'Capabilities',
                      payload: { slug: cap.id, title: cap.title },
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300"
                  style={{
                    borderColor: activeCap === index ? `${cap.color}40` : 'transparent',
                    backgroundColor: activeCap === index ? `${cap.color}08` : 'transparent',
                  }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                    style={{ backgroundColor: activeCap === index ? `${cap.color}15` : 'var(--chip-bg)' }}
                  >
                    <cap.icon className="h-4 w-4" style={{ color: activeCap === index ? cap.color : 'var(--text-muted)' }} />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: activeCap === index ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {cap.title}
                  </span>
                  {activeCap === index && <ArrowRight className="ml-auto h-4 w-4" style={{ color: cap.color }} />}
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="rounded-[28px] border p-6 lg:p-8"
                  style={{
                    backgroundColor: 'var(--bg-glass)',
                    borderColor: 'var(--border-default)',
                    boxShadow: `inset 0 1px 0 0 ${active.color}15`,
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: `${active.color}15` }}
                      >
                        <active.icon className="h-7 w-7" style={{ color: active.color }} />
                      </div>
                      <div>
                        <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{active.title}</h2>
                        <p className="text-sm font-medium" style={{ color: active.color }}>{active.tagline}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CTAButton to={`/#talk-to-agent`}>Talk to an Expert</CTAButton>
                    </div>
                  </div>

                  <p className="mt-6 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {active.description}
                  </p>

                  {/* Items & Deliverables */}
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-4 flex items-center gap-2 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <Layers className="h-4 w-4" /> What we do
                      </h4>
                      <ul className="space-y-2.5">
                        {active.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: active.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-4 flex items-center gap-2 text-sm font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <Rocket className="h-4 w-4" /> Deliverables
                      </h4>
                      <ul className="space-y-2.5">
                        {active.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <BookOpen className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: active.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Capability Stack Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <h3 className="font-display text-xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>From Strategy to Operated AI</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {capabilitiesData.map((cap, i) => (
                <div key={cap.id} className="flex items-center gap-3">
                  <div
                    className="flex items-center gap-2 rounded-full border px-4 py-2"
                    style={{ borderColor: `${cap.color}25`, backgroundColor: `${cap.color}08` }}
                  >
                    <cap.icon className="h-3.5 w-3.5" style={{ color: cap.color }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{cap.title}</span>
                  </div>
                  {i < capabilities.length - 1 && (
                    <Cpu className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
