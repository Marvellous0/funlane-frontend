'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Briefcase, Mail, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Formik, Form } from 'formik';
import { useAuth, type StaffPortal } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useHydration } from '@/hooks/useHydration';
import { homePathFor } from '@/services/auth.service';
import { StaffAuthLayout } from '@/components/layout/StaffAuthLayout';
import { IconShield } from '@/components/ui/icons';
import { TextField, CheckboxField } from '@/components/form';
import { staffLoginSchema } from '@/lib/validation/schemas';
import { getRememberedEmail, rememberEmail, forgetEmail } from '@/lib/rememberMe';

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

interface StaffLoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export function StaffLoginContainer({ portal }: { portal: StaffPortal }) {
  const meta = PORTALS[portal];

  const { signInStaff, loading } = useAuth();
  const user = useAuthStore((s) => s.user);
  const hydrated = useHydration();
  const router = useRouter();

  const [initialValues] = useState<StaffLoginValues>(() => ({
    email: getRememberedEmail(),
    password: '',
    remember: Boolean(getRememberedEmail()),
  }));

  // Already authenticated? Skip the form and go to the dashboard.
  useEffect(() => {
    if (hydrated && user) router.replace(homePathFor(user.role));
  }, [hydrated, user, router]);

  async function onSubmit(values: StaffLoginValues) {
    if (values.remember) rememberEmail(values.email.trim());
    else forgetEmail();
    await signInStaff(portal, { email: values.email, password: values.password });
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
      <Formik initialValues={initialValues} validationSchema={staffLoginSchema} onSubmit={onSubmit}>
        <Form noValidate className="space-y-4">
          <TextField
            name="email"
            type="email"
            label="Email address"
            placeholder="name@funlane.com"
            icon={Mail}
            autoComplete="email"
            id="staff-email"
          />

          <div>
            <TextField
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              autoComplete="current-password"
              id="staff-password"
            />
            <CheckboxField name="remember" className="mt-3">Remember Me</CheckboxField>
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
        </Form>
      </Formik>

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
