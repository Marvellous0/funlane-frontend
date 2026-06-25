'use client';

import Link from 'next/link';
import type { TravelRequest } from '@/interface';
import { StatusBadge } from './ui/StatusBadge';
import { fmtDate } from '@/utils/format';
import { passengerSummary, routeText } from '@/utils/request.utils';

interface RequestTableProps {
  requests: TravelRequest[];
  hrefFor: (id: string) => string;
  showClient?: boolean;
  agentName?: (id: string) => string;
}

const th =
  'px-5 py-3.5 text-[11px] uppercase font-semibold text-ink-3 tracking-wide whitespace-nowrap';

export function RequestTable({ requests, hrefFor, showClient = false, agentName }: RequestTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-line bg-surface">
            <th className={th}>Reference</th>
            <th className={th}>Route</th>
            {showClient && <th className={th}>Client</th>}
            <th className={th}>Travelers</th>
            <th className={th}>Date</th>
            <th className={th}>Status</th>
            {agentName && <th className={`${th} text-right`}>Assigned Agent</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {requests.map((r) => (
            <tr key={r.id} className="hover:bg-surface/60 transition-colors group">
              <td className="px-5 py-4">
                <Link href={hrefFor(r.id)} className="inline-block">
                  <span className="text-[11px] font-semibold text-ink-2 uppercase tracking-wide bg-surface px-2 py-1 rounded-md border border-line group-hover:border-brand/40 group-hover:bg-brand-soft group-hover:text-brand transition-colors">
                    {r.ref}
                  </span>
                </Link>
              </td>
              <td className="px-5 py-4">
                <Link href={hrefFor(r.id)} className="block">
                  <div className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                    {routeText(r)}
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">{r.tripType === 'round' ? 'Round trip' : 'One way'}</div>
                </Link>
              </td>
              {showClient && (
                <td className="px-5 py-4">
                  <div className="text-sm text-ink-2">{r.clientName}</div>
                </td>
              )}
              <td className="px-5 py-4">
                <div className="text-sm text-ink-2">{passengerSummary(r)}</div>
              </td>
              <td className="px-5 py-4">
                <div className="text-sm text-ink-2">{fmtDate(r.departDate)}</div>
                <div className="text-xs text-ink-3 capitalize">{r.preferredTime}</div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={r.status} />
              </td>
              {agentName && (
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs text-ink-3">{agentName(r.assignedAgent)}</span>
                    <span className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center text-[10px] font-semibold text-ink-2 border border-line">
                      {agentName(r.assignedAgent)
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
