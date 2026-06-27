import type { ApiRequestStatus } from '@/interface';
import { Check } from 'lucide-react';

const ORDER: ApiRequestStatus[] = ['PENDING', 'OPTIONS_SENT', 'APPROVED_LOCKED', 'ISSUED'];
const LABELS = ['Submitted', 'Quotation', 'Approved', 'Ticket Issued'];

/** Index in the linear flow; COMPLETED is past the last step, CANCELLED is off-flow. */
function progressIndex(status: ApiRequestStatus): number {
  if (status === 'COMPLETED') return ORDER.length;
  if (status === 'CANCELLED') return -1;
  return ORDER.indexOf(status);
}

export function ProgressSteps({ status }: { status: ApiRequestStatus }) {
  const cur = progressIndex(status);

  return (
    <ol className="flex items-center justify-between min-w-[520px] py-2 px-1">
      {ORDER.map((s, i) => {
        const isDone = i < cur;
        const isActive = i === cur;

        return (
          <li key={s} className="flex-1 flex flex-col items-center relative">
            {i !== 0 && (
              <div aria-hidden="true" className={`absolute right-1/2 top-4 w-full h-0.5 -translate-y-1/2 z-0 ${isDone || isActive ? 'bg-brand' : 'bg-line'}`} />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold relative z-10 transition-colors ${
              isDone ? 'bg-brand text-white' : isActive ? 'bg-white border-2 border-brand text-brand ring-4 ring-brand-soft' : 'bg-white border border-line text-ink-3'
            }`}>
              {isDone ? <Check size={16} strokeWidth={3} /> : i + 1}
            </div>
            <div className={`mt-3 text-[11px] font-semibold text-center ${isActive ? 'text-brand' : isDone ? 'text-ink-2' : 'text-ink-3'}`}>
              {LABELS[i]}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
