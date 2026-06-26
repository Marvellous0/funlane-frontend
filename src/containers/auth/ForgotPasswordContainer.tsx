'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/api';
import { IconMail, IconArrowLeft, IconArrowRight, IconShield } from '@/components/ui';
import { AlertTriangle, MailCheck } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { toast } from 'react-toastify';

export function ForgotPasswordContainer() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // The backend always returns a generic confirmation (no account enumeration).
      const response = await forgotPassword(email.trim());
      setTimeout(() => {
        toast.success(response.message);
      }, 1000);
      setSent(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not send the reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title='Secure Access,
              Recovered.' description='The gold standard in corporate travel and logistics. Your precision-engineered portal ensures every
              movement is managed with absolute transparency.'>

      <div>
        {sent ? (
          <div className="text-center">
            <div aria-hidden="true" className="w-14 h-14 rounded-full bg-green-soft text-green flex items-center justify-center mx-auto mb-4">
              <MailCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2">Check your email</h1>
            <p className="text-ink-3 text-sm mb-6 leading-relaxed">
              If an account exists for <strong className="text-ink">{email}</strong>, we&apos;ve sent a reset link.
              Open it to choose a new password.
            </p>
            <button onClick={() => router.push('/login')} className="auth-btn mb-3">
              Back to login
            </button>
            <button onClick={() => setSent(false)} className="text-sm text-ink-3 hover:text-ink font-medium transition-colors">
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

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-ink mb-1.5">Email address</label>
                <div className="relative">
                  <IconMail className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@logistics.com"
                    required
                    className="auth-field"
                  />
                </div>
              </div>

              <div className="auth-banner">
                <IconShield className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  <span className="font-semibold text-ink">NDPA-compliant process.</span> For security, we never
                  store your original password. The reset link expires in 1 hour.
                </p>
              </div>

              {error && (
                <div className="bg-red-soft text-red-dark rounded-lg px-4 py-3 text-sm font-medium animate-slide-up flex items-center gap-2">
                  <AlertTriangle aria-hidden="true" className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="auth-btn">
                {loading ? 'Sending…' : 'Send reset link'}
                {!loading && <IconArrowRight className="w-4 h-4" />}
              </button>
            </form>

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
