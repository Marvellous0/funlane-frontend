import type { ApiRequestStatus } from '@/interface';
import { STATUS_META } from '@/services/requestView';

export function StatusBadge({ status }: { status: ApiRequestStatus }) {
  const meta = STATUS_META[status] ?? { label: status, badge: 'bg-surface text-ink-2', dot: 'bg-ink-3' };
  const pulse = status === 'APPROVED_LOCKED';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${meta.badge}`}>
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`} />
      {meta.label}
    </span>
  );
}
