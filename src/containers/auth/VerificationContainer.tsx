'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconLock } from '@/components/ui';
import { Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { verifyEmail } from '@/api/auth.api';
import { AuthLayout } from '@/components/layout/AuthLayout';

type VerificationState =
  | 'verifying'
  | 'success'
  | 'error';


export function VerificationContainer() {
  const router = useRouter();
  const [state, setState] =
    useState<VerificationState>('verifying');
  const [email, setEmail] = useState('');

  // The verification email may link here as `/verify?token=…&email=…`.
  // If a token is present we confirm it automatically; otherwise the user
  // types the code they received.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setState('error');
      toast.error('error');
      return;
    }

    verifyEmail(token)
      .then(() => {
        setState('success');
        toast.success('success');

        setTimeout(() => {
          router.push('/login');
        }, 5000);
      })
      .catch(() => {
        setState('error');
        toast.error('error');
      });
  }, []);


  return (
    <AuthLayout title='Secure Account, Verification' description='We are confirming ownership of your email to
      protect your account and keep your travel
      information secure.'>
      {/* Form panel */}
      <div className="auth-form-side text-center">
        <div className="w-full max-w-sm mx-auto">
          {state === 'success' ? (
            <div className="text-center">
              <div aria-hidden="true" className="w-14 h-14 rounded-full bg-green-soft text-green flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-ink mb-2">Email verified</h1>
              <p className="text-ink-3 text-sm mb-6 leading-relaxed">
                Your account is now active. You can sign in and start managing your travel.
              </p>
              <button onClick={() => router.push('/login')} className="auth-btn">
                Continue to Sign in
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-ink mb-2 text-left">Verify your account</h1>
              <p className="text-ink-3 text-sm mb-6 leading-relaxed text-left">
                We&apos;ve sent a verification link to{' '}
                {email ? <strong className="text-ink">{email}</strong> : 'your registered email address'}.
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
    </AuthLayout >
  );
}
