'use client';

import { usePortalStore } from '@/store/usePortalStore';
import { fmtNaira, initials } from '@/utils/format';
import { PageHeader, DataTable } from '@/components/ui';
import { Wallet, Users as UsersIcon } from 'lucide-react';

export function ClientsContainer() {
  const clients = usePortalStore((s) => s.clients);
  const requests = usePortalStore((s) => s.requests);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow="Accounts"
        eyebrowIcon={Wallet}
        title="Clients & wallets"
        subtitle="Monitor pre-funded wallet balances and client activity."
      />

      <DataTable
        data={clients}
        rowKey={(c) => c.id}
        minWidth={640}
        emptyIcon={UsersIcon}
        empty="No clients yet."
        columns={[
          {
            header: 'Client',
            cell: (c) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center font-semibold text-xs text-ink-2 border border-line">
                  {initials(c.name)}
                </div>
                <span className="text-ink text-sm font-medium">{c.name}</span>
              </div>
            ),
          },
          {
            header: 'Type',
            cell: (c) => (
              <span
                className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md ${
                  c.type === 'Corporate' ? 'bg-brand-soft text-brand' : 'bg-surface text-ink-3 border border-line'
                }`}
              >
                {c.type}
              </span>
            ),
          },
          { header: 'Email', cell: (c) => <span className="text-sm text-ink-3">{c.email}</span> },
          {
            header: 'Wallet balance',
            align: 'right',
            cell: (c) => <span className="text-sm font-semibold text-ink">{fmtNaira(c.wallet)}</span>,
          },
          {
            header: 'Requests',
            align: 'right',
            cell: (c) => <span className="text-sm font-medium text-ink-2">{requests.filter((r) => r.clientId === c.id).length}</span>,
          },
        ]}
      />
    </div>
  );
}
