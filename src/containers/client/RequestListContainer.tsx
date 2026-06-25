'use client';

import Link from 'next/link';
import { usePortalStore } from '@/store/usePortalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { clientRequests } from '@/services/request.service';
import { RequestTable } from '@/components/RequestTable';
import { EmptyState } from '@/components/ui';
import { CheckCircle2, ClipboardList } from 'lucide-react';

interface RequestListContainerProps {
  /** 'review' focuses the list on requests awaiting the client's decision. */
  mode?: 'all' | 'review';
}

export function RequestListContainer({ mode = 'all' }: RequestListContainerProps) {
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const requests = usePortalStore((s) => s.requests);
  const all = clientRequests(requests, userId);
  const reqs = mode === 'review' ? all.filter((r) => r.status === 'quoted') : all;

  const heading = mode === 'review' ? 'Review options' : 'My requests';
  const subtitle =
    mode === 'review'
      ? 'Travel options that are ready for your approval.'
      : 'A complete history of your travel bookings and submissions.';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">{heading}</h1>
        <p className="text-ink-3 text-sm mt-1">{subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        {reqs.length ? (
          <RequestTable requests={reqs} hrefFor={(id) => `/client/requests/${id}`} />
        ) : mode === 'review' ? (
          <EmptyState icon={CheckCircle2}>Nothing to review right now. We&apos;ll notify you when options are ready.</EmptyState>
        ) : (
          <EmptyState icon={ClipboardList}>
            <div className="space-y-3">
              <p>You haven&apos;t made any requests yet.</p>
              <Link
                href="/client/new"
                className="inline-block bg-brand text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors"
              >
                Book your first trip
              </Link>
            </div>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
