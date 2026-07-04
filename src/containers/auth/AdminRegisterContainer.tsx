'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, Phone, User } from 'lucide-react';
import { Formik, Form } from 'formik';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useHydration } from '@/hooks/useHydration';
import { homePathFor } from '@/services/auth.service';
import { StaffAuthLayout } from '@/components/layout/StaffAuthLayout';
import { IconShield } from '@/components/ui/icons';
import { TextField } from '@/components/form';
import { adminRegisterSchema } from '@/lib/validation/schemas';

interface AdminRegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

const initialValues: AdminRegisterValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
};

export function AdminRegisterContainer() {
  const { registerAdmin, loading } = useAuth();
  const user = useAuthStore((s) => s.user);
  const hydrated = useHydration();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && user) router.replace(homePathFor(user.role));
  }, [hydrated, user, router]);

  async function onSubmit(values: AdminRegisterValues) {
    await registerAdmin({
      name: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email,
      phone: values.phone,
      password: values.password,
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
      <Formik initialValues={initialValues} validationSchema={adminRegisterSchema} onSubmit={onSubmit}>
        <Form noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField name="firstName" label="First name" placeholder="Ada" icon={User} autoComplete="given-name" id="admin-first" />
            <TextField name="lastName" label="Last name" placeholder="Obi" icon={User} autoComplete="family-name" id="admin-last" />
          </div>

          <TextField name="email" type="email" label="Email address" placeholder="admin@funlane.com" icon={Mail} autoComplete="email" id="admin-email" />
          <TextField name="phone" type="tel" label="Phone number" placeholder="+234 800 000 0000" icon={Phone} autoComplete="tel" id="admin-phone" />
          <TextField name="password" type="password" label="Password" placeholder="At least 8 characters" icon={Lock} autoComplete="new-password" id="admin-password" />
          <TextField name="confirm" type="password" label="Confirm password" placeholder="••••••••" icon={Lock} autoComplete="new-password" id="admin-confirm" />

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
        </Form>
      </Formik>
    </StaffAuthLayout>
  );
}
