'use client';

import { usePortalStore } from '@/store/usePortalStore';
import { RequestTable } from '@/components/RequestTable';
import { EmptyState } from '@/components/ui';
import { agentName as agentNameOf } from '@/services/request.service';
import { ClipboardList } from 'lucide-react';

export function AllRequestsContainer() {
  const requests = usePortalStore((s) => s.requests);
  const agents = usePortalStore((s) => s.agents);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">All requests</h1>
        <p className="text-ink-3 text-sm mt-1">A consolidated view of every request in the pipeline.</p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        {requests.length ? (
          <RequestTable
            requests={requests}
            hrefFor={(id) => `/agent/requests/${id}`}
            showClient
            agentName={(id) => agentNameOf(agents, id)}
          />
        ) : (
          <EmptyState icon={ClipboardList}>No requests in the pipeline yet.</EmptyState>
        )}
      </div>
    </div>
  );
}
