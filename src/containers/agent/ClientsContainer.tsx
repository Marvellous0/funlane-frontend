'use client';

import { usePortalStore } from '@/store/usePortalStore';
import { fmtNaira, initials } from '@/utils/format';

export function ClientsContainer() {
  const clients = usePortalStore((s) => s.clients);
  const requests = usePortalStore((s) => s.requests);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Clients &amp; wallets</h1>
        <p className="text-ink-3 text-sm mt-1">Monitor pre-funded wallet balances and client activity.</p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide">Client</th>
                <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide">Type</th>
                <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide">Email</th>
                <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide text-right">Wallet balance</th>
                <th className="px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide text-right">Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-surface/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center font-semibold text-xs text-ink-2 border border-line group-hover:bg-brand-soft group-hover:text-brand group-hover:border-brand/30 transition-colors">
                        {initials(c.name)}
                      </div>
                      <span className="text-ink text-sm font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md ${
                        c.type === 'Corporate' ? 'bg-brand-soft text-brand' : 'bg-surface text-ink-3 border border-line'
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-3">{c.email}</td>
                  <td className="px-5 py-4 text-right text-sm font-semibold text-ink">{fmtNaira(c.wallet)}</td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-ink-2">
                    {requests.filter((r) => r.clientId === c.id).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
