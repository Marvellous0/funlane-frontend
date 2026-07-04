'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/api';
import { IconArrowLeft, IconArrowRight, IconShield } from '@/components/ui';
import { Mail, MailCheck } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { toast } from 'react-toastify';
import { TextField } from '@/components/form';
import { forgotPasswordSchema } from '@/lib/validation/schemas';

export function ForgotPasswordContainer() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(values: { email: string }) {
    try {
      // The backend always returns a generic confirmation (no account enumeration).
      const response = await forgotPassword(values.email.trim());
      setTimeout(() => {
        toast.success(response.message);
      }, 1000);
      setSentTo(values.email.trim());
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not send the reset link. Please try again.');
    }
  }

  return (
    <AuthLayout title='Secure Access,
              Recovered.' description='The gold standard in corporate travel and logistics. Your precision-engineered portal ensures every
              movement is managed with absolute transparency.'>

      <div>
        {sentTo ? (
          <div className="text-center">
            <div aria-hidden="true" className="w-14 h-14 rounded-full bg-green-soft text-green flex items-center justify-center mx-auto mb-4">
              <MailCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2">Check your email</h1>
            <p className="text-ink-3 text-sm mb-6 leading-relaxed">
              If an account exists for <strong className="text-ink">{sentTo}</strong>, we&apos;ve sent a reset link.
              Open it to choose a new password.
            </p>
            <button onClick={() => router.push('/login')} className="auth-btn mb-3">
              Back to login
            </button>
            <button onClick={() => setSentTo(null)} className="text-sm text-ink-3 hover:text-ink font-medium transition-colors">
              Didn&apos;t receive it? Try again
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-ink mb-2">Forgot password?</h1>
            <p className="text-ink-3 text-sm mb-6 leading-relaxed">
              No worries — we&apos;ll send you reset instructions. Enter the email associated with your Funlane
              account.
            </p>

            <Formik initialValues={{ email: '' }} validationSchema={forgotPasswordSchema} onSubmit={onSubmit}>
              {({ isSubmitting }) => (
                <Form noValidate className="space-y-4">
                  <TextField
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="e.g. alex@logistics.com"
                    icon={Mail}
                    autoComplete="email"
                    id="forgot-email"
                  />

                  <div className="auth-banner">
                    <IconShield className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                      <span className="font-semibold text-ink">NDPA-compliant process.</span> For security, we never
                      store your original password. The reset link expires in 1 hour.
                    </p>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="auth-btn">
                    {isSubmitting ? 'Sending…' : 'Send reset link'}
                    {!isSubmitting && <IconArrowRight className="w-4 h-4" />}
                  </button>
                </Form>
              )}
            </Formik>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-3 hover:text-ink font-medium transition-colors"
            >
              <IconArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </>
        )}

        <p className="mt-8 text-center text-xs text-ink-3">
          Having trouble? <span className="text-ink font-medium underline">Contact support</span>
        </p>
      </div>
    </AuthLayout>
  );
}
