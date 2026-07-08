'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconLock } from '@/components/ui';
import { Check, MailCheck, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { verifyEmail } from '@/api/auth.api';
import { ApiError } from '@/api';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Loader } from '@/components/ui';

type VerificationState =
  /** No token in the URL — the user just signed up and must check their inbox. */
  | 'awaiting'
  | 'verifying'
  | 'success'
  | 'error';

export function VerificationContainer() {
  const router = useRouter();
  const [state, setState] = useState<VerificationState>('verifying');
  const [email, setEmail] = useState('');
  // Guards the effect against double-invocation (React Strict Mode) — the
  // second call would consume an already-used token and fire a bogus error
  // toast right after the success one.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    setEmail(params.get('email') ?? '');

    // No token means the user landed here after signing up: show the
    // "check your inbox" screen. Not an error — no toast.
    if (!token) {
      setState('awaiting');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setState('success');
        toast.success('Email verified — you can now sign in.');
        setTimeout(() => router.push('/login'), 3000);
      })
      .catch((err) => {
        setState('error');
        toast.error(err instanceof ApiError ? err.message : 'Verification failed. The link may have expired.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthLayout title='Secure Account, Verification' description='We are confirming ownership of your email to
      protect your account and keep your travel
      information secure.'>
      <div className="auth-form-side text-center">
        <div className="w-full max-w-sm mx-auto">
          {state === 'verifying' && <Loader label="Verifying your email…" size="lg" />}

          {state === 'success' && (
            <div className="text-center">
              <div aria-hidden="true" className="w-14 h-14 rounded-full bg-green-soft text-green flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">Email verified</h1>
              <p className="text-ink-3 text-sm mb-6 leading-relaxed">
                Your account is now active. Redirecting you to sign in…
              </p>
              <button onClick={() => router.push('/login')} className="auth-btn">
                Continue to Sign in
              </button>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center">
              <div aria-hidden="true" className="w-14 h-14 rounded-full bg-red-soft text-red flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">Verification failed</h1>
              <p className="text-ink-3 text-sm mb-6 leading-relaxed">
                This verification link is invalid or has expired. Please request a new one
                or contact support if the problem persists.
              </p>
            </div>
          )}

          {state === 'awaiting' && (
            <>
              <div aria-hidden="true" className="w-14 h-14 rounded-full bg-brand-soft text-brand flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">Check your email</h1>
              <p className="text-ink-3 text-sm mb-6 leading-relaxed">
                We&apos;ve sent a verification link to{' '}
                {email ? <strong className="text-ink">{email}</strong> : 'your registered email address'}.
                Please verify your account before logging in.
              </p>

              <div className="mt-8 pt-6 border-t border-line flex items-center justify-center gap-5 text-[11px] text-ink-3">
                <span className="inline-flex items-center gap-1.5">
                  <IconLock className="w-3.5 h-3.5 text-ink-3" /> Secure encryption
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-green" /> NDPA compliant
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
