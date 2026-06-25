import type { RequestStatus } from '@/interface';
import { STATUS } from '@/lib/constants';

export function StatusBadge({ status }: { status: RequestStatus }) {
  const s = STATUS[status];

  const colors: Record<RequestStatus, string> = {
    pending: 'bg-amber-soft text-amber-dark',
    quoted: 'bg-purple-soft text-purple',
    approved: 'bg-green-soft text-green-dark',
    issued: 'bg-blue-soft text-blue-dark',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${colors[status]}`}
    >
      <span
        aria-hidden="true"
        className={`w-1.5 h-1.5 rounded-full bg-current ${status === 'approved' ? 'animate-pulse' : ''}`}
      />
      {s.label}
    </span>
  );
}
