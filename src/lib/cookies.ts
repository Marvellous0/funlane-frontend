import type { AuthUser } from '@/interface';
import { AUTH_COOKIE } from './constants';

/**
 * Writes a small, non-HttpOnly cookie that Next.js middleware reads to enforce
 * route-level authorization. This is fine for a client-only prototype; a real
 * app would set an HttpOnly cookie from the server after verifying credentials.
 */
export function setAuthCookie(user: AuthUser): void {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify({ id: user.id, role: user.role }));
  // 7-day session
  document.cookie = `${AUTH_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
