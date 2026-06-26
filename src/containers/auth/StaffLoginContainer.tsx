'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth, type StaffPortal } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useHydration } from '@/hooks/useHydration';
import { homePathFor } from '@/services/auth.service';
import { StaffAuthLayout } from '@/components/layout/StaffAuthLayout';
import { IconMail, IconLock, IconEye, IconEyeOff, IconShield } from '@/components/ui/icons';

interface PortalMeta {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  subtitle: string;
  cta: string;
  alt: { href: string; label: string };
}

const PORTALS: Record<StaffPortal, PortalMeta> = {
  admin: {
    badge: 'Admin Console',
    badgeIcon: ShieldCheck,
    title: 'Administrator sign in',
    subtitle: 'Authorized administrators only — manage users, agents and platform settings.',
    cta: 'Sign in to console',
    alt: { href: '/agent/login', label: 'Agent sign in' },
  },
  agent: {
    badge: 'Agent Workspace',
    badgeIcon: Briefcase,
    title: 'Agent sign in',
    subtitle: 'Access the agency workspace to manage requests, quotes and ticket issuance.',
    cta: 'Sign in to workspace',
    alt: { href: '/admin/login', label: 'Admin sign in' },
  },
};

export function StaffLoginContainer({ portal }: { portal: StaffPortal }) {
  const meta = PORTALS[portal];

  const { signInStaff, loading } = useAuth();
  const user = useAuthStore((s) => s.user);
  const hydrated = useHydration();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Already authenticated? Skip the form and go to the dashboard.
  useEffect(() => {
    if (hydrated && user) router.replace(homePathFor(user.role));
  }, [hydrated, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signInStaff(portal, { email, password });
  }

  return (
    <StaffAuthLayout
      badge={meta.badge}
      badgeIcon={meta.badgeIcon}
      title={meta.title}
      subtitle={meta.subtitle}
      altHref={meta.alt.href}
      altLabel={meta.alt.label}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="staff-email" className="block text-sm font-medium text-ink mb-1.5">
            Email address
          </label>
          <div className="relative">
            <IconMail className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="staff-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@funlane.com"
              required
              className="auth-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="staff-password" className="block text-sm font-medium text-ink mb-1.5">
            Password
          </label>
          <div className="relative">
            <IconLock className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="staff-password"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-ink-3 hover:text-ink hover:bg-surface transition-colors"
            >
              {showPw ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="auth-banner">
          <IconShield className="w-5 h-5 text-blue shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <span className="font-semibold text-ink">Restricted access.</span> This portal is for
            authorized {portal === 'admin' ? 'administrators' : 'agents'} only. Activity is logged
            under NDPA-compliant controls.
          </p>
        </div>

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? 'Signing in…' : meta.cta}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-3">
        Forgot your password?{' '}
        <a href="/forgot-password" className="text-ink font-semibold hover:underline">
          Reset it
        </a>
      </p>

      {portal === 'admin' && (
        <p className="mt-2 text-center text-sm text-ink-3">
          First-time setup?{' '}
          <a href="/admin/register" className="text-ink font-semibold hover:underline">
            Create an admin account
          </a>
        </p>
      )}
    </StaffAuthLayout>
  );
}
