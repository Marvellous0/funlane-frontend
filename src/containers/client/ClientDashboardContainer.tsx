'use client';

import Link from 'next/link';
import { usePortalStore } from '@/store/usePortalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';
import { clientRequests, clientStats } from '@/services/request.service';
import { RequestTable } from '@/components/RequestTable';
import { EmptyState } from '@/components/ui';
import { fmtNaira, fmtDate } from '@/utils/format';
import { routeText } from '@/utils/request.utils';
import { Plus, CreditCard, Lock, Plane, Bell, CheckCircle2 } from 'lucide-react';
import type { ElementType } from 'react';

const clientHref = (id: string) => `/client/requests/${id}`;

export function ClientDashboardContainer() {
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const data = usePortalStore(
    useShallow((s) => ({
      clients: s.clients,
      agents: s.agents,
      requests: s.requests,
      ledger: s.ledger,
      refSeq: s.refSeq,
    }))
  );
  const client = data.clients.find((c) => c.id === userId);

  if (!client) return null;

  const reqs = clientRequests(data.requests, client.id);
  const stats = clientStats(data, client.id);
  const reviewReq = reqs.find((r) => r.status === 'quoted');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-light to-navy text-white p-6 sm:p-8">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/50 mb-1.5">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{client.name.split(' ')[0]}</h1>
            <p className="text-white/60 text-sm mt-2 max-w-md">
              Here&apos;s an overview of your travel requests and wallet activity.
            </p>
          </div>
          <Link
            href="/client/new"
            className="inline-flex items-center justify-center gap-2 bg-white text-navy px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-soft transition-colors shrink-0"
          >
            <Plus aria-hidden="true" className="w-4 h-4" /> New request
          </Link>
        </div>
      </section>

      {/* Stat grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Wallet balance" value={fmtNaira(stats.wallet)} icon={CreditCard} />
        <StatCard label="Locked funds" value={fmtNaira(stats.locked)} icon={Lock} />
        <StatCard label="Active requests" value={stats.active} icon={Plane} />
        <StatCard label="Awaiting review" value={stats.needsReview} icon={Bell} highlight={stats.needsReview > 0} />
      </section>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Recent requests */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Recent requests</h2>
            <Link href="/client/requests" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
            {reqs.length ? (
              <RequestTable requests={reqs.slice(0, 5)} hrefFor={clientHref} />
            ) : (
              <EmptyState icon={Plane}>
                <div className="space-y-3">
                  <p>You haven&apos;t made any travel requests yet.</p>
                  <Link
                    href="/client/new"
                    className="inline-block bg-brand text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors"
                  >
                    Create your first request
                  </Link>
                </div>
              </EmptyState>
            )}
          </div>
        </section>

        {/* Side column */}
        <aside className="space-y-4">
          {reviewReq ? (
            <div className="bg-white rounded-2xl border border-line shadow-card p-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-purple bg-purple-soft px-2.5 py-1 rounded-full">
                Action needed
              </span>
              <h3 className="font-semibold text-ink text-base mt-3">{routeText(reviewReq)}</h3>
              <p className="text-sm text-ink-3 mt-1">
                {fmtDate(reviewReq.departDate)} · {reviewReq.ref}
              </p>
              <p className="text-sm text-ink-2 mt-3 leading-relaxed">
                New travel options are ready for your review.
              </p>
              <Link
                href={clientHref(reviewReq.id)}
                className="mt-4 flex items-center justify-center gap-2 bg-brand text-white w-full py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors"
              >
                Review options
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-line shadow-card p-6 text-center">
              <CheckCircle2 aria-hidden="true" className="w-8 h-8 text-green mx-auto mb-3" />
              <h3 className="font-semibold text-ink text-sm">You&apos;re all caught up</h3>
              <p className="text-ink-3 text-sm mt-1.5 leading-relaxed">
                No requests need your attention right now.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-line shadow-card p-5">
            <h3 className="font-semibold text-ink text-sm mb-3">How it works</h3>
            <ol className="space-y-3">
              {[
                'Submit a travel request with your trip details.',
                'Our agents send you flight options to review.',
                'Approve an option — funds are locked, not charged.',
                'Your e-ticket is issued and funds are captured.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-brand-soft text-brand text-[11px] font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  icon: ElementType;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white p-4 rounded-2xl border shadow-card ${
        highlight ? 'border-brand/40 ring-1 ring-brand/10' : 'border-line'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon aria-hidden="true" className="w-4 h-4 text-ink-3" />
        <span className="text-[11px] font-medium text-ink-3 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-xl font-bold text-ink">{value}</div>
    </div>
  );
}
