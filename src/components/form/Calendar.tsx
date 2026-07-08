'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Shared month-grid calendar used by DateField and DateTimeField. Pure and
 * controlled: it renders a month view, handles month/year navigation and
 * min/max disabling, and reports picks through `onSelect`.
 */

/* Date helpers (local-time, date-only semantics) ----------------------- */

export const pad2 = (n: number) => String(n).padStart(2, '0');

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Parses the leading YYYY-MM-DD of an ISO date/datetime string. */
export function parseISODate(value?: string | null): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface CalendarProps {
  /** Currently selected day (highlighted). */
  value: Date | null;
  min?: Date | null;
  max?: Date | null;
  onSelect: (day: Date) => void;
}

export function Calendar({ value, min, max, onSelect }: CalendarProps) {
  const today = startOfDay(new Date());
  const [view, setView] = useState<Date>(() => {
    const base = value ?? (max && today > max ? max : min && today < min ? min : today);
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const minDay = min ? startOfDay(min) : null;
  const maxDay = max ? startOfDay(max) : null;

  const yearFrom = minDay ? minDay.getFullYear() : today.getFullYear() - 100;
  const yearTo = maxDay ? maxDay.getFullYear() : today.getFullYear() + 10;
  const years: number[] = [];
  for (let y = yearTo; y >= yearFrom; y--) years.push(y);

  const firstWeekday = view.getDay();
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];

  const disabled = (d: Date) => (minDay !== null && d < minDay) || (maxDay !== null && d > maxDay);

  const navBtn =
    'w-8 h-8 flex items-center justify-center rounded-lg text-ink-3 hover:text-ink hover:bg-surface transition-colors';
  const monthSelect =
    'text-sm font-semibold text-ink bg-transparent rounded-md px-1 py-1 cursor-pointer hover:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-soft';

  return (
    <div className="p-3 w-[276px] select-none">
      {/* Header: prev / month + year selects / next */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          aria-label="Previous month"
          className={navBtn}
          onClick={() => setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1))}
        >
          <ChevronLeft aria-hidden="true" className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          <select
            aria-label="Month"
            className={monthSelect}
            value={view.getMonth()}
            onChange={(e) => setView((v) => new Date(v.getFullYear(), Number(e.target.value), 1))}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <select
            aria-label="Year"
            className={monthSelect}
            value={view.getFullYear()}
            onChange={(e) => setView((v) => new Date(Number(e.target.value), v.getMonth(), 1))}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          aria-label="Next month"
          className={navBtn}
          onClick={() => setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1))}
        >
          <ChevronRight aria-hidden="true" className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday row */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="h-8 flex items-center justify-center text-[11px] font-semibold text-ink-3 uppercase tracking-wide">
            {d}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div role="grid" className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) =>
          d === null ? (
            <span key={`pad-${i}`} />
          ) : (
            <button
              key={d.toISOString()}
              type="button"
              role="gridcell"
              disabled={disabled(d)}
              aria-pressed={value ? isSameDay(d, value) : undefined}
              onClick={() => onSelect(d)}
              className={`h-9 w-9 mx-auto flex items-center justify-center rounded-lg text-sm transition-colors
                ${value && isSameDay(d, value)
                  ? 'bg-brand text-white font-semibold shadow-sm'
                  : isSameDay(d, today)
                    ? 'text-brand font-semibold bg-brand-soft hover:bg-brand hover:text-white'
                    : 'text-ink hover:bg-surface'}
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink`}
            >
              {d.getDate()}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
