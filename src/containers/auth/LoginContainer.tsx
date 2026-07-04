'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import type { Role } from '@/interface';
import { useAuth } from '@/hooks/useAuth';
import { useHydration } from '@/hooks/useHydration';
import { homePathFor } from '@/services/auth.service';
import { IconShield } from '@/components/ui/icons';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { TextField, CheckboxField } from '@/components/form';
import { loginSchema } from '@/lib/validation/schemas';
import { getRememberedEmail, rememberEmail, forgetEmail } from '@/lib/rememberMe';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export function LoginContainer() {
  const { user, signIn, loading, error } = useAuth();
  const hydrated = useHydration();
  const router = useRouter();

  const [role] = useState<Role>('client');
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);
  const [initialValues] = useState<LoginValues>(() => ({
    email: getRememberedEmail(),
    password: '',
    remember: Boolean(getRememberedEmail()),
  }));

  useEffect(() => {
    if (hydrated && user) router.replace(homePathFor(user.role));
  }, [hydrated, user, router]);

  async function onSubmit(values: LoginValues) {
    if (values.remember) rememberEmail(values.email.trim());
    else forgetEmail();
    await signIn({ email: values.email, password: values.password, role });
  }

  function handleGoogleSignIn() {
    // The backend doesn't expose an OAuth endpoint yet — keep the affordance
    // but be honest about it rather than faking a sign-in.
    setOauthNotice('Google sign-in is coming soon — please use your email and password.');
  }

  return (
    <AuthLayout title="Streamlining Global Journeys."
      description="The gold standard in corporate travel and logistics. Your precision-engineered portal ensures every movement is managed with absolute transparency.">
      <h1 className="text-2xl font-bold text-ink mb-1.5">Welcome back</h1>
      <p className="text-ink-3 text-sm mb-6">Enter your credentials to access your secure dashboard.</p>

      <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={onSubmit}>
        <Form noValidate className="space-y-4">
          <TextField
            name="email"
            type="email"
            label="Email address"
            placeholder="name@company.com"
            icon={Mail}
            autoComplete="email"
            id="login-email"
          />

          <div>
            <TextField
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              autoComplete="current-password"
              id="login-password"
              hint={
                <Link href="/forgot-password" className="text-xs font-medium text-sky-600 hover:underline">
                  Forgot password?
                </Link>
              }
            />
            <CheckboxField name="remember" className="mt-3">Remember Me</CheckboxField>
          </div>

          <div className="auth-banner">
            <IconShield className="w-5 h-5 text-blue shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <span className="font-semibold text-ink">Security protocol:</span> Your session is protected by
              NDPA-compliant encryption and times out after 10 minutes of inactivity.
            </p>
          </div>

          {error && (
            <div className="bg-red-soft text-red-dark rounded-lg px-4 py-3 text-sm font-medium animate-slide-up flex items-center gap-2">
              <AlertTriangle aria-hidden="true" className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </Form>
      </Formik>

      <div className="relative flex items-center justify-center my-5">
        <div className="w-full h-px bg-line" />
        <span className="absolute bg-card px-3 text-xs text-ink-3">or continue with</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full h-12 flex items-center justify-center gap-3 border border-line rounded-lg bg-card hover:bg-surface transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="text-sm font-medium text-ink">Sign in with Google</span>
      </button>

      {oauthNotice && (
        <p className="mt-3 text-center text-xs text-ink-3">{oauthNotice}</p>
      )}

      <p className="mt-6 text-center text-sm text-ink-3">
        Not a member?{' '}
        <Link href="/signup" className="text-ink font-semibold hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-2 text-center text-xs text-ink-3">
        Staff member? Sign in to the{' '}
        <Link href="/agent/login" className="font-medium text-ink hover:underline">
          Agent
        </Link>{' '}
        or{' '}
        <Link href="/admin/login" className="font-medium text-ink hover:underline">
          Admin
        </Link>{' '}
        portal.
      </p>

      <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-ink-3">
        <span>Privacy Policy</span>
        <span aria-hidden="true">·</span>
        <span>Terms of Service</span>
        <span aria-hidden="true">·</span>
        <span>NDPA Compliance</span>
      </div>
    </AuthLayout >
  );
}
