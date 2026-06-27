/**
 * "Remember me" persists only the email address (never the password) so the
 * sign-in screens can pre-fill it on return. The session itself is kept by the
 * auth store; this is purely a convenience for the email field.
 */
const KEY = 'funlane_remember_email';

export function getRememberedEmail(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(KEY) ?? '';
}

export function rememberEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, email);
}

export function forgetEmail(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
