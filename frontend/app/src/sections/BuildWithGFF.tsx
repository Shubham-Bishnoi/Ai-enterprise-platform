import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  BarChart3,
  Send,
  ChevronDown,
  Download,
  Calculator,
  Beaker,
  FileOutput,
  Sparkles,
  Gauge,
} from 'lucide-react';
import { TalkToAgentDrawer } from '@/components/drawers/TalkToAgentDrawer';
import { BlueprintModal } from '@/components/modals/BlueprintModal';
import { FALLBACK_BLUEPRINT_OPTIONS, getBlueprintOptions } from '@/lib/api/blueprintApi';
import type { BlueprintFormInput } from '@/types/blueprint';

export default function BuildWithGFF() {
  const [agentDrawerOpen, setAgentDrawerOpen] = useState(false);

  return (
    <section id="build-with-gff" className="py-24 lg:py-32 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16 bg-[color:var(--border-default)]" />
            <span className="text-sm font-mono text-[color:var(--text-secondary)] tracking-wider uppercase">Build With GFF</span>
            <span className="h-px w-16 bg-[color:var(--border-default)]" />
          </div>
          <h2 className="font-display font-bold text-[color:var(--text-primary)] text-3xl md:text-5xl lg:text-6xl leading-tight">
            Your AI Transformation <span className="text-gradient">Command Center</span>
          </h2>
          <p className="mt-4 text-[color:var(--text-secondary)] max-w-2xl mx-auto">
            Three powerful entry points to start, plan, and accelerate your AI journey.
          </p>
        </motion.div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TalkToAgentCard onOpenAgent={() => setAgentDrawerOpen(true)} />
          <GenerateBlueprintCard />
          <AIReadinessCard />
        </div>
      </div>

      <TalkToAgentDrawer isOpen={agentDrawerOpen} onClose={() => setAgentDrawerOpen(false)} />
    </section>
  );
}

function TalkToAgentCard({ onOpenAgent }: { onOpenAgent: () => void }) {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-6"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border-default)',
        boxShadow: '0 8px 40px var(--gff-shadow)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gff-gradient flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-[color:var(--text-primary)]">Talk to Agent</h3>
          <p className="text-[11px] text-[color:var(--text-secondary)]">AI-powered conversation</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-mono text-[color:var(--text-secondary)] mb-2 block">Describe your challenge</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your AI challenge or business problem..."
          className="w-full h-24 bg-[var(--input-bg)] border border-[color:var(--input-border)] rounded-xl p-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:border-core-blue/40 focus:outline-none resize-none transition-colors"
        />
      </div>

      <button
        onClick={() => {
          if (message.trim()) {
            setSubmitted(true);
            onOpenAgent();
          } else {
            onOpenAgent();
          }
        }}
        className="w-full py-2.5 bg-gff-gradient text-white text-sm font-medium rounded-2xl sheen-btn hover-gff-glow transition-all flex items-center justify-center gap-2 mb-6"
      >
        <Send className="w-4 h-4" />
        {message.trim() ? 'Send & Start Chat' : 'Start Chat'}
      </button>

      <p className="text-xs font-mono text-[color:var(--text-secondary)] mb-3">Output:</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: FileText, label: 'Proposal', color: '#EF4444' },
          { icon: MessageSquare, label: 'Squad', color: '#8B5CF6' },
          { icon: BarChart3, label: 'Timeline', color: '#1173BC' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)] transition-colors"
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
            <span className="text-xs text-[color:var(--text-secondary)]">{item.label}</span>
          </div>
        ))}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-xl bg-gff-gradient-soft border border-[color:var(--border-default)] text-sm text-white"
        >
          Agent is analyzing your challenge... Expect a tailored proposal within minutes.
        </motion.div>
      )}
    </motion.div>
  );
}

function GenerateBlueprintCard() {
  const [industry, setIndustry] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [industries, setIndustries] = useState<string[]>(
    FALLBACK_BLUEPRINT_OPTIONS.industries.slice(0, 6),
  );

  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      try {
        const options = await getBlueprintOptions();
        if (cancelled || options.industries.length === 0) return;
        setIndustries(options.industries.slice(0, 6));
      } catch {
        if (cancelled) return;
        setIndustries(FALLBACK_BLUEPRINT_OPTIONS.industries.slice(0, 6));
      }
    };

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleQuickGenerate = () => {
    setShowModal(true);
  };

  const quickFormData: BlueprintFormInput = {
    industry: industry || 'Other',
    companySize: 'Enterprise',
    topPriorities: ['Productivity', 'Revenue Growth'],
    aiJourneyStage: 'Exploring AI',
    biggestChallenge: 'Legacy Systems',
    email: 'demo@enterprise.com',
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="rounded-2xl p-6"
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-default)',
          boxShadow: '0 8px 40px var(--gff-shadow)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gff-gradient flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-[color:var(--text-primary)]">Generate Blueprint</h3>
            <p className="text-[11px] text-[color:var(--text-secondary)]">AI transformation roadmap</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-mono text-[color:var(--text-secondary)] mb-2 block">Quick Select Industry</label>
          <div className="relative">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full appearance-none bg-[var(--input-bg)] border border-[color:var(--input-border)] rounded-xl px-4 py-3 text-sm text-[color:var(--text-primary)] focus:border-core-blue/40 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[var(--bg-elevated)] text-[color:var(--text-primary)]">Select Industry</option>
              {industries.map((o) => (
                <option key={o} value={o} className="bg-[var(--bg-elevated)] text-[color:var(--text-primary)]">{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-secondary)] pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleQuickGenerate}
          className="w-full py-2.5 bg-gff-gradient text-white text-sm font-medium rounded-2xl sheen-btn hover-gff-glow transition-all flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Quick Generate
        </button>

        <p className="text-xs font-mono text-[color:var(--text-secondary)] mb-3">Output:</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: FileText, label: 'Architecture', color: '#EF4444' },
            { icon: BarChart3, label: 'Roadmap', color: '#8B5CF6' },
            { icon: Calculator, label: 'Timeline', color: '#1173BC' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
              <span className="text-xs text-[color:var(--text-secondary)]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]">
            <MessageSquare className="w-4 h-4 text-core-blue" />
            <div>
              <span className="text-xs text-[color:var(--text-primary)] block">Team</span>
              <span className="text-[10px] text-[color:var(--text-secondary)]">5-8 specialists</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]">
            <Calculator className="w-4 h-4 text-ice-blue" />
            <div>
              <span className="text-xs text-[color:var(--text-primary)] block">Cost</span>
              <span className="text-[10px] text-[color:var(--text-secondary)]">Based on scope</span>
            </div>
          </div>
        </div>
      </motion.div>

      <BlueprintModal isOpen={showModal} onClose={() => setShowModal(false)} formData={quickFormData} />
    </>
  );
}

function AIReadinessCard() {
  const [score] = useState(73);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="rounded-2xl p-6"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border-default)',
        boxShadow: '0 8px 40px var(--gff-shadow)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gff-gradient flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-[color:var(--text-primary)]">AI Readiness</h3>
          <p className="text-[11px] text-[color:var(--text-secondary)]">Enterprise assessment</p>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="url(#gaugeGrad)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 264} 264`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9A0003" />
                <stop offset="50%" stopColor="#6B5BFF" />
                <stop offset="100%" stopColor="#1173BC" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-[color:var(--text-primary)]">{score}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-core-blue" />
          <span className="text-xs text-[color:var(--text-secondary)]">Recommendations</span>
          <span className="text-xs text-[color:var(--text-primary)] font-mono">12</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-[color:var(--text-secondary)]">Investment</span>
          <span className="text-xs text-[color:var(--text-primary)] font-mono">$420K</span>
        </div>
      </div>

      {/* PDF Download */}
      <button className="w-full py-2.5 mb-4 rounded-2xl text-sm text-[color:var(--text-primary)] border border-[color:var(--border-default)] bg-[var(--chip-bg)] hover:border-[color:var(--border-hover)] transition-all flex items-center justify-center gap-2">
        <FileText className="w-4 h-4 text-[color:var(--text-secondary)]" />
        Download Full Report (PDF)
        <Download className="w-4 h-4 text-[color:var(--text-secondary)]" />
      </button>

      {/* Mini output cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Calculator, label: 'ROI Calculator', color: '#EF4444' },
          { icon: Beaker, label: 'Sandbox', color: '#8B5CF6' },
          { icon: FileOutput, label: 'Proposal Builder', color: '#1173BC' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)] transition-colors cursor-pointer"
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
            <span className="text-[10px] text-[color:var(--text-secondary)] text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
