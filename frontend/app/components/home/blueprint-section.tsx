'use client'

/**
 * Generate Blueprint — homepage section (position four).
 *
 * Orchestrates the redesigned experience while preserving the original form
 * logic and backend contract: it still fetches live options and still calls
 * generateBlueprint(). The API result (or, when the backend is unreachable, the
 * submitted form alone) is passed through deriveStructuredBlueprint() to produce
 * the structured, personalised decision document the redesigned result renders.
 * Nothing about the blueprint is hard-coded — every field is derived from input.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SplitVisualFeature } from '@/components/ui/enterprise-visuals'
import { ENTERPRISE_VISUALS } from '@/components/ui/enterprise-visuals-data'
import {
  FALLBACK_BLUEPRINT_OPTIONS,
  fetchBlueprintOptions,
  generateBlueprint,
  type BlueprintFormInput,
  type BlueprintOptions,
} from '@/lib/api/blueprint'
import { deriveStructuredBlueprint, type StructuredBlueprint } from '@/lib/blueprint/model'
import { trackEvent } from '@/lib/api/analytics'
import { leadMetadata } from '@/lib/attribution'
import { BlueprintForm, type BlueprintErrors } from '@/components/home/blueprint/blueprint-form'
import { BlueprintResult } from '@/components/home/blueprint/blueprint-result'

const EMPTY_FORM: BlueprintFormInput = {
  industry: '',
  companySize: '',
  topPriorities: [],
  aiJourneyStage: '',
  biggestChallenge: '',
  email: '',
  dataReadiness: '',
}

const PROGRESS_MESSAGES = [
  'Analysing enterprise context',
  'Prioritising AI opportunities',
  'Designing the target architecture',
  'Building the 90-day roadmap',
]

const EMAIL_RE = /^\S+@\S+\.\S+$/

export function BlueprintSection() {
  const reduceMotion = useReducedMotion()

  const [options, setOptions] = useState<BlueprintOptions>(FALLBACK_BLUEPRINT_OPTIONS)
  const [form, setForm] = useState<BlueprintFormInput>(EMPTY_FORM)
  const [errors, setErrors] = useState<BlueprintErrors>({})
  const [loading, setLoading] = useState(false)
  const [progressIndex, setProgressIndex] = useState(0)
  const [result, setResult] = useState<StructuredBlueprint | null>(null)
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchBlueprintOptions()
      .then((live) => {
        if (!cancelled && live.industries.length) setOptions(live)
      })
      .catch(() => {
        // Static option set is already in state.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }, [])

  const onField = (patch: Partial<BlueprintFormInput>) => {
    setForm((prev) => ({ ...prev, ...patch }))
    // Clear the error for any field being edited.
    const keys = Object.keys(patch) as (keyof BlueprintFormInput)[]
    setErrors((prev) => {
      const next = { ...prev }
      keys.forEach((k) => delete next[k])
      return next
    })
  }

  const onTogglePriority = (value: string) => {
    setForm((prev) => ({
      ...prev,
      topPriorities: prev.topPriorities.includes(value)
        ? prev.topPriorities.filter((p) => p !== value)
        : [...prev.topPriorities, value],
    }))
    setErrors((prev) => ({ ...prev, topPriorities: undefined }))
  }

  const validate = (): BlueprintErrors => {
    const e: BlueprintErrors = {}
    if (!form.industry) e.industry = 'Select an industry.'
    if (!form.companySize) e.companySize = 'Select a company size.'
    if (!form.aiJourneyStage) e.aiJourneyStage = 'Select your AI maturity.'
    if (!form.biggestChallenge) e.biggestChallenge = 'Select your biggest challenge.'
    if (!form.topPriorities.length) e.topPriorities = 'Choose at least one desired outcome.'
    if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid work email.'
    return e
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (loading) return

    const found = validate()
    if (Object.keys(found).length) {
      setErrors(found) // Preserves entered values; just surfaces what's missing.
      return
    }
    setErrors({})
    setLoading(true)
    setProgressIndex(0)
    progressTimer.current = setInterval(() => {
      setProgressIndex((i) => (i + 1) % PROGRESS_MESSAGES.length)
    }, 1400)

    trackEvent({
      eventName: 'blueprint_generate_submitted',
      source: 'homepage',
      component: 'BlueprintSection',
      payload: { industry: form.industry, company_size: form.companySize },
    })

    // Keep the progress state visible long enough to be meaningful even when the
    // call resolves quickly, without inventing fake percentages.
    const started = Date.now()
    const minVisibleMs = 1600

    let structured: StructuredBlueprint
    try {
      const api = await generateBlueprint({ ...form, metadata: leadMetadata() })
      structured = deriveStructuredBlueprint(form, api)
    } catch {
      // Backend unavailable — derive from the submitted inputs, clearly flagged.
      structured = deriveStructuredBlueprint(form, null)
    }

    const elapsed = Date.now() - started
    if (elapsed < minVisibleMs) await new Promise((r) => setTimeout(r, minVisibleMs - elapsed))

    if (progressTimer.current) clearInterval(progressTimer.current)
    setLoading(false)
    setResult(structured)
  }

  const reset = () => {
    setResult(null)
    setErrors({})
  }

  return (
    <section id="blueprint" className="gradient-cta scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Visual introduction — the interactive generator follows immediately below. */}
        <SplitVisualFeature
          eyebrow="Enterprise Intelligence Blueprint"
          title="Generate Your Enterprise Intelligence Blueprint"
          description="Answer a few questions to receive an initial view of your opportunities, enterprise memory requirements, agent architecture, governance priorities and phased roadmap — shaped by your inputs."
          imageSrc={ENTERPRISE_VISUALS.blueprint.src}
          imageAlt={ENTERPRISE_VISUALS.blueprint.alt}
          accent={ENTERPRISE_VISUALS.blueprint.accent}
          imageSide="left"
        />

        <AnimatePresence mode="wait" initial={false}>
          {!result ? (
            <motion.div
              key="form"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <ScrollReveal>
                <BlueprintForm
                  options={options}
                  form={form}
                  errors={errors}
                  onField={onField}
                  onTogglePriority={onTogglePriority}
                  onSubmit={onSubmit}
                  loading={loading}
                  progressMessage={loading ? PROGRESS_MESSAGES[progressIndex] : null}
                />
              </ScrollReveal>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <BlueprintResult blueprint={result} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
