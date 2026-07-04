'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/api';
import { IconArrowLeft, IconArrowRight } from '@/components/ui';
import { Check, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { toast } from 'react-toastify';
import { TextField } from '@/components/form';
import { resetPasswordSchema } from '@/lib/validation/schemas';

interface ResetValues {
  password: string;
  confirm: string;
}

function strengthOf(password: string): { label: string; color: string; width: string } {
  if (password.length < 4) return { label: 'Too short', color: 'bg-red', width: 'w-1/4' };
  if (password.length < 8) return { label: 'Weak', color: 'bg-amber', width: 'w-2/4' };
  if (/(?=.*[A-Z])(?=.*\d)/.test(password)) return { label: 'Strong', color: 'bg-green', width: 'w-full' };
  return { label: 'Medium', color: 'bg-amber', width: 'w-3/4' };
}

export function ResetPasswordContainer() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [done, setDone] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token'));
  }, []);

  async function onSubmit(values: ResetValues) {
    if (!token) {
      setTokenError('This reset link is invalid or incomplete. Please request a new one.');
      return;
    }
    setTokenError('');
    try {
      const response = await resetPassword(token, values.password);

      toast.success(response.message);

      const loginRoute =
        response.role === 'ADMIN'
          ? '/admin/login'
          : response.role === 'AGENT'
            ? '/agent/login'
            : '/login';

      router.push(loginRoute);
      setDone(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not reset your password. Please try again.');
    }
  }

  return (
    <AuthLayout title='New Security, New Strength.' description='The gold standard in corporate travel and logistics. Your precision-engineered portal ensures every movement is managed with absolute transparency.'>
      {/* Form panel */}
      <div>
        {done ? (
          <div className="text-center">
            <div aria-hidden="true" className="w-14 h-14 rounded-full bg-green-soft text-green flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2">Password reset</h1>
            <p className="text-ink-3 text-sm mb-6 leading-relaxed">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <button onClick={() => router.push('/login')} className="auth-btn">
              Go to sign in
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-ink mb-2">Reset password</h1>
            <p className="text-ink-3 text-sm mb-6 leading-relaxed">Choose a strong new password for your account.</p>

            <Formik initialValues={{ password: '', confirm: '' }} validationSchema={resetPasswordSchema} onSubmit={onSubmit}>
              {({ values, isSubmitting }) => {
                const s = strengthOf(values.password);
                return (
                  <Form noValidate className="space-y-4">
                    <div>
                      <TextField
                        name="password"
                        type="password"
                        label="New password"
                        placeholder="Enter new password"
                        icon={Lock}
                        autoComplete="new-password"
                        id="new-password"
                      />
                      {values.password && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-line rounded-full overflow-hidden">
                            <div className={`h-full ${s.color} ${s.width} rounded-full transition-all duration-300`} />
                          </div>
                          <div className="text-xs text-ink-3 mt-1">{s.label}</div>
                        </div>
                      )}
                    </div>

                    <TextField
                      name="confirm"
                      type="password"
                      label="Confirm password"
                      placeholder="Confirm new password"
                      icon={Lock}
                      autoComplete="new-password"
                      id="confirm-password"
                    />

                    {tokenError && (
                      <div className="bg-red-soft text-red-dark rounded-lg px-4 py-3 text-sm font-medium animate-slide-up">{tokenError}</div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="auth-btn">
                      {isSubmitting ? 'Resetting…' : 'Reset password'}
                      {!isSubmitting && <IconArrowRight className="w-4 h-4" />}
                    </button>
                  </Form>
                );
              }}
            </Formik>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-3 hover:text-ink font-medium transition-colors"
            >
              <IconArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
