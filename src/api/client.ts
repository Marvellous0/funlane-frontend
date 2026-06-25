/**
 * Network boundary for the app.
 *
 * `simulate` remains for the parts of the prototype still backed by the local
 * zustand store (requests, wallet). `apiFetch` is the real HTTP client used by
 * the auth layer — it talks to the Funlane backend, attaches the bearer token,
 * and normalizes every failure into a typed `ApiError`.
 */
import { API_BASE_URL } from '@/lib/constants';
import { getToken } from '@/lib/token';

/** Resolves a value after a delay — stand-in for a real request. */
export function simulate<T>(value: T, delay = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}

/** Per-field validation messages, keyed by field name (from the backend). */
export type FieldErrors = Record<string, string[]>;

/**
 * Thrown for any non-2xx response (or a network failure with `status: 0`).
 * Carries the human-readable `message` plus any structured validation errors
 * so callers can surface field-level feedback.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: FieldErrors;
  readonly formErrors?: string[];

  constructor(
    message: string,
    status: number,
    detail?: { fieldErrors?: FieldErrors; formErrors?: string[] },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = detail?.fieldErrors;
    this.formErrors = detail?.formErrors;
  }

  /** True when the failure was a network/connectivity error (no HTTP status). */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** JSON-serializable request body. */
  body?: unknown;
  /** Attach the stored JWT as a bearer token. Default: false. */
  auth?: boolean;
  signal?: AbortSignal;
}

function parseJson(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Performs a JSON request against the backend and returns the parsed body.
 * Throws `ApiError` on any non-2xx response or transport failure.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, signal } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.', 0);
  }

  const payload = parseJson(await res.text()) as
    | { message?: string; errors?: { fieldErrors?: FieldErrors; formErrors?: string[] } }
    | null;

  if (!res.ok) {
    const message =
      payload && typeof payload.message === 'string'
        ? payload.message
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, {
      fieldErrors: payload?.errors?.fieldErrors,
      formErrors: payload?.errors?.formErrors,
    });
  }

  return payload as T;
}
