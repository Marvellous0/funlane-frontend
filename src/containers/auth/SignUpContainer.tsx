'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, useFormikContext, type FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/api';
import { IconArrowRight } from '@/components/ui/icons';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { TextField, CheckboxField } from '@/components/form';
import { signupSchema } from '@/lib/validation/schemas';

type SignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  ndpaConsent: boolean;
};

const initialValues: SignUpValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
  ndpaConsent: false,
};

/** Same rules as usePasswordStrength, as a pure function so it can run anywhere. */
function passwordChecks(password: string) {
  const met = {
    length: password.length >= 8,
    mixed: /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = (met.length ? 1 : 0) + (met.mixed ? 2 : 0) + (met.special ? 1 : 0);
  return { met, score };
}

export function SignUpContainer() {
  const { register } = useAuth();
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  async function onSubmit(values: SignUpValues, helpers: FormikHelpers<SignUpValues>) {
    if (passwordChecks(values.password).score < 2) {
      helpers.setFieldError('password', 'Password does not meet complexity requirements (8+ mixed characters).');
      return;
    }

    // Compliance log captured client-side; not part of the backend contract.
    console.log('Compliance Log Captured:', {
      timestamp: new Date().toISOString(),
      ndpaAccepted: true,
    });

    try {
      const name = `${values.firstName} ${values.lastName}`.trim();
      const response = await register({
        name,
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      });

      toast.success(
        response.message ||
        'Registration successful. Check your email to verify your account.'
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create your account. Please try again.')
    }
  }

  function handleGoogleSignUp() {
    // The backend doesn't expose an OAuth endpoint yet — be honest rather than fake it.
    setOauthNotice('Google sign-up is coming soon — please register with your email.');
  }

  return (
    <AuthLayout title="Global Logistics, Simplified."
      description="Join an exclusive network of travelers and corporations moving the world with confidence.">
      <h1 className="text-2xl font-bold text-ink mb-1.5">Create an account</h1>
      <p className="text-ink-3 text-sm mb-6">Join Funlane Travels &amp; Logistics.</p>

      <Formik initialValues={initialValues} validationSchema={signupSchema} onSubmit={onSubmit}>
        <SignUpFormFields />
      </Formik>

      <div className="relative flex items-center justify-center my-5">
        <div className="w-full h-px bg-line" />
        <span className="absolute bg-card px-3 text-xs text-ink-3">or continue with</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full h-12 flex items-center justify-center gap-3 border border-line rounded-lg bg-card hover:bg-surface transition-colors"
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

/** Rendered inside <Formik> so it can read live values for the strength chips. */
function SignUpFormFields() {
  const { values, isSubmitting } = useFormikContext<SignUpValues>();
  const { met } = passwordChecks(values.password);

  return (
    <Form noValidate className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField name="firstName" label="First name" placeholder="John" icon={User} autoComplete="given-name" />
        <TextField name="lastName" label="Last name" placeholder="Doe" icon={User} autoComplete="family-name" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField name="email" type="email" label="Email address" placeholder="name@company.com" icon={Mail} autoComplete="email" />
        <TextField name="phone" type="tel" label="Phone number" placeholder="+1 (555) 000-0000" icon={Phone} autoComplete="tel" />
      </div>

      <div>
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          icon={Lock}
          autoComplete="new-password"
          id="signup-password"
        />
        {values.password && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <StrengthChip active={met.length} label="8+ characters" />
            <StrengthChip active={met.mixed && met.special} label="Mixed case / symbols" />
          </div>
        )}
      </div>

      <TextField
        name="confirm"
        type="password"
        label="Confirm password"
        placeholder="••••••••"
        icon={Lock}
        autoComplete="new-password"
        id="confirm-password"
      />

      <CheckboxField name="ndpaConsent" className="bg-surface rounded-lg p-3.5 border border-line">
        <span className="text-xs text-ink-2 leading-relaxed">
          I agree to the <span className="text-ink font-semibold underline">Terms of Service</span> and{' '}
          <span className="text-ink font-semibold underline">Privacy Policy</span>, and consent to
          NDPA-compliant data processing.
        </span>
      </CheckboxField>

      <button type="submit" disabled={isSubmitting} className="auth-btn">
        {isSubmitting ? 'Creating account…' : 'Create account'}
        {!isSubmitting && <IconArrowRight className="w-4 h-4" />}
      </button>
    </Form>
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
