'use client';

import Link from 'next/link';
import { useRequestList } from '@/hooks/useRequestsLive';
import { RequestTable } from '@/components/RequestTable';
import { EmptyState, Loader, PageHeader, Pagination } from '@/components/ui';
import { CheckCircle2, ClipboardList, AlertTriangle, RefreshCw } from 'lucide-react';

interface RequestListContainerProps {
  mode?: 'all' | 'review';
}

export function RequestListContainer({ mode = 'all' }: RequestListContainerProps) {
  const { items, pagination, loading, error, params, setParams, refresh } = useRequestList('mine');
  const reqs = mode === 'review' ? items.filter((r) => r.status === 'OPTIONS_SENT') : items;
  function changeLimit(limit: number) {
    setParams({
      ...params,
      page: 1,
      limit,
    });
  }

  const heading = mode === 'review' ? 'Review options' : 'My requests';
  const subtitle =
    mode === 'review'
      ? 'Travel options that are ready for your approval.'
      : 'A complete history of your travel bookings and submissions.';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow={mode === 'review' ? 'Action needed' : 'History'}
        eyebrowIcon={mode === 'review' ? CheckCircle2 : ClipboardList}
        title={heading}
        subtitle={subtitle}
      />

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <AlertTriangle aria-hidden="true" className="w-8 h-8 text-amber mx-auto mb-3" />
            <p className="text-sm text-ink-2">{error}</p>
            <button onClick={refresh} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline">
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        ) : loading ? (
          <Loader label="Loading requests…" />
        ) : reqs.length ? (
          <RequestTable requests={reqs} hrefFor={(id) => `/client/requests/${id}`} />
        ) : mode === 'review' ? (
          <EmptyState icon={CheckCircle2}>Nothing to review right now. We&apos;ll notify you when options are ready.</EmptyState>
        ) : (
          <EmptyState icon={ClipboardList}>
            <div className="space-y-3">
              <p>You haven&apos;t made any requests yet.</p>
              <Link href="/client/new" className="inline-block bg-brand text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors">
                Book your first trip
              </Link>
            </div>
          </EmptyState>
        )}
      </div>

      {mode === 'all' && pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          unit="request"
          limit={params.limit ?? pagination.limit}
          onLimitChange={changeLimit}
          onPageChange={(p) => setParams({ ...params, page: p })}
        />
      )}
    </div>
  );
}
