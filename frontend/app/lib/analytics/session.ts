/**
 * Privacy-safe first-party visitor identity.
 *
 * - `anonymous_id`: browser-generated UUID in localStorage, so returning
 *   visitors are countable. No fingerprinting, no IPs, nothing personal.
 * - `visitor_session_id`: rotates after 30 minutes of inactivity, stored in
 *   localStorage alongside a last-activity stamp.
 *
 * Every accessor is wrapped so blocked/full storage can never break the site;
 * with storage unavailable, identifiers fall back to per-pageload values.
 */

const ANON_KEY = 'gffai_anon_id_v1'
const SESSION_KEY = 'gffai_session_v1'
const SESSION_IDLE_MINUTES = 30

type StoredSession = {
  id: string
  lastActivity: number
  started: boolean
}

function uuid(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `f_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  }
}

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

let memoryAnon: string | null = null
let memorySession: StoredSession | null = null

export function getAnonymousId(): string {
  const store = storage()
  if (!store) {
    if (!memoryAnon) memoryAnon = uuid()
    return memoryAnon
  }
  try {
    let id = store.getItem(ANON_KEY)
    if (!id) {
      id = uuid()
      store.setItem(ANON_KEY, id)
    }
    return id
  } catch {
    if (!memoryAnon) memoryAnon = uuid()
    return memoryAnon
  }
}

function readSession(): StoredSession | null {
  const store = storage()
  if (!store) return memorySession
  try {
    const raw = store.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return memorySession
  }
}

function writeSession(session: StoredSession): void {
  memorySession = session
  const store = storage()
  if (!store) return
  try {
    store.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* best-effort */
  }
}

/**
 * Current session id, rotating after the inactivity window. Also reports
 * whether this call started a brand-new session (so the caller can emit
 * `session_started` exactly once).
 */
export function touchSession(): { sessionId: string; isNew: boolean } {
  const now = Date.now()
  const existing = readSession()
  const expired = !existing || now - existing.lastActivity > SESSION_IDLE_MINUTES * 60_000
  if (expired) {
    const session: StoredSession = { id: uuid(), lastActivity: now, started: false }
    writeSession(session)
    return { sessionId: session.id, isNew: true }
  }
  writeSession({ ...existing, lastActivity: now })
  return { sessionId: existing.id, isNew: false }
}

export function markSessionStarted(sessionId: string): boolean {
  const session = readSession()
  if (!session || session.id !== sessionId || session.started) return false
  writeSession({ ...session, started: true })
  return true
}

export function deviceCategory(): string {
  const ua = navigator.userAgent.toLowerCase()
  if (/ipad|tablet/.test(ua)) return 'tablet'
  if (/mobi|iphone|android/.test(ua)) return 'mobile'
  return 'desktop'
}

export function browserCategory(): string {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('edg/')) return 'edge'
  if (ua.includes('firefox')) return 'firefox'
  if (ua.includes('chrome') || ua.includes('crios')) return 'chrome'
  if (ua.includes('safari')) return 'safari'
  return 'other'
}
