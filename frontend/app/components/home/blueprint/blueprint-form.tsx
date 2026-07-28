'use client'

/**
 * Redesigned Generate-Blueprint form.
 *
 * Native <select> menus are replaced with the accessible SelectField
 * (portalled combobox/listbox). The container is a calm, premium surface that
 * sits on the pale homepage background. Validation is shown per field and
 * submitted values are preserved on failure. The submit button carries a live
 * progress state and prevents duplicate submissions.
 */

import { AlertCircle, Check, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SelectField } from '@/components/ui/select-field'
import type { BlueprintFormInput, BlueprintOptions } from '@/lib/api/blueprint'

export type BlueprintErrors = Partial<Record<keyof BlueprintFormInput, string>>

// Values surfaced under "Popular" in the searchable industry list.
const POPULAR_INDUSTRIES = ['Healthcare', 'Financial Services', 'Manufacturing', 'Retail', 'Mining', 'Energy']

export function BlueprintForm({
  options,
  form,
  errors,
  onField,
  onTogglePriority,
  onSubmit,
  loading,
  progressMessage,
}: {
  options: BlueprintOptions
  form: BlueprintFormInput
  errors: BlueprintErrors
  onField: (patch: Partial<BlueprintFormInput>) => void
  onTogglePriority: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  progressMessage: string | null
}) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto w-full max-w-[1080px] rounded-[30px] border border-border bg-white p-6 shadow-[0_18px_50px_rgba(7,22,47,0.08)] md:p-11"
    >
      <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
        <SelectField
          label="Industry"
          value={form.industry}
          onChange={(v) => onField({ industry: v })}
          options={options.industries}
          placeholder="Select industry"
          searchable
          popular={POPULAR_INDUSTRIES}
          required
          error={errors.industry}
        />
        <SelectField
          label="Company size"
          value={form.companySize}
          onChange={(v) => onField({ companySize: v })}
          options={options.companySizes}
          placeholder="Select size"
          required
          error={errors.companySize}
        />
        <SelectField
          label="AI maturity"
          value={form.aiJourneyStage}
          onChange={(v) => onField({ aiJourneyStage: v })}
          options={options.aiJourneyStages}
          placeholder="Select stage"
          required
          error={errors.aiJourneyStage}
        />
        <SelectField
          label="Biggest challenge"
          value={form.biggestChallenge}
          onChange={(v) => onField({ biggestChallenge: v })}
          options={options.biggestChallenges}
          placeholder="Select challenge"
          required
          error={errors.biggestChallenge}
        />
        <SelectField
          label="Data readiness"
          value={form.dataReadiness ?? ''}
          onChange={(v) => onField({ dataReadiness: v })}
          options={options.dataReadiness}
          placeholder="Not sure"
          optional
        />
        <EmailField value={form.email} error={errors.email} onChange={(v) => onField({ email: v })} />
      </div>

      {/* Desired outcomes / priorities */}
      <fieldset className="mt-7">
        <legend className="text-sm font-medium text-navy">
          Desired outcomes <span className="font-normal text-muted-foreground">(select one or more)</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {options.topPriorities.map((p) => {
            const active = form.topPriorities.includes(p)
            return (
              <button
                key={p}
                type="button"
                onClick={() => onTogglePriority(p)}
                aria-pressed={active}
                className={cn(
                  'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                  active
                    ? 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue'
                    : 'border-border bg-background text-navy hover:border-brand-blue/40 hover:text-brand-blue',
                )}
              >
                {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                {p}
              </button>
            )
          })}
        </div>
        {errors.topPriorities && (
          <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-brand-red">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {errors.topPriorities}
          </p>
        )}
      </fieldset>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full bg-brand-blue px-8 text-base font-semibold text-white shadow-brand-soft transition-all duration-300 hover:bg-brand-blue-hover hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(21,93,252,0.28)] disabled:cursor-progress disabled:opacity-90 disabled:hover:translate-y-0 sm:w-auto sm:min-w-[280px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              {progressMessage ?? 'Generating…'}
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Generate Blueprint
            </>
          )}
        </button>
        <p aria-live="polite" className="min-h-[1rem] text-center text-xs text-muted-foreground">
          {loading ? progressMessage : 'Takes under a minute · your inputs shape the result.'}
        </p>
      </div>
    </form>
  )
}

function EmailField({ value, error, onChange }: { value: string; error?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="bp-email" className="text-sm font-medium text-navy">
        Work email
      </label>
      <input
        id="bp-email"
        type="email"
        inputMode="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="you@company.com"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'bp-email-error' : undefined}
        className={cn(
          'h-14 w-full rounded-[16px] border bg-background px-4 text-[15px] text-navy outline-none transition-colors placeholder:text-muted-foreground',
          'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          error
            ? 'border-brand-red/60 focus-visible:ring-brand-red/50'
            : 'border-border hover:border-brand-blue/40 focus:border-brand-blue focus-visible:ring-brand-blue/60',
        )}
      />
      {error && (
        <p id="bp-email-error" role="alert" className="flex items-center gap-1.5 text-sm text-brand-red">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
