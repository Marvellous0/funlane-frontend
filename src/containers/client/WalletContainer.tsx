'use client';

import { usePortalStore } from '@/store/usePortalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { fmtNaira, fmtDateTime } from '@/utils/format';
import { EmptyState } from '@/components/ui';
import { Plus, ShieldCheck, Receipt } from 'lucide-react';

export function WalletContainer() {
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const clients = usePortalStore((s) => s.clients);
  const ledger = usePortalStore((s) => s.ledger);

  const client = clients.find((c) => c.id === userId);
  const entries = ledger.filter((e) => e.clientId === userId).slice().reverse();

  if (!client) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Wallet</h1>
          <p className="text-ink-3 text-sm mt-1">Manage your funds and view transaction history.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-brand text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-dark transition-colors">
          <Plus aria-hidden="true" className="w-4 h-4" /> Top up balance
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Balance card */}
        <div className="md:col-span-2 bg-gradient-to-br from-navy-light to-navy text-white rounded-2xl p-6 sm:p-8">
          <div className="text-[11px] uppercase tracking-wide font-medium text-white/50 mb-2">Available balance</div>
          <div className="text-3xl sm:text-4xl font-bold mb-6">{fmtNaira(client.wallet)}</div>

          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Account name</dt>
              <dd className="text-sm font-medium text-white/90">{client.name}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Client type</dt>
              <dd className="text-sm font-medium text-white/90">{client.type}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/40 mb-1">Currency</dt>
              <dd className="text-sm font-medium text-white/90">NGN · Naira</dd>
            </div>
          </dl>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-line shadow-card p-6 flex flex-col justify-center items-center text-center gap-3">
          <div aria-hidden="true" className="w-12 h-12 rounded-xl bg-green-soft text-green flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-ink text-sm">Zero risk</h3>
          <p className="text-xs text-ink-3 leading-relaxed">
            Funds are only locked when you approve a quotation, and captured when ticketing is finalized.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink">Transaction history</h2>

        <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          {entries.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b border-line bg-surface">
                    <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide">Date &amp; time</th>
                    <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide">Description</th>
                    <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide text-right">Balance after</th>
                    <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {entries.map((e) => {
                    const isNeg = e.amount < 0 || e.type === 'capture' || e.type === 'lock';
                    return (
                      <tr key={e.id} className="hover:bg-surface/60 transition-colors">
                        <td className="px-5 py-4 text-sm text-ink-2 whitespace-nowrap">{fmtDateTime(e.ts)}</td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-ink capitalize">{e.type}</div>
                          {e.note && <div className="text-xs text-ink-3 mt-0.5">{e.note}</div>}
                        </td>
                        <td className="px-5 py-4 text-right text-sm text-ink-2 tabular-nums">{fmtNaira(e.balanceAfter)}</td>
                        <td className={`px-5 py-4 text-right text-sm font-semibold tabular-nums ${isNeg ? 'text-red' : 'text-green-dark'}`}>
                          {isNeg ? '−' : '+'}
                          {fmtNaira(Math.abs(e.amount))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Receipt}>No transactions yet.</EmptyState>
          )}
        </div>
      </section>
    </div>
  );
}
