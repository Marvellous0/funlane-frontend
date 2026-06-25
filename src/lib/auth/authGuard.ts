import type { Role } from '@/interface';
import type { CookiePrincipal } from './types';

export const ROLE_HOME: Record<Role, string> = {
  client: '/client/dashboard',
  agent: '/agent/board',
};

/** Route prefixes that require a specific role. */
const PROTECTED: { prefix: string; role: Role }[] = [
  { prefix: '/client', role: 'client' },
  { prefix: '/agent', role: 'agent' },
];

export function parsePrincipal(raw: string | undefined): CookiePrincipal | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as CookiePrincipal;
    if (parsed && (parsed.role === 'client' || parsed.role === 'agent') && parsed.id) {
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
  // Authenticated users should never sit on the login screen.
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify'];
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
