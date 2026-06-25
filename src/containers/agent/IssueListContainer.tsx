'use client';

import Link from 'next/link';
import { usePortalStore } from '@/store/usePortalStore';
import { EmptyState } from '@/components/ui';
import { fmtNaira } from '@/utils/format';
import { passengerSummary, routeText } from '@/utils/request.utils';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export function IssueListContainer() {
  const requests = usePortalStore((s) => s.requests);
  const ready = requests.filter((r) => r.status === 'approved');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Ready to issue</h1>
        <p className="text-ink-3 text-sm mt-1">Funds are locked and confirmed. Issue the ticket and upload the PDF.</p>
      </div>

      {ready.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ready.map((r) => {
            const o = r.options.find((x) => x.id === r.selectedOptionId);
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-line shadow-card p-5 hover:shadow-lg transition-shadow flex flex-col">
                <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold uppercase tracking-wide text-green-dark bg-green-soft px-2.5 py-1 rounded-full mb-3">
                  <Lock aria-hidden="true" className="w-3 h-3" /> Funds locked
                </span>
                <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wide mb-1">{r.ref}</div>
                <h3 className="text-base font-semibold text-ink">{routeText(r)}</h3>
                <div className="text-sm text-ink-3 mt-1 mb-4">
                  {r.clientName} · {passengerSummary(r)}
                </div>

                <div className="bg-surface rounded-xl p-3.5 flex items-center justify-between mb-4 border border-line">
                  <div className="text-sm text-ink-2">
                    {o?.airline} {o?.flightNo}
                  </div>
                  <div className="text-sm font-semibold text-brand">{fmtNaira(o?.price ?? 0)}</div>
                </div>

                <Link
                  href={`/agent/requests/${r.id}`}
                  className="mt-auto w-full bg-green text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-green-dark transition-colors flex items-center justify-center gap-2"
                >
                  Issue ticket <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
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
