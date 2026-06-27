import { useState } from 'react';
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
            <span className="h-px w-16 bg-white/20" />
            <span className="text-sm font-mono text-muted-text tracking-wider uppercase">Build With GFF</span>
            <span className="h-px w-16 bg-white/20" />
          </div>
          <h2 className="font-display font-bold text-white text-3xl md:text-5xl lg:text-6xl leading-tight">
            Your AI Transformation <span className="text-gradient">Command Center</span>
          </h2>
          <p className="mt-4 text-muted-text max-w-2xl mx-auto">
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
        background: 'rgba(26,26,26,0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gff-gradient flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-white">Talk to Agent</h3>
          <p className="text-[11px] text-muted-text">AI-powered conversation</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-mono text-muted-text mb-2 block">Describe your challenge</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your AI challenge or business problem..."
          className="w-full h-24 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-sm text-white placeholder:text-muted-text/50 focus:border-core-blue/40 focus:outline-none resize-none transition-colors"
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

      <p className="text-xs font-mono text-muted-text mb-3">Output:</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: FileText, label: 'Proposal', color: '#EF4444' },
          { icon: MessageSquare, label: 'Squad', color: '#8B5CF6' },
          { icon: BarChart3, label: 'Timeline', color: '#1173BC' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.10] transition-colors"
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
            <span className="text-xs text-muted-text">{item.label}</span>
          </div>
        ))}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-xl bg-gff-gradient-soft border border-white/10 text-sm text-white"
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

  const industries = ['Healthcare', 'Banking', 'Manufacturing', 'Retail', 'Energy', 'Insurance'];

  const handleQuickGenerate = () => {
    setShowModal(true);
  };

  const quickFormData: BlueprintFormInput = {
    industry: industry || 'Enterprise',
    companySize: 'Enterprise',
    topPriorities: ['Operational Efficiency', 'Revenue Growth'],
    aiJourneyStage: 'Exploring',
    biggestChallenge: 'Integration',
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
          background: 'rgba(26,26,26,0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gff-gradient flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">Generate Blueprint</h3>
            <p className="text-[11px] text-muted-text">AI transformation roadmap</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-mono text-muted-text mb-2 block">Quick Select Industry</label>
          <div className="relative">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:border-core-blue/40 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0D0D0D]">Select Industry</option>
              {industries.map((o) => (
                <option key={o} value={o} className="bg-[#0D0D0D]">{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleQuickGenerate}
          className="w-full py-2.5 bg-gff-gradient text-white text-sm font-medium rounded-2xl sheen-btn hover-gff-glow transition-all flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Quick Generate
        </button>

        <p className="text-xs font-mono text-muted-text mb-3">Output:</p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: FileText, label: 'Architecture', color: '#EF4444' },
            { icon: BarChart3, label: 'Roadmap', color: '#8B5CF6' },
            { icon: Calculator, label: 'Timeline', color: '#1173BC' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
              <span className="text-xs text-muted-text">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <MessageSquare className="w-4 h-4 text-core-blue" />
            <div>
              <span className="text-xs text-white block">Team</span>
              <span className="text-[10px] text-muted-text">5-8 specialists</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <Calculator className="w-4 h-4 text-ice-blue" />
            <div>
              <span className="text-xs text-white block">Cost</span>
              <span className="text-[10px] text-muted-text">Based on scope</span>
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
        background: 'rgba(26,26,26,0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gff-gradient flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-white">AI Readiness</h3>
          <p className="text-[11px] text-muted-text">Enterprise assessment</p>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
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
            <span className="text-3xl font-display font-bold text-white">{score}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-core-blue" />
          <span className="text-xs text-muted-text">Recommendations</span>
          <span className="text-xs text-white font-mono">12</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-muted-text">Investment</span>
          <span className="text-xs text-white font-mono">$420K</span>
        </div>
      </div>

      {/* PDF Download */}
      <button className="w-full py-2.5 mb-4 rounded-2xl text-sm text-white border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all flex items-center justify-center gap-2">
        <FileText className="w-4 h-4 text-muted-text" />
        Download Full Report (PDF)
        <Download className="w-4 h-4 text-muted-text" />
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
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.10] transition-colors cursor-pointer"
          >
            <item.icon className="w-5 h-5" style={{ color: item.color }} />
            <span className="text-[10px] text-muted-text text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
