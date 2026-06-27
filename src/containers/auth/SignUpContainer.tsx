'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePasswordStrength } from '@/hooks/usePasswordStrength';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/api';
import { FunlaneLogo } from '@/components/ui/Logo';
import { IconUser, IconMail, IconPhone, IconLock, IconEye, IconEyeOff, IconArrowRight } from '@/components/ui/icons';
import { Shield, MapPin, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { validateSchema, type FieldErrors } from '@/lib/validation/validate';
import { signupSchema } from '@/lib/validation/schemas';

const labelClass = 'block text-sm font-medium text-ink mb-1.5';
const errorClass = 'mt-1.5 text-xs text-red-dark';

type SignUpFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  ndpaConsent: boolean;
};


const HERO_FEATURES = [
  { icon: Shield, title: 'NDPA Compliant', desc: 'Encrypted, enterprise-grade security.' },
  { icon: MapPin, title: 'Real-time Tracking', desc: 'Follow every request end to end.' },
];

export function SignUpContainer() {
  const router = useRouter();
  const { register } = useAuth();
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [confirm, setConfirm] = useState('');
  const [ndpaConsent, setNdpaConsent] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<FieldErrors<SignUpFields>>({});

  const strength = usePasswordStrength(formData.password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { errors: invalid } = await validateSchema(signupSchema, {
      ...formData,
      confirm,
      ndpaConsent,
    });
    if (invalid) {
      setErrors(invalid);
      return;
    }
    if (strength.score < 2) {
      setErrors({ password: 'Password does not meet complexity requirements (8+ mixed characters).' });
      return;
    }
    setErrors({});
    setLoading(true);
    setError('');

    // Compliance log captured client-side; not part of the backend contract.
    console.log('Compliance Log Captured:', {
      timestamp: new Date().toISOString(),
      ndpaAccepted: true,
    });

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await register({
        name,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      toast.success(
        response.message ||
        'Registration successful. Check your email to verify your account.'
      );
      // Registration succeeded; a verification email is on its way.
      // setTimeout(() => {
      //   router.push(
      //     `/verify?email=${encodeURIComponent(formData.email.trim())}`
      //   );
      // }, 3000); // 3 seconds
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create your account. Please try again.')
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignUp() {
    // The backend doesn't expose an OAuth endpoint yet — be honest rather than fake it.
    setOauthNotice('Google sign-up is coming soon — please register with your email.');
  }

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <AuthLayout title="Global Logistics, Simplified."
      description="Join an exclusive network of travelers and corporations moving the world with confidence.">
      <h1 className="text-2xl font-bold text-ink mb-1.5">Create an account</h1>
      <p className="text-ink-3 text-sm mb-6">Join Funlane Travels &amp; Logistics.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>First name</label>
            <div className="relative">
              <IconUser className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="firstName" type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="John" className="auth-field" />
            </div>
            {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last name</label>
            <div className="relative">
              <IconUser className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="lastName" type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Doe" className="auth-field" />
            </div>
            {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>Email address</label>
            <div className="relative">
              <IconMail className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="name@company.com" className="auth-field" />
            </div>
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone number</label>
            <div className="relative">
              <IconPhone className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 (555) 000-0000" className="auth-field" />
            </div>
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>
        </div>


        <div>
          <label htmlFor="signup-password" className={labelClass}>Password</label>
          <div className="relative">
            <IconLock className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="signup-password"
              type={showPw ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
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
          {formData.password && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <StrengthChip active={strength.met.length} label="8+ characters" />
              <StrengthChip active={strength.met.mixed && strength.met.special} label="Mixed case / symbols" />
            </div>
          )}
          {errors.password && <p className={errorClass}>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirm-password" className={labelClass}>Confirm password</label>
          <div className="relative">
            <IconLock className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="confirm-password"
              type={showPw ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.confirm)}
              className="auth-field"
            />
          </div>
          {errors.confirm && <p className={errorClass}>{errors.confirm}</p>}
        </div>

        <div className="bg-surface rounded-lg p-3.5 space-y-3 border border-line">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="ndpa"
              checked={ndpaConsent}
              onChange={(e) => setNdpaConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-line text-sky-500 focus:ring-sky-400"
            />
            <label htmlFor="ndpa" className="text-xs text-ink-2 leading-relaxed select-none">
              I agree to the <span className="text-ink font-semibold underline">Terms of Service</span> and{' '}
              <span className="text-ink font-semibold underline">Privacy Policy</span>, and consent to
              NDPA-compliant data processing.
            </label>
          </div>
          {errors.ndpaConsent && <p className={errorClass}>{errors.ndpaConsent}</p>}
        </div>

        {error && (
          <div className="bg-red-soft text-red-dark rounded-lg px-4 py-3 text-sm font-medium animate-slide-up flex items-center gap-2">
            <AlertTriangle aria-hidden="true" className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? 'Creating account…' : 'Create account'}
          {!loading && <IconArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-5">
        <div className="w-full h-px bg-line" />
        <span className="absolute bg-white px-3 text-xs text-ink-3">or continue with</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full h-12 flex items-center justify-center gap-3 border border-line rounded-lg bg-white hover:bg-surface transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="text-sm font-medium text-ink">Sign up with Google</span>
      </button>

      {oauthNotice && (
        <p className="mt-3 text-center text-xs text-ink-3">{oauthNotice}</p>
      )}

      <p className="mt-6 text-center text-sm text-ink-3">
        Already have an account?{' '}
        <Link href="/login" className="text-ink font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

function StrengthChip({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`text-[11px] font-medium px-2 py-1 rounded-md border ${active ? 'bg-green-soft text-green-dark border-green/20' : 'bg-surface text-ink-3 border-line'
        }`}
    >
      {label}
    </span>
  );
}
