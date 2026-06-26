import type { Role } from '@/interface';
import type { CookiePrincipal } from './types';

export const ROLE_HOME: Record<Role, string> = {
  client: '/client/dashboard',
  agent: '/agent/board',
  admin: '/admin',
};

/** Route prefixes that require a specific role. */
const PROTECTED: { prefix: string; role: Role }[] = [
  { prefix: '/client', role: 'client' },
  { prefix: '/agent', role: 'agent' },
  { prefix: '/admin', role: 'admin' },
];

export function parsePrincipal(raw: string | undefined): CookiePrincipal | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as CookiePrincipal;
    const validRole =
      parsed?.role === 'client' || parsed?.role === 'agent' || parsed?.role === 'admin';
    if (parsed && validRole && parsed.id) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Pure authorization decision for a request.
 * Returns a path to redirect to, or `null` to allow the request through.
 */
export function resolveRedirect(pathname: string, principal: CookiePrincipal | null): string | null {
  // Authenticated users should never sit on a login screen. The staff logins
  // (/admin/login, /agent/login) are listed here so they stay reachable when
  // signed out — `/agent/login` would otherwise be caught by the `/agent`
  // protected prefix below.
  const publicRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify',
    '/admin/login',
    '/admin/register',
    '/agent/login',
  ];
  if (publicRoutes.includes(pathname)) {
    return principal ? ROLE_HOME[principal.role] : null;
  }

  const match = PROTECTED.find((p) => pathname === p.prefix || pathname.startsWith(p.prefix + '/'));
  if (!match) return null;

  // Authentication: no principal -> go sign in.
  if (!principal) return '/login';

  // Authorization: wrong role -> bounce to their own dashboard.
  if (principal.role !== match.role) return ROLE_HOME[principal.role];

  return null;
}
