const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

interface BackendErrorPayload {
  code?: string;
  message?: string;
  details?: Record<string, unknown> | null;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T | null;
  error?: BackendErrorPayload | null;
}

export class ApiClientError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown> | null;

  constructor(message: string, status: number, code?: string, details?: Record<string, unknown> | null) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  let payload: BackendEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as BackendEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    const error = payload?.error;
    throw new ApiClientError(
      error?.message || 'Request failed.',
      response.status || 500,
      error?.code,
      error?.details,
    );
  }

  if (payload.data === null) {
    throw new ApiClientError('Response did not include data.', response.status || 500);
  }

  return payload.data;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
