'use client';

import { useState } from 'react';
import { Briefcase, ShieldPlus, CheckCircle2 } from 'lucide-react';
import { authApi, ApiError } from '@/api';
import { IconUser, IconMail, IconPhone, IconLock, IconEye, IconEyeOff } from '@/components/ui/icons';
import { toast } from 'react-toastify';

interface OnboardedEntry {
  id: string;
  kind: 'agent' | 'admin';
  name: string;
  email: string;
}

export function AdminOnboardingContainer() {
  const [recent, setRecent] = useState<OnboardedEntry[]>([]);

  // Onboard agent
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);

  // Create admin
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  async function onOnboardAgent(e: React.FormEvent) {
    e.preventDefault();
    setAgentLoading(true);
    try {
      const { agent } = await authApi.createAgent({
        name: agentName.trim(),
        email: agentEmail.trim(),
        phone: agentPhone.trim(),
      });
      toast.success(`${agent.name} has been onboarded — an invite is on the way.`);
      setRecent((r) => [{ id: agent.id, kind: 'agent', name: agent.name, email: agent.email }, ...r]);
      setAgentName('');
      setAgentEmail('');
      setAgentPhone('');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not onboard the agent. Please try again.');
    } finally {
      setAgentLoading(false);
    }
  }

  async function onCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (adminPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setAdminLoading(true);
    try {
      const { admin } = await authApi.createAdmin({
        name: adminName.trim(),
        email: adminEmail.trim(),
        phone: adminPhone.trim(),
        password: adminPassword,
      });
      toast.success(`${admin.name} now has administrator access.`);
      setRecent((r) => [{ id: admin.id, kind: 'admin', name: admin.name, email: admin.email }, ...r]);
      setAdminName('');
      setAdminEmail('');
      setAdminPhone('');
      setAdminPassword('');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create the admin. Please try again.');
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">Team onboarding</h1>
        <p className="text-ink-3 text-sm mt-1">Invite agents to the agency workspace and grant administrator access.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboard agent */}
        <section className="bg-white rounded-2xl border border-line p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-10 h-10 rounded-xl bg-blue-soft text-blue flex items-center justify-center">
              <Briefcase className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-ink">Onboard an agent</h2>
              <p className="text-xs text-ink-3">They&apos;ll receive an email invite to set a password.</p>
            </div>
          </div>

          <form onSubmit={onOnboardAgent} className="space-y-4 mt-5">
            <Field id="agent-name" label="Full name" icon={IconUser}>
              <input id="agent-name" type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="Chidi Eze" required className="auth-field" />
            </Field>
            <Field id="agent-email" label="Email address" icon={IconMail}>
              <input id="agent-email" type="email" value={agentEmail} onChange={(e) => setAgentEmail(e.target.value)} placeholder="agent@funlane.com" required className="auth-field" />
            </Field>
            <Field id="agent-phone" label="Phone number" icon={IconPhone}>
              <input id="agent-phone" type="tel" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} placeholder="+234 800 000 0000" required className="auth-field" />
            </Field>
            <button type="submit" disabled={agentLoading} className="auth-btn">
              {agentLoading ? 'Sending invite…' : 'Onboard agent'}
            </button>
          </form>
        </section>

        {/* Create admin */}
        <section className="bg-white rounded-2xl border border-line p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-10 h-10 rounded-xl bg-surface text-ink flex items-center justify-center border border-line">
              <ShieldPlus className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-ink">Create an admin</h2>
              <p className="text-xs text-ink-3">Grants full administrative access immediately.</p>
            </div>
          </div>

          <form onSubmit={onCreateAdmin} className="space-y-4 mt-5">
            <Field id="new-admin-name" label="Full name" icon={IconUser}>
              <input id="new-admin-name" type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Ada Obi" required className="auth-field" />
            </Field>
            <Field id="new-admin-email" label="Email address" icon={IconMail}>
              <input id="new-admin-email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin2@funlane.com" required className="auth-field" />
            </Field>
            <Field id="new-admin-phone" label="Phone number" icon={IconPhone}>
              <input id="new-admin-phone" type="tel" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} placeholder="+234 800 000 0000" required className="auth-field" />
            </Field>
            <Field id="new-admin-password" label="Temporary password" icon={IconLock}>
              <input
                id="new-admin-password"
                type={showPw ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
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
            </Field>
            <button type="submit" disabled={adminLoading} className="auth-btn">
              {adminLoading ? 'Creating…' : 'Create admin'}
            </button>
          </form>
        </section>
      </div>

      {recent.length > 0 && (
        <section className="bg-white rounded-2xl border border-line p-6 shadow-sm">
          <h2 className="font-semibold text-ink mb-4">Added this session</h2>
          <ul className="divide-y divide-line">
            {recent.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <CheckCircle2 className="w-5 h-5 text-green shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{entry.name}</div>
                  <div className="text-xs text-ink-3 truncate">{entry.email}</div>
                </div>
                <span className={`ml-auto text-[11px] font-semibold px-2 py-1 rounded-md ${entry.kind === 'admin' ? 'bg-surface text-ink border border-line' : 'bg-blue-soft text-blue'}`}>
                  {entry.kind === 'admin' ? 'Admin' : 'Agent'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: typeof IconUser;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
        {children}
      </div>
    </div>
  );
}
