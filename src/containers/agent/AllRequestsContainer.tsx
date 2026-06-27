'use client';

import { useRequestList } from '@/hooks/useRequestsLive';
import { RequestTable } from '@/components/RequestTable';
import { EmptyState, Loader, PageHeader, Pagination } from '@/components/ui';
import { ClipboardList, AlertTriangle, RefreshCw } from 'lucide-react';

export function AllRequestsContainer() {
  const { items, pagination, loading, error, params, setParams, refresh } = useRequestList('queue');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow="Pipeline"
        eyebrowIcon={ClipboardList}
        title="All requests"
        subtitle="A consolidated view of every request in the pipeline."
      />

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <AlertTriangle aria-hidden="true" className="w-8 h-8 text-amber mx-auto mb-3" />
            <p className="text-sm text-ink-2">{error}</p>
            <button onClick={refresh} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline"><RefreshCw className="w-4 h-4" /> Try again</button>
          </div>
        ) : loading ? (
          <Loader label="Loading requests…" />
        ) : items.length ? (
          <RequestTable requests={items} hrefFor={(id) => `/agent/requests/${id}`} showAssignment />
        ) : (
          <EmptyState icon={ClipboardList}>No requests in the pipeline yet.</EmptyState>
        )}
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          unit="request"
          onPageChange={(p) => setParams({ ...params, page: p })}
        />
      )}
    </div>
  );
}
