import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, AlertCircle, Check } from 'lucide-react';
import type { BlueprintFormInput } from '@/types/blueprint';
import { BlueprintModal } from '@/components/modals/BlueprintModal';
import { cn } from '@/lib/utils';

const industries = ['Healthcare', 'Banking', 'Insurance', 'Manufacturing', 'Retail', 'Energy', 'Public Sector', 'Education', 'Telecom', 'Life Sciences'];
const companySizes = ['Startup', 'SMB', 'Enterprise', 'Large Enterprise'];
const aiJourneyStages = ['Just Starting', 'Exploring', 'Piloting', 'Scaling', 'Transforming'];
const topPrioritiesList = ['Cost Reduction', 'Revenue Growth', 'Customer Experience', 'Operational Efficiency', 'Risk Management', 'Innovation', 'Compliance', 'Talent'];
const biggestChallenges = ['Data Quality', 'Talent Shortage', 'Integration', 'Governance', 'ROI Uncertainty', 'Change Management', 'Budget Constraints', 'Technical Debt'];
const dataReadinessOptions = ['Low', 'Moderate', 'High'];
const leadershipCommitmentOptions = ['Exploring', 'Committed', 'Fully Committed'];
const existingSystemsList = ['SAP', 'Salesforce', 'ServiceNow', 'Microsoft', 'Oracle', 'Custom Legacy', 'Data Lake/Warehouse', 'No Unified Platform'];

interface SelectorField {
  key: keyof BlueprintFormInput;
  label: string;
  options: string[];
  multi: boolean;
  required: boolean;
  advanced?: boolean;
}

export default function BlueprintGenerator() {
  const [form, setForm] = useState<BlueprintFormInput>({
    industry: '',
    companySize: '',
    topPriorities: [],
    aiJourneyStage: '',
    biggestChallenge: '',
    email: '',
    dataReadiness: '',
    existingSystems: [],
    leadershipCommitment: '',
  });

  const [activeSelector, setActiveSelector] = useState<SelectorField['key'] | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BlueprintFormInput, string>>>({});

  const selectors: SelectorField[] = useMemo(() => [
    { key: 'industry', label: 'Industry', options: industries, multi: false, required: true },
    { key: 'companySize', label: 'Company Size', options: companySizes, multi: false, required: true },
    { key: 'topPriorities', label: 'Top Priorities (up to 3)', options: topPrioritiesList, multi: true, required: true },
    { key: 'aiJourneyStage', label: 'AI Journey Stage', options: aiJourneyStages, multi: false, required: true },
    { key: 'biggestChallenge', label: 'Biggest Challenge', options: biggestChallenges, multi: false, required: true },
    { key: 'email', label: 'Business Email', options: [], multi: false, required: true },
  ], []);

  const advancedSelectors: SelectorField[] = useMemo(() => [
    { key: 'dataReadiness', label: 'Data Readiness', options: dataReadinessOptions, multi: false, required: false, advanced: true },
    { key: 'existingSystems', label: 'Existing Systems', options: existingSystemsList, multi: true, required: false, advanced: true },
    { key: 'leadershipCommitment', label: 'Leadership Commitment', options: leadershipCommitmentOptions, multi: false, required: false, advanced: true },
  ], []);

  const setSingle = (key: keyof BlueprintFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleMulti = (key: 'topPriorities' | 'existingSystems', value: string) => {
    setForm((prev) => {
      const current = prev[key] ?? [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((v) => v !== value) };
      }
      if (key === 'topPriorities' && current.length >= 3) {
        return prev;
      }
      return { ...prev, [key]: [...current, value] };
    });
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BlueprintFormInput, string>> = {};
    if (!form.industry) newErrors.industry = 'Select an industry';
    if (!form.companySize) newErrors.companySize = 'Select company size';
    if (form.topPriorities.length === 0) newErrors.topPriorities = 'Select at least 1 priority';
    if (!form.aiJourneyStage) newErrors.aiJourneyStage = 'Select your AI journey stage';
    if (!form.biggestChallenge) newErrors.biggestChallenge = 'Select your biggest challenge';
    if (!form.email) newErrors.email = 'Enter your business email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validate()) {
      setShowModal(true);
    }
  };

  const getSelectedText = (selector: SelectorField): string => {
    const val = form[selector.key];
    if (Array.isArray(val)) {
      return val.length > 0 ? val.join(', ') : 'Select';
    }
    return val || 'Select';
  };

  const isFieldSelected = (key: keyof BlueprintFormInput): boolean => {
    const val = form[key];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  };

  return (
    <section id="blueprint" className="py-24 lg:py-32 px-6 lg:px-16">
      <div className="max-w-4xl mx-auto">
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
            <span className="text-sm font-mono text-muted-text tracking-wider uppercase">Blueprint Generator</span>
            <span className="h-px w-16 bg-white/20" />
          </div>
          <h2 className="font-display font-bold text-white text-3xl md:text-5xl lg:text-6xl leading-tight">
            Generate Your <span className="text-gradient">Enterprise AI Blueprint</span>
          </h2>
          <p className="mt-4 text-muted-text max-w-2xl mx-auto text-lg">
            Answer a few strategic questions. Our AI engine will design your operating model, 
            architecture, agent ecosystem, and transformation roadmap.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl p-8 lg:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,26,0.7) 0%, rgba(13,13,13,0.8) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.4), 0 0 40px rgba(17,115,188,0.08)',
          }}
        >
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            {selectors.filter(s => s.required).map((s, i) => (
              <div key={s.key} className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300',
                      isFieldSelected(s.key)
                        ? 'bg-gff-gradient text-white'
                        : 'bg-white/[0.06] text-muted-text border border-white/[0.10]'
                    )}
                  >
                    {isFieldSelected(s.key) ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={cn(
                    'text-[10px] transition-colors',
                    isFieldSelected(s.key) ? 'text-white' : 'text-muted-text'
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < selectors.filter(s => s.required).length - 1 && (
                  <div className={cn(
                    'flex-1 h-px transition-all duration-300',
                    isFieldSelected(s.key) ? 'bg-white/20' : 'bg-white/[0.06]'
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Main fields grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {selectors.map((selector) => (
              <div key={selector.key as string} className={selector.key === 'email' ? 'sm:col-span-2' : ''}>
                {selector.key === 'email' ? (
                  <div>
                    <label className="text-xs font-mono text-white/60 mb-1.5 block">
                      {selector.label} {selector.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setSingle('email', e.target.value)}
                      placeholder="you@company.com"
                      className={cn(
                        'w-full bg-white/[0.03] border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-muted-text/40 focus:outline-none transition-all',
                        errors.email
                          ? 'border-red-500/40 focus:border-red-500/60'
                          : 'border-white/[0.08] focus:border-core-blue/40 hover:border-white/[0.12]'
                      )}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-mono text-white/60 mb-1.5 block">
                      {selector.label} {selector.required && <span className="text-red-400">*</span>}
                    </label>
                    <button
                      onClick={() => setActiveSelector(activeSelector === selector.key ? null : selector.key)}
                      className={cn(
                        'w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-300',
                        errors[selector.key]
                          ? 'border-red-500/30 bg-red-500/[0.03]'
                          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14]',
                        activeSelector === selector.key && 'border-core-blue/40 bg-white/[0.05]'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          'text-sm',
                          isFieldSelected(selector.key) ? 'text-white' : 'text-muted-text'
                        )}>
                          {getSelectedText(selector)}
                        </span>
                        <ChevronDown className={cn(
                          'w-4 h-4 text-white/40 transition-transform',
                          activeSelector === selector.key && 'rotate-180'
                        )} />
                      </div>
                    </button>
                    {errors[selector.key] && (
                      <span className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors[selector.key]}
                      </span>
                    )}

                    {/* Dropdown */}
                    {activeSelector === selector.key && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-2 rounded-xl bg-[#121218] border border-white/[0.08] max-h-48 overflow-y-auto z-10 relative"
                        style={{
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                      >
                        {selector.options.map((opt) => {
                          const isSelected = selector.multi
                            ? (form[selector.key] as string[]).includes(opt)
                            : form[selector.key] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                if (selector.multi) {
                                  toggleMulti(selector.key as 'topPriorities' | 'existingSystems', opt);
                                } else {
                                  setSingle(selector.key, opt);
                                  setActiveSelector(null);
                                }
                              }}
                              className={cn(
                                'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                                isSelected
                                  ? 'bg-white/[0.08] text-white border border-white/[0.10]'
                                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span>{opt}</span>
                                {selector.multi && isSelected && (
                                  <Check className="w-3.5 h-3.5 text-core-blue" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Advanced fields toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-mono text-muted-text hover:text-white transition-colors mb-4"
          >
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
            <ChevronDown className={cn('w-3 h-3 transition-transform', showAdvanced && 'rotate-180')} />
          </button>

          {/* Advanced fields */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
            >
              {advancedSelectors.map((selector) => (
                <div key={selector.key as string}>
                  <label className="text-xs font-mono text-white/60 mb-1.5 block">{selector.label}</label>
                  <button
                    onClick={() => setActiveSelector(activeSelector === selector.key ? null : selector.key)}
                    className={cn(
                      'w-full text-left rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:border-white/[0.14]',
                      activeSelector === selector.key && 'border-core-blue/40'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'text-sm',
                        isFieldSelected(selector.key) ? 'text-white' : 'text-muted-text'
                      )}>
                        {getSelectedText(selector)}
                      </span>
                      <ChevronDown className={cn(
                        'w-4 h-4 text-white/40 transition-transform',
                        activeSelector === selector.key && 'rotate-180'
                      )} />
                    </div>
                  </button>

                  {activeSelector === selector.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-2 rounded-xl bg-[#121218] border border-white/[0.08] max-h-48 overflow-y-auto z-10 relative"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                    >
                      {selector.options.map((opt) => {
                        const isSelected = selector.multi
                          ? ((form[selector.key] as string[]) || []).includes(opt)
                          : form[selector.key] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              if (selector.multi) {
                                toggleMulti(selector.key as 'existingSystems', opt);
                              } else {
                                setSingle(selector.key, opt);
                                setActiveSelector(null);
                              }
                            }}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                              isSelected
                                ? 'bg-white/[0.08] text-white border border-white/[0.10]'
                                : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt}</span>
                              {selector.multi && isSelected && <Check className="w-3.5 h-3.5 text-core-blue" />}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            onClick={handleGenerate}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded-2xl text-white font-medium text-lg sheen-btn hover-gff-glow-strong transition-all duration-500"
            style={{ backgroundImage: 'linear-gradient(90deg, #9A0003, #C03C85, #6B5BFF, #1173BC)' }}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate My Enterprise AI Blueprint
            </span>
          </motion.button>

          <p className="text-center text-[11px] text-muted-text mt-3">
            Your blueprint will include: AI Readiness Score · Top 5 Opportunities · 90-Day Roadmap · Architecture · Governance
          </p>
        </motion.div>
      </div>

      {/* Blueprint Result Modal */}
      <BlueprintModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={form}
      />
    </section>
  );
}
