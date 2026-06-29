import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Bot,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Check,
  Zap,
  Target,
  TrendingUp,
  Layers,
  Network,
  Lock,
  CalendarDays,
} from 'lucide-react';
import type { BlueprintResult, BlueprintFormInput } from '@/types/blueprint';
import { generateMockBlueprint } from '@/lib/mock/blueprintMock';
import { cn } from '@/lib/utils';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: BlueprintFormInput;
}

export function BlueprintModal({ isOpen, onClose, formData }: BlueprintModalProps) {
  const [result, setResult] = useState<BlueprintResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'roadmap' | 'architecture' | 'governance'>('overview');
  const [animatedScore, setAnimatedScore] = useState(0);
  const resultsContentRef = useRef<HTMLDivElement | null>(null);
  const resetResultsScroll = (behavior: ScrollBehavior = 'auto') => {
    resultsContentRef.current?.scrollTo({
      top: 0,
      behavior,
    });
  };

  useEffect(() => {
    if (isOpen && formData.industry) {
      setIsGenerating(true);
      setResult(null);
      setAnimatedScore(0);
      setActiveTab('overview');

      const timer = setTimeout(() => {
        const blueprint = generateMockBlueprint(formData);
        setResult(blueprint);
        setIsGenerating(false);

        // Animate score
        const targetScore = blueprint.readinessScore.score;
        let current = 0;
        const interval = setInterval(() => {
          current += 2;
          if (current >= targetScore) {
            current = targetScore;
            clearInterval(interval);
          }
          setAnimatedScore(current);
        }, 30);

        return () => clearInterval(interval);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, formData]);

  useEffect(() => {
    if (!result || isGenerating) return;

    const frame = requestAnimationFrame(() => {
      resetResultsScroll('auto');
    });

    return () => cancelAnimationFrame(frame);
  }, [activeTab, result, isGenerating]);

  const handleTabChange = (tab: typeof activeTab) => {
    resetResultsScroll('auto');
    setActiveTab(tab);

    requestAnimationFrame(() => {
      resetResultsScroll('auto');
    });
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop with subtle blur - page context still visible */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ WebkitBackdropFilter: 'blur(6px)' }}
          />

          {/* Modal Content - Premium Glassmorphic */}
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(135deg, var(--bg-glass-strong) 0%, var(--bg-card) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid var(--border-default)',
              boxShadow: `0 0 0 1px var(--border-subtle), 0 24px 80px var(--gff-shadow), 0 0 60px rgb(var(--gff-blue-rgb) / 0.10), 0 0 60px rgb(var(--gff-red-rgb) / 0.06)`,
            }}
          >
            {/* Top gradient glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-32 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(17,115,188,0.18), transparent 70%)',
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--chip-bg)] border border-[color:var(--border-default)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="relative px-8 pt-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gff-gradient flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-mono text-[color:var(--text-secondary)] tracking-wider uppercase">GFF AI Blueprint Engine</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-[color:var(--text-primary)]">
                Your Enterprise <span className="text-gradient">AI Blueprint</span>
              </h2>
              <p className="text-sm text-[color:var(--text-secondary)] mt-1">
                {formData.industry} · {formData.companySize} · {formData.aiJourneyStage}
              </p>
            </div>

            {/* Generating State */}
            {isGenerating && (
              <div className="px-8 pb-8 flex flex-col items-center justify-center py-16">
                <div className="relative w-24 h-24 mb-6">
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-core-blue/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{
                      borderTopColor: 'rgba(17,115,188,0.8)',
                      borderRightColor: 'transparent',
                      borderBottomColor: 'transparent',
                      borderLeftColor: 'transparent',
                    }}
                  />
                  <div className="absolute inset-2 rounded-xl bg-gff-gradient flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-[color:var(--text-primary)] mb-2">Generating Your Blueprint</h3>
                <p className="text-sm text-[color:var(--text-secondary)] text-center max-w-md">
                  Our AI engine is analyzing your enterprise profile, industry dynamics, and transformation readiness to create a tailored blueprint...
                </p>
                <div className="mt-6 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-core-blue"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {result && !isGenerating && (
              <>
                {/* Score Banner */}
                <div className="px-8 pb-4">
                  <div
                    className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(17,115,188,0.12), rgba(154,0,3,0.08), rgba(107,91,255,0.08))',
                        border: '1px solid var(--border-default)',
                    }}
                  >
                    {/* Score Circle */}
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-subtle)" strokeWidth="6" />
                        <motion.circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke="url(#scoreGrad)" strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${(animatedScore / 100) * 264} 264`}
                          transition={{ duration: 0.5 }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9A0003" />
                            <stop offset="50%" stopColor="#6B5BFF" />
                            <stop offset="100%" stopColor="#1173BC" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-display font-bold text-[color:var(--text-primary)]">{animatedScore}</span>
                        <span className="text-[9px] text-[color:var(--text-tertiary)] uppercase tracking-wider">Score</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-display font-bold text-[color:var(--text-primary)] mb-1">
                        {result.readinessScore.category}
                      </h3>
                      <p className="text-sm text-[color:var(--text-secondary)] mb-3">
                        Your enterprise AI readiness assessment based on {formData.industry} industry benchmarks.
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                        {Object.entries(result.readinessScore.breakdown).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gff-gradient"
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                              />
                            </div>
                            <span className="text-[10px] text-[color:var(--text-tertiary)] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="px-8 pb-4">
                  <div className="flex gap-1 p-1 rounded-xl bg-[var(--chip-bg)] border border-[color:var(--border-subtle)]">
                    {[
                      { id: 'overview', label: 'Overview', icon: Target },
                      { id: 'opportunities', label: 'Opportunities', icon: Zap },
                      { id: 'roadmap', label: '90-Day Roadmap', icon: CalendarDays },
                      { id: 'architecture', label: 'Architecture', icon: Layers },
                      { id: 'governance', label: 'Governance', icon: Lock },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as typeof activeTab)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-300',
                          activeTab === tab.id
                            ? 'bg-[var(--bg-glass-strong)] text-[color:var(--text-primary)] shadow-[0_0_12px_rgba(17,115,188,0.15)]'
                            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
                        )}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div ref={resultsContentRef} className="px-8 pb-14 overflow-y-auto max-h-[56vh] lg:max-h-[58vh]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <OverviewTab key="overview" result={result} />
                    )}
                    {activeTab === 'opportunities' && (
                      <OpportunitiesTab key="opportunities" result={result} />
                    )}
                    {activeTab === 'roadmap' && (
                      <RoadmapTab key="roadmap" result={result} />
                    )}
                    {activeTab === 'architecture' && (
                      <ArchitectureTab key="architecture" result={result} />
                    )}
                    {activeTab === 'governance' && (
                      <GovernanceTab key="governance" result={result} />
                    )}
                  </AnimatePresence>

                  {/* Next Actions */}
                  <div className="mt-8 border-t border-[color:var(--border-subtle)] pb-8 pt-6">
                    <h4 className="text-sm font-display font-bold text-[color:var(--text-primary)] mb-3">Recommended Next Actions</h4>
                    <div className="mb-4 grid grid-cols-1 gap-3 pb-4 sm:grid-cols-3">
                      {result.nextActions.map((action, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className={cn(
                            'p-4 rounded-xl border text-left transition-all duration-300',
                            i === 0
                              ? 'bg-gff-gradient border-transparent hover:shadow-[0_0_30px_rgba(17,115,188,0.25)]'
                              : 'bg-[var(--bg-glass)] border-[color:var(--border-subtle)] hover:bg-[var(--bg-glass-strong)] hover:border-[color:var(--border-hover)]'
                          )}
                        >
                          <span className="text-xs font-medium text-[color:var(--text-primary)] block">{action.title}</span>
                          <span className="text-[10px] text-[color:var(--text-secondary)] mt-1 block">{action.description}</span>
                          <span className="text-[10px] text-[color:var(--text-primary)] mt-2 flex items-center gap-1">
                            {action.cta} <ArrowRight className="w-3 h-3" />
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Tab Sub-Components
function OverviewTab({ result }: { result: BlueprintResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Top Opportunities */}
      <div>
        <h4 className="text-sm font-display font-bold text-[color:var(--text-primary)] mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-core-blue" />
          Top 5 AI Opportunities
        </h4>
        <div className="space-y-2">
          {result.opportunities.slice(0, 5).map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
            >
              <span className="w-6 h-6 rounded-lg bg-gff-gradient flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[color:var(--text-primary)]">{opp.title}</span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-medium',
                    opp.impact === 'High' ? 'bg-green-500/15 text-green-400' :
                    opp.impact === 'Medium' ? 'bg-yellow-500/15 text-yellow-400' :
                    'bg-blue-500/15 text-blue-400'
                  )}>
                    {opp.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-[color:var(--text-secondary)] mt-0.5">{opp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Business Impact */}
      <div>
        <h4 className="text-sm font-display font-bold text-[color:var(--text-primary)] mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-core-blue" />
          Expected Business Impact
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {result.businessImpact.map((impact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)] text-center"
            >
              <span className="text-lg font-display font-bold text-gradient block">{impact.value}</span>
              <span className="text-xs text-[color:var(--text-secondary)] block mt-0.5">{impact.metric}</span>
              <span className="text-[10px] text-[color:var(--text-tertiary)]">{impact.description}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Solutions */}
      <div>
        <h4 className="text-sm font-display font-bold text-[color:var(--text-primary)] mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-core-blue" />
          Recommended GFF AI Solutions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {result.recommendedSolutions.map((sol, i) => (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2 p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
            >
              <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm text-[color:var(--text-primary)] block">{sol.name}</span>
                <span className="text-[10px] text-[color:var(--text-secondary)]">{sol.description}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function OpportunitiesTab({ result }: { result: BlueprintResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3"
    >
      {result.opportunities.map((opp, i) => (
        <motion.div
          key={opp.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="p-4 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="text-sm font-medium text-[color:var(--text-primary)]">{opp.title}</h5>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--chip-bg)] text-[color:var(--text-tertiary)]">{opp.category}</span>
              </div>
              <p className="text-xs text-[color:var(--text-secondary)]">{opp.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-medium',
                opp.impact === 'High' ? 'bg-green-500/15 text-green-400' :
                opp.impact === 'Medium' ? 'bg-yellow-500/15 text-yellow-400' :
                'bg-blue-500/15 text-blue-400'
              )}>
                {opp.impact}
              </span>
              <span className="text-[10px] text-[color:var(--text-tertiary)]">{opp.timeline}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function RoadmapTab({ result }: { result: BlueprintResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {result.roadmap.map((phase, i) => (
        <motion.div
          key={phase.phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative pl-8 pb-4 border-l border-[color:var(--border-subtle)] last:pb-0"
        >
          {/* Timeline dot */}
          <div className="absolute left-0 top-0 w-6 h-6 -translate-x-1/2 rounded-full bg-gff-gradient flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{phase.phase}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]">
            <div className="flex items-center gap-2 mb-2">
              <h5 className="text-sm font-bold text-[color:var(--text-primary)]">{phase.title}</h5>
              <span className="text-[10px] font-mono text-[color:var(--text-tertiary)]">{phase.duration}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-core-blue uppercase tracking-wider block mb-1">Activities</span>
                <ul className="space-y-1">
                  {phase.activities.map((a, j) => (
                    <li key={j} className="text-xs text-[color:var(--text-secondary)] flex items-start gap-1.5">
                      <ArrowRight className="w-3 h-3 text-core-blue flex-shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[10px] text-core-blue uppercase tracking-wider block mb-1">Deliverables</span>
                <ul className="space-y-1">
                  {phase.deliverables.map((d, j) => (
                    <li key={j} className="text-xs text-[color:var(--text-secondary)] flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ArchitectureTab({ result }: { result: BlueprintResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3"
    >
      {/* Operating Model */}
      <div>
        <h4 className="text-sm font-display font-bold text-[color:var(--text-primary)] mb-2 flex items-center gap-2">
          <Network className="w-4 h-4 text-core-blue" />
          AI Operating Model
        </h4>
        <div className="space-y-2">
          {result.operatingModel.layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
            >
              <span className="text-xs font-medium text-[color:var(--text-primary)] block mb-1">{layer.name}</span>
              <div className="flex flex-wrap gap-1.5">
                {layer.components.map((c, j) => (
                  <span key={j} className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--chip-bg)] text-[color:var(--text-tertiary)] border border-[color:var(--border-subtle)]">
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="mt-4">
        <h4 className="text-sm font-display font-bold text-[color:var(--text-primary)] mb-2 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-core-blue" />
          AI Architecture
        </h4>
        <div className="space-y-2">
          {result.architecture.layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[color:var(--text-primary)]">{layer.name}</span>
                <span className="text-[10px] text-[color:var(--text-tertiary)]">{layer.description}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {layer.technologies.map((t, j) => (
                  <span key={j} className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--chip-bg)] text-[color:var(--text-tertiary)] border border-[color:var(--border-subtle)]">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function GovernanceTab({ result }: { result: BlueprintResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3"
    >
      {result.governance.pillars.map((pillar, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="p-4 rounded-xl bg-[var(--bg-glass)] border border-[color:var(--border-subtle)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-core-blue" />
            <h5 className="text-sm font-bold text-[color:var(--text-primary)]">{pillar.name}</h5>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pillar.controls.map((c, j) => (
              <span key={j} className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--chip-bg)] text-[color:var(--text-tertiary)] border border-[color:var(--border-subtle)]">
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
