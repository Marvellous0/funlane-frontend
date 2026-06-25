import type { HistoryEntry } from '@/interface';
import { fmtDateTime } from '@/utils/format';

export function Timeline({ history }: { history: HistoryEntry[] }) {
  return (
    <ul className="relative space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-line">
      {history
        .slice()
        .reverse()
        .map((e, i) => (
          <li key={i} className="relative pl-7 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <span
              aria-hidden="true"
              className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-brand z-10"
            />
            <div className="text-[13px] font-medium text-ink leading-snug">{e.text}</div>
            <div className="text-[11px] text-ink-3 mt-0.5">{fmtDateTime(e.ts)}</div>
          </li>
        ))}
    </ul>
  );
}
