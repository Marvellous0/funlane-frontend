'use client';

import { useRouter } from 'next/navigation';
import type { TravelRequest } from '@/interface';
import { usePortalStore } from '@/store/usePortalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { BOARD_COLUMNS } from '@/lib/constants';
import { agentName as agentNameOf } from '@/services/request.service';
import { fmtNaira, fmtDate, initials } from '@/utils/format';
import { passengerSummary, shortRoute, tierLabel } from '@/utils/request.utils';
import { Inbox } from 'lucide-react';

export function AgentBoardContainer() {
  const router = useRouter();
  const requests = usePortalStore((s) => s.requests);
  const agents = usePortalStore((s) => s.agents);
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const me = agents.find((a) => a.id === userId);

  return (
    <div className="space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-140px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Request queue</h1>
          <p className="text-ink-3 text-sm mt-1">Manage processing, quoting, and ticketing across all clients.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-line shadow-card self-start">
          <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-[11px] font-semibold">
            {initials(me?.name ?? '??')}
          </div>
          <div className="text-sm font-medium text-ink">{me?.name ?? 'Agent'}</div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {BOARD_COLUMNS.map((col) => {
          const cards = requests.filter((r) => r.status === col.status);
          return (
            <div className="flex-shrink-0 w-80 flex flex-col gap-3" key={col.status}>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                  <h2 className="font-semibold text-ink-2 text-sm">{col.title}</h2>
                </div>
                <span className="bg-surface text-ink-3 text-xs font-semibold px-2 py-0.5 rounded-md border border-line">
                  {cards.length}
                </span>
              </div>

              <div className="flex-1 bg-surface border border-line rounded-2xl p-2.5 space-y-2.5 min-h-[400px]">
                {cards.length ? (
                  cards.map((r) => (
                    <BoardCard
                      key={r.id}
                      r={r}
                      agentName={(id) => agentNameOf(agents, id)}
                      onOpen={() => router.push(`/agent/requests/${r.id}`)}
                    />
                  ))
                ) : (
                  <div className="h-28 flex flex-col items-center justify-center text-center text-ink-3 text-sm">
                    <Inbox aria-hidden="true" className="w-5 h-5 mb-1.5 opacity-60" />
                    No requests
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoardCard({ r, agentName, onOpen }: { r: TravelRequest; agentName: (id: string) => string; onOpen: () => void }) {
  const sel = r.options.find((o) => o.id === r.selectedOptionId);
  const isApproved = r.status === 'approved';

  const tierStyle =
    r.budgetTier === 'premium'
      ? 'bg-amber-soft text-amber-dark'
      : r.budgetTier === 'standard'
      ? 'bg-blue-soft text-blue-dark'
      : 'bg-white text-ink-3 border border-line';

  return (
    <button
      type="button"
      className={`group w-full text-left bg-white p-4 rounded-xl border shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all ${
        isApproved ? 'border-green/40' : 'border-line'
      }`}
      onClick={onOpen}
    >
      <div className="flex justify-between items-start mb-2.5">
        <span className="text-[11px] font-semibold text-ink-2 bg-surface px-2 py-0.5 rounded border border-line uppercase tracking-wide">
          {r.ref}
        </span>
        {r.rejectionReason && r.status === 'pending' && (
          <span className="bg-red-soft text-red-dark text-[10px] font-semibold px-1.5 py-0.5 rounded">Resubmitted</span>
        )}
      </div>

      <h3 className="font-semibold text-ink text-sm group-hover:text-brand transition-colors">{shortRoute(r)}</h3>
      <div className="text-xs text-ink-3 flex items-center gap-1.5 mt-1 mb-3">
        <span>{passengerSummary(r)}</span>
        <span aria-hidden="true">·</span>
        <span>{fmtDate(r.departDate)}</span>
      </div>

      {isApproved && (
        <div className="bg-green-soft rounded-lg p-2.5 mb-3">
          <div className="text-[10px] uppercase font-semibold text-green-dark tracking-wide mb-0.5">Selected option</div>
          <div className="text-xs font-medium text-ink-2">
            {sel?.airline} · {sel?.flightNo}
          </div>
          <div className="text-xs font-semibold text-green-dark mt-0.5">{fmtNaira(r.lockedAmount)} locked</div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-line pt-3">
        <span className={`text-[11px] font-semibold py-0.5 px-2 rounded-full ${tierStyle}`}>{tierLabel(r.budgetTier)}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-3 truncate max-w-[70px]">{agentName(r.assignedAgent)}</span>
          <span className="w-6 h-6 rounded-md bg-surface text-ink-2 flex items-center justify-center text-[10px] font-semibold border border-line">
            {initials(agentName(r.assignedAgent))}
          </span>
        </div>
      </div>
    </button>
  );
}
