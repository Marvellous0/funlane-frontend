'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUsers';
import { fmtDateTime } from '@/utils/format';
import { Button, ConfirmDialog, Loader } from '@/components/ui';
import type { BackendRole } from '@/interface';
import {
  ArrowLeft, AlertTriangle, RefreshCw, Pencil, Check, X, Mail, Phone, User as UserIcon,
  CalendarDays, BadgeCheck, Ban, RotateCcw, Trash2,
} from 'lucide-react';

const ROLE_AVATAR: Record<BackendRole, string> = {
  ADMIN: 'bg-ink text-white',
  AGENT: 'bg-blue text-white',
  CLIENT: 'bg-green text-white',
};

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';

export function AdminUserDetailContainer({ id }: { id: string }) {
  const router = useRouter();
  const { user, loading, error, refresh, updateProfile, suspend, reactivate, changeRole, remove } = useUser(id);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const [confirm, setConfirm] = useState<null | 'delete' | 'suspend'>(null);
  const [busy, setBusy] = useState(false);

  // Seed the edit fields whenever the loaded user changes.
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  async function onSave() {
    setSaving(true);
    const ok = await updateProfile({ name: name.trim(), phone: phone.trim() });
    setSaving(false);
    if (ok) setEditing(false);
  }

  function onCancelEdit() {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
    setEditing(false);
  }

  async function onConfirm() {
    setBusy(true);
    if (confirm === 'delete') {
      const ok = await remove();
      setBusy(false);
      if (ok) router.push('/admin/users');
      return;
    }
    if (confirm === 'suspend') {
      await suspend();
    }
    setBusy(false);
    setConfirm(null);
  }

  if (loading) return (<div className="flex justify-center items-center"> <Loader label="Loading user…" size="lg" /> </div>);

  if (error || !user) {
    return (
      <div className="bg-white rounded-2xl border border-line shadow-card p-10 text-center max-w-md mx-auto">
        <AlertTriangle aria-hidden="true" className="w-8 h-8 text-amber mx-auto mb-3" />
        <p className="text-sm text-ink-2">{error ?? 'User not found.'}</p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <Button variant="outline" color="ink" leftIcon={ArrowLeft} onClick={() => router.push('/admin/users')}>
            Back to users
          </Button>
          <Button variant="ghost" color="ink" leftIcon={RefreshCw} onClick={refresh}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const isActive = user.status === 'ACTIVE';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-ink transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to users
      </Link>

      {/* Compact identity banner */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-ink to-brand-dark text-white p-5 sm:p-6 shadow-card">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(130%_140%_at_90%_-20%,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold ring-2 ring-white/15 ${ROLE_AVATAR[user.role]}`}>
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{user.name}</h1>
              <p className="text-white/60 text-sm truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
              {user.role}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${isActive ? 'bg-green-soft text-green-dark' : 'bg-red-soft text-red-dark'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green' : 'bg-red'}`} />
              {user.status}
            </span>
          </div>
        </div>
      </header>

      {/* Profile card */}
      <section className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-line">
          <h2 className="font-semibold text-ink">Profile details</h2>
          {!editing ? (
            <Button size="sm" variant="outline" color="ink" leftIcon={Pencil} onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" color="red" leftIcon={X} onClick={onCancelEdit} disabled={saving}>
                Cancel
              </Button>
              <Button size="sm" color="green" leftIcon={Check} loading={saving} onClick={onSave}>
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
            <Detail label="Full name" icon={UserIcon}>
              {editing ? (
                <input value={name} onChange={(e) => setName(e.target.value)} className="auth-field !pl-4" placeholder="Full name" />
              ) : (
                user.name
              )}
            </Detail>

            <Detail label="Phone number" icon={Phone}>
              {editing ? (
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="auth-field !pl-4" placeholder="+234 800 000 0000" />
              ) : (
                user.phone || '—'
              )}
            </Detail>

            <Detail label="Email address" icon={Mail}>
              <span className="inline-flex items-center gap-2">
                {user.email}
                {user.emailVerifiedAt ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-dark">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-dark">Unverified</span>
                )}
              </span>
            </Detail>

            <Detail label="Joined" icon={CalendarDays}>
              {fmtDateTime(user.createdAt)}
            </Detail>
          </div>
        </div>
      </section>

      {/* Management card */}
      <section className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-line">
          <h2 className="font-semibold text-ink">Account management</h2>
        </div>

        <div className="divide-y divide-line">
          {/* Role */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4">
            <div>
              <div className="text-sm font-medium text-ink">Role</div>
              <p className="text-xs text-ink-3 mt-0.5">Controls what this user can access across the platform.</p>
            </div>
            <select
              value={user.role}
              onChange={(e) => changeRole(e.target.value as BackendRole)}
              className="h-10 px-3 bg-surface border border-line rounded-lg text-sm font-semibold text-ink self-start sm:self-auto"
              aria-label="Change role"
            >
              <option value="CLIENT">CLIENT</option>
              <option value="AGENT">AGENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4">
            <div>
              <div className="text-sm font-medium text-ink">{isActive ? 'Suspend access' : 'Reactivate access'}</div>
              <p className="text-xs text-ink-3 mt-0.5">
                {isActive ? 'Block this user from signing in until reactivated.' : 'Restore this user’s access to the platform.'}
              </p>
            </div>
            {isActive ? (
              <Button variant="outline" color="amber" leftIcon={Ban} onClick={() => setConfirm('suspend')} className="self-start sm:self-auto">
                Suspend
              </Button>
            ) : (
              <Button variant="outline" color="green" leftIcon={RotateCcw} onClick={reactivate} className="self-start sm:self-auto">
                Reactivate
              </Button>
            )}
          </div>

          {/* Delete */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-red-soft/40">
            <div>
              <div className="text-sm font-medium text-red-dark">Delete account</div>
              <p className="text-xs text-ink-3 mt-0.5">Permanently remove this user and all their data. This cannot be undone.</p>
            </div>
            <Button color="red" leftIcon={Trash2} onClick={() => setConfirm('delete')} className="self-start sm:self-auto">
              Delete user
            </Button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm === 'delete' ? 'Delete user' : 'Suspend user'}
        confirmLabel={confirm === 'delete' ? 'Yes, delete' : 'Yes, suspend'}
        loading={busy}
        message={
          confirm === 'delete' ? (
            <>
              Permanently delete <strong className="text-ink">{user.name}</strong>? This action cannot be undone and all
              of their data will be removed.
            </>
          ) : (
            <>
              Suspend <strong className="text-ink">{user.name}</strong>? They will be signed out and blocked from
              accessing the platform until reactivated.
            </>
          )
        }
        onConfirm={onConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function Detail({ label, icon: Icon, children }: { label: string; icon: typeof UserIcon; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold text-ink-3 mb-1.5">
        <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {label}
      </div>
      <div className="text-sm text-ink font-medium">{children}</div>
    </div>
  );
}
