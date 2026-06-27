'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useHydration } from '@/hooks/useHydration';
import { homePathFor } from '@/services/auth.service';
import { StaffAuthLayout } from '@/components/layout/StaffAuthLayout';
import { IconUser, IconMail, IconPhone, IconLock, IconEye, IconEyeOff, IconShield } from '@/components/ui/icons';
import { validateSchema, type FieldErrors } from '@/lib/validation/validate';
import { adminRegisterSchema } from '@/lib/validation/schemas';

const errorClass = 'mt-1.5 text-xs text-red-dark';
type AdminRegisterFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
};

export function AdminRegisterContainer() {
  const { registerAdmin, loading } = useAuth();
  const user = useAuthStore((s) => s.user);
  const hydrated = useHydration();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<AdminRegisterFields>>({});

  useEffect(() => {
    if (hydrated && user) router.replace(homePathFor(user.role));
  }, [hydrated, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { errors: invalid } = await validateSchema(adminRegisterSchema, {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirm,
    });
    if (invalid) {
      setErrors(invalid);
      return;
    }
    setErrors({});
    await registerAdmin({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      password,
    });
  }

  return (
    <StaffAuthLayout
      badge="Admin Console"
      badgeIcon={ShieldCheck}
      title="Create admin account"
      subtitle="Set up the first administrator for your organization. This is a one-time bootstrap — afterwards, admins are added from inside the console."
      altHref="/admin/login"
      altLabel="Admin sign in"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-first" className="block text-sm font-medium text-ink mb-1.5">First name</label>
            <div className="relative">
              <IconUser className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="admin-first" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ada" className="auth-field" />
            </div>
            {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="admin-last" className="block text-sm font-medium text-ink mb-1.5">Last name</label>
            <div className="relative">
              <IconUser className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input id="admin-last" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Obi" className="auth-field" />
            </div>
            {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-ink mb-1.5">Email address</label>
          <div className="relative">
            <IconMail className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input id="admin-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@funlane.com" className="auth-field" />
          </div>
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="admin-phone" className="block text-sm font-medium text-ink mb-1.5">Phone number</label>
          <div className="relative">
            <IconPhone className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input id="admin-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" className="auth-field" />
          </div>
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-ink mb-1.5">Password</label>
          <div className="relative">
            <IconLock className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="admin-password"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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
          {errors.password && <p className={errorClass}>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="admin-confirm" className="block text-sm font-medium text-ink mb-1.5">Confirm password</label>
          <div className="relative">
            <IconLock className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input id="admin-confirm" type={showPw ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" aria-invalid={Boolean(errors.confirm)} className="auth-field" />
          </div>
          {errors.confirm && <p className={errorClass}>{errors.confirm}</p>}
        </div>

        <div className="auth-banner">
          <IconShield className="w-5 h-5 text-blue shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <span className="font-semibold text-ink">One-time setup.</span> Bootstrap is only
            available until the first admin exists. Keep these credentials secure.
          </p>
        </div>

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? 'Creating account…' : 'Create admin account'}
        </button>
      </form>
    </StaffAuthLayout>
  );
}
