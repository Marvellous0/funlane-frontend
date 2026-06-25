import { AUTH_TOKEN_KEY } from './constants';

/**
 * The backend issues a JWT on login. The HTTP client reads it synchronously
 * (outside React) to attach the `Authorization: Bearer` header, so it lives in
 * localStorage under a dedicated key rather than only inside the auth store.
 *
 * Note: this is readable by client-side JS, which is acceptable for this SPA.
 * A hardened setup would keep the token in an HttpOnly cookie set by the server.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}
