'use client';

import Link from 'next/link';
import { useRequestList } from '@/hooks/useRequestsLive';
import { EmptyState, Loader, PageHeader } from '@/components/ui';
import { fmtDate } from '@/utils/format';
import { passengerSummary, routeText } from '@/utils/request.utils';
import { Lock, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Ticket } from 'lucide-react';

export function IssueListContainer() {
  const { items, loading, error, refresh } = useRequestList('queue');
  const ready = items.filter((r) => r.status === 'APPROVED_LOCKED');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow="Ticketing"
        eyebrowIcon={Ticket}
        title="Ready to issue"
        subtitle="Funds are locked and confirmed. Issue the ticket and upload the PDF."
      />

      {error ? (
        <div className="bg-white rounded-2xl border border-line shadow-card p-8 text-center">
          <AlertTriangle aria-hidden="true" className="w-8 h-8 text-amber mx-auto mb-3" />
          <p className="text-sm text-ink-2">{error}</p>
          <button onClick={refresh} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline"><RefreshCw className="w-4 h-4" /> Try again</button>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-2xl border border-line shadow-card"><Loader /></div>
      ) : ready.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ready.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-line shadow-card p-5 hover:shadow-lg transition-shadow flex flex-col">
              <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold uppercase tracking-wide text-green-dark bg-green-soft px-2.5 py-1 rounded-full mb-3">
                <Lock aria-hidden="true" className="w-3 h-3" /> Funds locked
              </span>
              <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wide mb-1">{r.ref}</div>
              <h3 className="text-base font-semibold text-ink">{routeText(r)}</h3>
              <div className="text-sm text-ink-3 mt-1 mb-4">{passengerSummary(r)} · {fmtDate(r.departureDate)}</div>

              <Link href={`/agent/requests/${r.id}`} className="mt-auto w-full bg-green text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-dark transition-colors flex items-center justify-center gap-2">
                Issue ticket <ArrowRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line shadow-card">
          <EmptyState icon={CheckCircle2}>
            <div className="space-y-1">
              <p className="font-medium text-ink-2">All approved requests have been issued.</p>
              <p className="text-ink-3 text-xs">Nothing is waiting for ticketing right now.</p>
            </div>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
