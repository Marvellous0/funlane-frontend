'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, ShieldPlus, ArrowRight, ShieldCheck, ClipboardList, Clock, Plane, CheckCircle2, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRequestList } from '@/hooks/useRequestsLive';
import { requestsApi } from '@/api';
import { PageHeader, StatCard } from '@/components/ui';
import { dailyCounts, weekOverWeek } from '@/utils/trend';
import type { ApiRequestStatus } from '@/interface';

interface StatusTotals {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

/**
 * Accurate platform-wide counts: each figure comes from the backend's
 * `pagination.total` for that status filter (limit=1 requests, so the calls
 * are cheap) rather than counting one page of results — which previously made
 * the cards disagree with each other.
 */
async function fetchStatusTotals(): Promise<StatusTotals> {
  const count = async (status?: ApiRequestStatus) =>
    (await requestsApi.listAll({ status, page: 1, limit: 1 })).pagination.total;

  const [total, pending, optionsSent, approved, issued, completed, cancelled] = await Promise.all([
    count(), count('PENDING'), count('OPTIONS_SENT'), count('APPROVED_LOCKED'),
    count('ISSUED'), count('COMPLETED'), count('CANCELLED'),
  ]);

  return { total, pending, inProgress: optionsSent + approved + issued, completed, cancelled };
}

export function AdminOverviewContainer() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'Admin';
  // Recent requests still power the 7-day sparkline/trend.
  const { items } = useRequestList('all');

  const [totals, setTotals] = useState<StatusTotals | null>(null);
  const loading = totals === null;

  useEffect(() => {
    fetchStatusTotals()
      .then(setTotals)
      .catch(() => setTotals({ total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 }));
  }, []);

  const volumeSpark = dailyCounts(items, 7);
  const volumeTrend = weekOverWeek(items);
  const hasSpark = volumeSpark.some((n) => n > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Console"
        eyebrowIcon={ShieldCheck}
        title={`Welcome back, ${firstName}.`}
        subtitle="Manage your team — onboard agents and grant administrator access."
      />

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total requests"
          value={totals?.total ?? 0}
          icon={ClipboardList}
          iconTone="brand"
          loading={loading}
          sparkline={hasSpark ? volumeSpark : undefined}
          trend={volumeTrend !== null ? { value: volumeTrend, label: 'vs last week' } : undefined}
        />
        <StatCard label="Pending" value={totals?.pending ?? 0} icon={Clock} iconTone="amber" highlight={(totals?.pending ?? 0) > 0} loading={loading} />
        <StatCard label="In progress" value={totals?.inProgress ?? 0} icon={Plane} iconTone="blue" loading={loading} />
        <StatCard label="Completed" value={totals?.completed ?? 0} icon={CheckCircle2} iconTone="green" loading={loading} />
        <StatCard label="Cancelled" value={totals?.cancelled ?? 0} icon={XCircle} iconTone="ink" loading={loading} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActionCard
          href="/admin/requests"
          icon={ClipboardList}
          tone="brand"
          title="Browse all requests"
          desc="See every travel request across the platform — filter by status and open any one for detail."
          cta="View requests"
        />
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
  tone: 'blue' | 'ink' | 'brand';
  title: string;
  desc: string;
  cta: string;
}) {
  const toneClass =
    tone === 'blue'
      ? 'bg-blue-soft text-blue'
      : tone === 'brand'
        ? 'bg-brand text-white'
        : 'bg-surface text-ink border border-line';
  return (
    <Link
      href={href}
      className="group bg-card rounded-2xl border border-line p-6 shadow-sm hover:border-ink-3 transition-colors flex flex-col"
    >
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${toneClass}`}>
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
