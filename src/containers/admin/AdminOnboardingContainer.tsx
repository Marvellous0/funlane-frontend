'use client';

import { useState } from 'react';
import { Briefcase, ShieldPlus, Check, Sparkles, Mail, UsersRound } from 'lucide-react';
import { authApi, ApiError } from '@/api';
import { IconUser, IconMail, IconPhone, IconLock, IconEye, IconEyeOff } from '@/components/ui/icons';
import { Spinner, PageHeader } from '@/components/ui';
import { toast } from 'react-toastify';
import { validateSchema, type FieldErrors } from '@/lib/validation/validate';
import { onboardAgentSchema, createAdminSchema } from '@/lib/validation/schemas';

type AgentFields = { name: string; email: string; phone: string };
type AdminFields = { name: string; email: string; phone: string; password: string };

interface OnboardedEntry {
  id: string;
  kind: 'agent' | 'admin';
  name: string;
  email: string;
}

export function AdminOnboardingContainer() {
  const [recent, setRecent] = useState<OnboardedEntry[]>([]);
  const [mode, setMode] = useState<'agent' | 'admin'>('agent');

  // Onboard agent
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentErrors, setAgentErrors] = useState<FieldErrors<AgentFields>>({});

  // Create admin
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminErrors, setAdminErrors] = useState<FieldErrors<AdminFields>>({});

  async function onOnboardAgent(e: React.FormEvent) {
    e.preventDefault();
    const { errors: invalid } = await validateSchema(onboardAgentSchema, {
      name: agentName,
      email: agentEmail,
      phone: agentPhone,
    });
    if (invalid) {
      setAgentErrors(invalid);
      return;
    }
    setAgentErrors({});
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
    const { errors: invalid } = await validateSchema(createAdminSchema, {
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: adminPassword,
    });
    if (invalid) {
      setAdminErrors(invalid);
      return;
    }
    setAdminErrors({});
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

  const isAgent = mode === 'agent';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team onboarding"
        eyebrowIcon={ShieldPlus}
        title="Grow your team"
        subtitle="Invite agents to the agency workspace and grant administrator access."
        actions={
          <div className="text-right">
            <div className="text-3xl font-bold leading-none">{recent.length}</div>
            <div className="text-[11px] uppercase tracking-wide text-white/50 mt-1">Added this session</div>
          </div>
        }
      />

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Onboarding card */}
        <section className="lg:col-span-3 bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          {/* Role switcher */}
          <div className="p-5 sm:p-6 border-b border-line">
            <div className="inline-flex w-full sm:w-auto p-1 bg-surface border border-line rounded-xl">
              <RoleToggle active={isAgent} onClick={() => setMode('agent')} icon={Briefcase} label="Onboard agent" />
              <RoleToggle active={!isAgent} onClick={() => setMode('admin')} icon={ShieldPlus} label="Create admin" />
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            {/* Form pane */}
            <div className="p-5 sm:p-6">
              {isAgent ? (
                <form onSubmit={onOnboardAgent} className="space-y-4" key="agent">
                  <Field id="agent-name" label="Full name" icon={IconUser} error={agentErrors.name}>
                    <input id="agent-name" type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="Chidi Eze" className="auth-field" />
                  </Field>
                  <Field id="agent-email" label="Email address" icon={IconMail} error={agentErrors.email}>
                    <input id="agent-email" type="email" value={agentEmail} onChange={(e) => setAgentEmail(e.target.value)} placeholder="agent@funlane.com" className="auth-field" />
                  </Field>
                  <Field id="agent-phone" label="Phone number" icon={IconPhone} error={agentErrors.phone}>
                    <input id="agent-phone" type="tel" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} placeholder="+234 800 000 0000" className="auth-field" />
                  </Field>
                  <button type="submit" disabled={agentLoading} className="auth-btn">
                    {agentLoading && <Spinner size="sm" />}
                    {agentLoading ? 'Sending invite…' : 'Onboard agent'}
                  </button>
                </form>
              ) : (
                <form onSubmit={onCreateAdmin} className="space-y-4" key="admin">
                  <Field id="new-admin-name" label="Full name" icon={IconUser} error={adminErrors.name}>
                    <input id="new-admin-name" type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Ada Obi" className="auth-field" />
                  </Field>
                  <Field id="new-admin-email" label="Email address" icon={IconMail} error={adminErrors.email}>
                    <input id="new-admin-email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin2@funlane.com" className="auth-field" />
                  </Field>
                  <Field id="new-admin-phone" label="Phone number" icon={IconPhone} error={adminErrors.phone}>
                    <input id="new-admin-phone" type="tel" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} placeholder="+234 800 000 0000" className="auth-field" />
                  </Field>
                  <Field id="new-admin-password" label="Temporary password" icon={IconLock} error={adminErrors.password}>
                    <input
                      id="new-admin-password"
                      type={showPw ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="At least 8 characters"
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
                    {adminLoading && <Spinner size="sm" />}
                    {adminLoading ? 'Creating…' : 'Create admin'}
                  </button>
                </form>
              )}
            </div>

            {/* Role spotlight pane */}
            <aside
              key={mode}
              className={`relative overflow-hidden p-6 text-white animate-fade-in ${
                isAgent
                  ? 'bg-gradient-to-br from-blue to-brand-dark'
                  : 'bg-gradient-to-br from-navy via-ink to-brand-dark'
              }`}
            >
              <div aria-hidden="true" className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="relative">
                <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  {isAgent ? <Briefcase className="w-5 h-5" /> : <ShieldPlus className="w-5 h-5" />}
                </span>
                <h3 className="text-lg font-bold mt-4">{isAgent ? 'Agency Agent' : 'Administrator'}</h3>
                <p className="text-white/60 text-sm mt-1.5 leading-relaxed">
                  {isAgent
                    ? 'Agents process travel requests, build quotes and issue tickets for clients.'
                    : 'Admins manage the whole platform — accounts, roles and onboarding.'}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {(isAgent
                    ? ['Process & quote travel requests', 'Issue tickets and upload PDFs', 'Monitor client wallet activity']
                    : ['Manage every user account', 'Grant & revoke roles', 'Onboard agents and admins']
                  ).map((cap) => (
                    <li key={cap} className="flex items-start gap-2.5 text-sm text-white/90">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      {cap}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-start gap-2 rounded-xl bg-white/10 border border-white/15 p-3 text-[12px] text-white/80 leading-relaxed">
                  {isAgent ? <Mail className="w-4 h-4 shrink-0 mt-0.5" /> : <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />}
                  {isAgent
                    ? 'Receives an email invite to set their own password.'
                    : 'Gets administrator access immediately with the password you set.'}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Recent additions rail */}
        <aside className="lg:col-span-2 bg-white rounded-2xl border border-line shadow-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <UsersRound className="w-4 h-4 text-ink-3" aria-hidden="true" />
            <h2 className="font-semibold text-ink">Added this session</h2>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-ink-3" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-ink-2">No one added yet</p>
              <p className="text-xs text-ink-3 mt-1">New agents and admins will appear here as you onboard them.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {recent.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 p-3 rounded-xl border border-line hover:bg-surface/60 transition-colors animate-fade-in">
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${entry.kind === 'admin' ? 'bg-ink text-white' : 'bg-blue text-white'}`}>
                    {entry.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?'}
                  </div>
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
          )}
        </aside>
      </div>
    </div>
  );
}

function RoleToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Briefcase;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg text-sm font-semibold transition-colors ${
        active ? 'bg-white text-ink shadow-sm' : 'text-ink-3 hover:text-ink'
      }`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" /> {label}
    </button>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: typeof IconUser;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="w-5 h-5 text-ink-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-dark">{error}</p>}
    </div>
  );
}
