'use client';

import { useCallback, useEffect, useState } from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import { settingsApi, usersApi, ApiError } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuth } from '@/hooks/useAuth';
import { updateProfileSchema, changePasswordSchema } from '@/lib/validation/schemas';
import type { SettingsProfile } from '@/interface';
import { toast } from 'react-toastify';
import { PageHeader, Skeleton } from '@/components/ui';
import { TextField } from '@/components/form';
import { UserCog, User, Phone, AtSign, KeyRound, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

interface ProfileValues {
  name: string;
  phone: string;
  email: string;
}

interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirm: string;
}

const passwordInitial: PasswordValues = { currentPassword: '', newPassword: '', confirm: '' };

interface SettingsContainerProps {
  extraSections?: React.ReactNode;
}

export function SettingsContainer({ extraSections }: SettingsContainerProps) {
  const authUser = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { signOut } = useAuth();

  // The backend scopes /settings/me and /settings/profile to CLIENT/AGENT.
  // Admins read and update their own record through the admin users API
  // instead (GET/PATCH /admin/users/{id} with their own id).
  const isAdmin = authUser?.role === 'admin';
  const selfId = authUser?.id;

  const [profile, setProfile] = useState<SettingsProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAdmin && selfId) {
        const { user } = await usersApi.getUser(selfId);
        setProfile(user);
      } else {
        setProfile(await settingsApi.getMyProfile());
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, selfId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSaveProfile(values: ProfileValues) {
    const payload = { name: values.name.trim(), phone: values.phone.trim() };
    try {
      const updated =
        isAdmin && selfId
          ? (await usersApi.updateUser(selfId, payload)).user
          : await settingsApi.updateProfile(payload);
      setProfile(updated);
      updateUser({ name: updated.name });
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not update your profile. Please try again.');
    }
  }

  async function onChangePassword(values: PasswordValues, helpers: FormikHelpers<PasswordValues>) {
    try {
      await settingsApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      helpers.resetForm();
      // The backend invalidates every token issued before the change, so the
      // current session is now dead — sign out and send them to log in again.
      toast.success('Password changed. Please sign in again with your new password.');
      signOut();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not change your password. Please check your current password and try again.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow="Settings"
        eyebrowIcon={UserCog}
        title="Account settings"
        subtitle="Manage your profile details and password."
      />

      {error ? (
        <Card>
          <div className="p-8 text-center">
            <AlertTriangle aria-hidden="true" className="w-8 h-8 text-amber mx-auto mb-3" />
            <p className="text-sm text-ink-2">{error}</p>
            <button onClick={load} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline">
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        </Card>
      ) : (
        <>
          {/* Profile */}
          <Section
            icon={User}
            title="Profile"
            subtitle="Your name and phone number. Email can't be changed here."
          >
            {loading || !profile ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" rounded="rounded-xl" />
                <Skeleton className="h-12 w-full" rounded="rounded-xl" />
                <Skeleton className="h-12 w-full sm:col-span-2" rounded="rounded-xl" />
              </div>
            ) : (
              <Formik
                initialValues={{ name: profile.name, phone: profile.phone, email: profile.email }}
                validationSchema={updateProfileSchema}
                onSubmit={onSaveProfile}
              >
                {({ isSubmitting, dirty }) => (
                  <Form noValidate className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <TextField name="name" label="Full name" placeholder="Jane Doe" icon={User} autoComplete="name" />
                      <TextField name="phone" type="tel" label="Phone number" placeholder="+234 800 000 0000" icon={Phone} autoComplete="tel" />
                    </div>
                    <TextField name="email" type="email" label="Email address" icon={AtSign} disabled hint="Not editable" />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || !dirty}
                        className="inline-flex items-center justify-center gap-2 bg-brand text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Saving…' : 'Save changes'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </Section>

          {extraSections}

          {/* Change password */}
          <Section
            icon={KeyRound}
            title="Password"
            subtitle="Choose a strong new password. You'll be signed out and asked to sign in again."
          >
            <Formik initialValues={passwordInitial} validationSchema={changePasswordSchema} onSubmit={onChangePassword}>
              {({ isSubmitting }) => (
                <Form noValidate className="space-y-4">
                  <TextField
                    name="currentPassword"
                    type="password"
                    label="Current password"
                    placeholder="••••••••"
                    icon={KeyRound}
                    autoComplete="current-password"
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TextField
                      name="newPassword"
                      type="password"
                      label="New password"
                      placeholder="••••••••"
                      icon={KeyRound}
                      autoComplete="new-password"
                      hint="At least 8 characters"
                    />
                    <TextField
                      name="confirm"
                      type="password"
                      label="Confirm new password"
                      placeholder="••••••••"
                      icon={KeyRound}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-lg bg-blue-soft/70 border border-blue/10 text-ink-2">
                    <ShieldCheck aria-hidden="true" className="w-5 h-5 text-blue shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                      For your security, changing your password signs out every device and invalidates existing
                      sessions. You'll need to sign in again with the new password.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 bg-ink text-card px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-ink-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating…' : 'Change password'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </Section>
        </>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="bg-card rounded-2xl border border-line shadow-card overflow-hidden">{children}</section>;
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <Icon aria-hidden="true" className="w-[18px] h-[18px]" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            <p className="text-sm text-ink-3 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </Card>
  );
}
