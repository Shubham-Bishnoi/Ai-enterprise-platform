/**
 * GFF AI backend client.
 *
 * The backend wraps every response in an envelope:
 *   { success: boolean, data: T | null, error?: { code, message, details } }
 *
 * This helper unwraps that envelope and raises a typed error otherwise, so
 * callers only ever deal with `T`.
 *
 * All AI calls go through the backend — model providers are never called
 * from the browser, and no provider key is ever present in this bundle.
 */

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, '')

export const endpoints = {
  health: '/api/v1/health',

  agents: '/api/v1/agents',
  agentSession: '/api/v1/agents/session',
  agentChat: '/api/v1/agents/chat',
  agentQuickAction: '/api/v1/agents/quick-action',
  agentHandoff: '/api/v1/agents/handoff',

  blueprintOptions: '/api/v1/blueprint/options',
  blueprintGenerate: '/api/v1/blueprint/generate',

  contact: '/api/v1/contact',
  handoff: '/api/v1/handoff',
  consultationBook: '/api/v1/consultation/book',

  resources: '/api/v1/resources',
  industries: '/api/v1/industries',
  platforms: '/api/v1/platforms',
  capabilities: '/api/v1/capabilities',
  search: '/api/v1/search',

  analyticsEvents: '/api/v1/analytics/events',
} as const

type BackendEnvelope<T> = {
  success: boolean
  data: T | null
  error?: {
    code?: string
    message?: string
    details?: Record<string, unknown> | null
  } | null
}

export class ApiError extends Error {
  status: number
  code?: string
  details?: Record<string, unknown> | null

  constructor(message: string, status: number, code?: string, details?: Record<string, unknown> | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0
}

/**
 * Network failures, timeouts, 5xx and an unconfigured base URL all mean the
 * same thing to the UI: fall back to the static experience rather than
 * showing a broken panel.
 */
export function isBackendUnavailable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return true
  return error.status === 0 || error.status >= 500
}

export async function apiRequest<T>(path: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {
  if (!isApiConfigured()) {
    throw new ApiError('NEXT_PUBLIC_API_BASE_URL is not configured.', 0, 'not_configured')
  }

  // The backend runs on Render's free tier, which cold-starts. A generous
  // default keeps first-load requests from aborting mid-wake.
  const { timeoutMs = 45_000, ...requestInit } = init ?? {}
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestInit,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...requestInit.headers,
      },
    })
  } catch {
    throw new ApiError('Unable to reach the GFF AI backend.', 0, 'network_error')
  } finally {
    clearTimeout(timer)
  }

  let payload: BackendEnvelope<T> | null = null
  try {
    payload = (await response.json()) as BackendEnvelope<T>
  } catch {
    payload = null
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.error?.message || 'Request failed.',
      response.status || 500,
      payload?.error?.code,
      payload?.error?.details,
    )
  }

  if (payload.data === null || payload.data === undefined) {
    throw new ApiError('Response did not include data.', response.status || 500, 'empty_data')
  }

  return payload.data
}
