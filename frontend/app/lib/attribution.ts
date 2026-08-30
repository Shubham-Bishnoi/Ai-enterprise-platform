/**
 * First-touch attribution + consent metadata for lead submissions.
 *
 * UTM parameters and the referrer only exist on the landing URL, so they are
 * captured once per browser session (see AttributionInit) and attached to
 * every form payload's `metadata` — the backend lifts them into the
 * `lead_submissions` reporting columns. Only public marketing attribution is
 * stored; no fingerprinting, no IPs.
 */

const STORAGE_KEY = 'gffai_attribution_v1'

export const PRIVACY_POLICY_VERSION = 'v1'
/** Recorded when a visitor submits a form under the privacy notice. */
export const CONSENT_FORM_SUBMISSION = 'privacy_policy_acknowledged'

export type StoredAttribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  referrer?: string
  landing_page?: string
}

/** First-touch attribution captured by initAttribution (may be empty). */
export function getStoredAttribution(): StoredAttribution {
  if (typeof window === 'undefined') return {}
  const storage = safeSessionStorage()
  if (!storage) return {}
  try {
    return JSON.parse(storage.getItem(STORAGE_KEY) || '{}') as StoredAttribution
  } catch {
    return {}
  }
}

function safeSessionStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

/** Capture UTM/referrer once per session. Runs client-side only. */
export function initAttribution(): void {
  const storage = safeSessionStorage()
  if (!storage || storage.getItem(STORAGE_KEY)) return

  const params = new URLSearchParams(window.location.search)
  const stored: StoredAttribution = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    referrer: document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : undefined,
    landing_page: window.location.pathname,
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    /* storage full/blocked — attribution is best-effort */
  }
}

/**
 * Metadata bag for a form submission: first-touch attribution, the page the
 * form was submitted from, and the consent recorded by that submission.
 */
export function leadMetadata(options?: { marketingConsent?: boolean }): Record<string, unknown> {
  let stored: StoredAttribution = {}
  const storage = typeof window !== 'undefined' ? safeSessionStorage() : null
  if (storage) {
    try {
      stored = JSON.parse(storage.getItem(STORAGE_KEY) || '{}') as StoredAttribution
    } catch {
      stored = {}
    }
  }
  return {
    ...(stored.utm_source ? { utm_source: stored.utm_source } : {}),
    ...(stored.utm_medium ? { utm_medium: stored.utm_medium } : {}),
    ...(stored.utm_campaign ? { utm_campaign: stored.utm_campaign } : {}),
    ...(stored.referrer ? { referrer: stored.referrer } : {}),
    source_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    consent_status: CONSENT_FORM_SUBMISSION,
    privacy_policy_version: PRIVACY_POLICY_VERSION,
    marketing_consent: options?.marketingConsent ?? false,
  }
}
