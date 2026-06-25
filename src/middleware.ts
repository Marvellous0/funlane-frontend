import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE } from './lib/constants';
import { parsePrincipal, resolveRedirect } from './lib/auth/authGuard';

/**
 * Edge authorization gate. Separates the client portal (/client/*) from the
 * agency dashboard (/agent/*): unauthenticated users are sent to /login, and
 * users hitting the wrong area are redirected to their own dashboard.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const principal = parsePrincipal(req.cookies.get(AUTH_COOKIE)?.value);
  const target = resolveRedirect(pathname, principal);

  if (target && target !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Run on app routes only, skipping Next internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
