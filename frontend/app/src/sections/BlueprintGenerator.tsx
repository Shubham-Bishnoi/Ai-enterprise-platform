import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Sparkles, AlertCircle, Check } from 'lucide-react';
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
  const activeSelectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeSelector) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSelector(null);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (activeSelectorRef.current && !activeSelectorRef.current.contains(event.target as Node)) {
        setActiveSelector(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [activeSelector]);

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

  const requiredSelectors = selectors.filter((selector) => selector.required);
  const currentStepIndex = requiredSelectors.findIndex((selector) => !isFieldSelected(selector.key));
  const currentVisualStep = currentStepIndex === -1 ? requiredSelectors.length - 1 : currentStepIndex;

  const getSelector = (key: SelectorField['key']) => selectors.find((selector) => selector.key === key)!;

  const primaryColumns: SelectorField[][] = [
    [getSelector('industry'), getSelector('topPriorities'), getSelector('biggestChallenge')],
    [getSelector('companySize'), getSelector('aiJourneyStage'), getSelector('email')],
  ];

  const stepLabels: Partial<Record<keyof BlueprintFormInput, string>> = {
    topPriorities: 'Priorities',
    aiJourneyStage: 'AI Journey',
    biggestChallenge: 'Challenge',
  };

  const renderField = (selector: SelectorField) => {
    if (selector.key === 'email') {
      return (
        <div key={selector.key}>
          <label className="mb-2 block text-sm font-medium text-white/80">
            {selector.label} {selector.required && <span className="text-red-400">*</span>}
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setSingle('email', e.target.value)}
            placeholder="you@company.com"
            className={cn(
              'blueprint-email-input h-12 w-full rounded-xl border bg-white/[0.04] px-4 text-sm text-white/90 placeholder:text-white/45 outline-none transition-all md:text-base',
              errors.email
                ? 'border-red-500/40 focus:border-red-500/60 focus:ring-4 focus:ring-red-500/10'
                : 'border-white/[0.10] hover:border-white/[0.18] focus:border-core-blue/60 focus:ring-4 focus:ring-core-blue/10'
            )}
          />
          {errors.email && (
            <span className="mt-2 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
            </span>
          )}
        </div>
      );
    }

    const isOpen = activeSelector === selector.key;
    const hasError = !!errors[selector.key];

    return (
      <div
        key={selector.key}
        ref={(node) => {
          if (isOpen) {
            activeSelectorRef.current = node;
          }
        }}
        className={cn('relative', isOpen && 'z-[120]')}
      >
        <label className="mb-2 block text-sm font-medium text-white/80">
          {selector.label} {selector.required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setActiveSelector(isOpen ? null : selector.key)}
          aria-expanded={isOpen}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-xl border bg-white/[0.04] px-4 text-left transition-all duration-300',
            hasError
              ? 'border-red-500/35 bg-red-500/[0.04]'
              : 'border-white/[0.10] hover:border-white/[0.20]',
            isOpen && 'border-core-blue/60 bg-white/[0.06] ring-4 ring-core-blue/10'
          )}
        >
          <span
            className={cn(
              'min-w-0 flex-1 truncate pr-4 text-sm md:text-base',
              isFieldSelected(selector.key) ? 'text-white/95' : 'text-white/45'
            )}
          >
            {getSelectedText(selector)}
          </span>
          <ChevronDown className={cn('h-4 w-4 flex-shrink-0 text-white/50 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {hasError && (
          <span className="mt-2 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5" /> {errors[selector.key]}
          </span>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-[130] max-h-64 overflow-y-auto rounded-2xl border border-white/12 bg-[#0d0d10] p-2 shadow-2xl shadow-black/70 backdrop-blur-xl"
            style={{
              boxShadow: '0 28px 72px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(10,10,12,0.08)_20%,rgba(0,0,0,0.24)_100%)]" />
            {selector.options.map((opt) => {
              const isSelected = selector.multi
                ? (form[selector.key] as string[]).includes(opt)
                : form[selector.key] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (selector.multi) {
                      toggleMulti(selector.key as 'topPriorities' | 'existingSystems', opt);
                    } else {
                      setSingle(selector.key, opt);
                      setActiveSelector(null);
                    }
                  }}
                  className={cn(
                    'relative z-10 w-full rounded-xl px-4 py-3 text-left text-sm text-white/85 transition-all hover:bg-white/10 hover:text-white',
                    isSelected
                      ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                      : ''
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{opt}</span>
                    {selector.multi && isSelected && <Check className="h-3.5 w-3.5 text-core-blue" />}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <section id="blueprint" className="relative isolate px-6 pb-24 pt-16 lg:px-16 lg:pb-28 lg:pt-20">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-12 max-w-4xl text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16 bg-white/20" />
            <span className="text-sm font-mono text-muted-text tracking-wider uppercase">Blueprint Generator</span>
            <span className="h-px w-16 bg-white/20" />
          </div>
          <h2 className="font-display font-bold tracking-tight text-white text-4xl md:text-5xl lg:text-[54px] xl:text-[60px] 2xl:text-[66px] leading-tight">
            <span>Generate Your </span>
            <span className="text-gradient lg:whitespace-nowrap">Enterprise AI Blueprint</span>
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
          className="mx-auto mt-12 w-full max-w-[1040px] overflow-visible rounded-[26px] border border-white/10 bg-[#101014]/90 p-6 shadow-2xl lg:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(26,26,26,0.7) 0%, rgba(13,13,13,0.8) 100%)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 20px 64px rgba(0,0,0,0.38), 0 0 32px rgba(17,115,188,0.06)',
          }}
        >
          {/* Progress indicator */}
          <div className="mb-8 w-full overflow-x-auto rounded-2xl border border-white/[0.10] bg-white/[0.03] px-4 py-4 lg:overflow-hidden lg:px-5">
            <div className="grid min-w-[760px] grid-cols-[auto_minmax(14px,1fr)_auto_minmax(14px,1fr)_auto_minmax(14px,1fr)_auto_minmax(14px,1fr)_auto_minmax(14px,1fr)_auto] items-center gap-2 lg:min-w-0">
              {requiredSelectors.map((selector, i) => {
                const isCompleted = isFieldSelected(selector.key);
                const isCurrent = currentStepIndex !== -1 && currentVisualStep === i;
                const isConnectorActive = isCompleted || isCurrent || currentStepIndex === -1;

                return (
                  <div key={selector.key} className="contents">
                    <div className="flex min-w-0 items-center gap-2 rounded-xl px-1 py-1.5">
                      <span
                        className={cn(
                          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300 lg:h-8 lg:w-8 lg:text-sm',
                          isCompleted
                            ? 'border-transparent bg-gff-gradient text-white shadow-[0_0_18px_rgba(17,115,188,0.18)]'
                            : isCurrent
                              ? 'border-core-blue/40 bg-core-blue/15 text-white'
                              : 'border-white/[0.14] bg-white/[0.04] text-white/70'
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className={cn('whitespace-nowrap text-[11px] font-medium leading-none lg:text-xs xl:text-[13px]', isCompleted || isCurrent ? 'text-white/90' : 'text-white/65')}>
                        {stepLabels[selector.key] || selector.label}
                      </span>
                    </div>

                    {i < requiredSelectors.length - 1 && (
                      <div className="relative h-px min-w-4 flex-1">
                        <div
                          className={cn(
                            'absolute inset-x-0 top-0 h-px transition-colors duration-300',
                            isConnectorActive ? 'bg-white/25' : 'bg-white/10'
                          )}
                        />
                        <ChevronRight
                          className={cn(
                            'absolute -right-1 -top-1.5 h-3 w-3 transition-colors duration-300',
                            isConnectorActive ? 'text-white/35' : 'text-white/15'
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main fields grid */}
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {primaryColumns.map((column, index) => (
              <div key={index} className="space-y-5 lg:space-y-6">
                {column.map((selector) => renderField(selector))}
              </div>
            ))}
          </div>

          {/* Advanced fields toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white"
          >
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', showAdvanced && 'rotate-180')} />
          </button>

          {/* Advanced fields */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {advancedSelectors.map((selector) => renderField(selector))}
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            onClick={handleGenerate}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-500 hover:scale-[1.01] hover:shadow-blue-500/30 md:text-lg"
            style={{ backgroundImage: 'linear-gradient(90deg, #9A0003, #C03C85, #6B5BFF, #1173BC)' }}
          >
            <Sparkles className="h-5 w-5" />
            <span>Generate My Enterprise AI Blueprint</span>
          </motion.button>

          <p className="mt-4 text-center text-xs leading-relaxed text-white/45">
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
