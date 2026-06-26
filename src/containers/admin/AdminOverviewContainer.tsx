'use client';

import Link from 'next/link';
import { Briefcase, ShieldPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function AdminOverviewContainer() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Admin';

  return (
    <div className="space-y-6">
      <header>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-2 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          Admin Console
        </div>
        <h1 className="text-2xl font-bold text-ink">Welcome back, {firstName}.</h1>
        <p className="text-ink-3 text-sm mt-1">Manage your team — onboard agents and grant administrator access.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionCard
          href="/admin/onboarding"
          icon={Briefcase}
          tone="blue"
          title="Onboard an agent"
          desc="Invite a new agent to the agency workspace. They’ll receive an email to set their password."
          cta="Onboard agent"
        />
        <ActionCard
          href="/admin/onboarding"
          icon={ShieldPlus}
          tone="ink"
          title="Create an admin"
          desc="Grant another teammate full administrative access to the console."
          cta="Create admin"
        />
      </div>

      <div className="auth-banner">
        <ShieldCheck className="w-5 h-5 text-blue shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <span className="font-semibold text-ink">You’re signed in as an administrator.</span> All
          onboarding actions are authenticated with your session and logged under NDPA-compliant controls.
        </p>
      </div>
    </div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  tone,
  title,
  desc,
  cta,
}: {
  href: string;
  icon: typeof Briefcase;
  tone: 'blue' | 'ink';
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-line p-6 shadow-sm hover:border-ink-3 transition-colors flex flex-col"
    >
      <span
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
          tone === 'blue' ? 'bg-blue-soft text-blue' : 'bg-surface text-ink border border-line'
        }`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <h2 className="font-semibold text-ink">{title}</h2>
      <p className="text-sm text-ink-3 mt-1 leading-relaxed">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:gap-2.5 transition-all">
        {cta}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
