'use client';

import { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import { CalendarClock, type LucideIcon } from 'lucide-react';
import { FieldShell, FloatingLabel, frameClass, controlClass, leadingIconClass } from './FieldShell';
import { Calendar, parseISODate, toISODate, formatDisplayDate, pad2 } from './Calendar';

interface DateTimeFieldProps {
  name: string;
  label: string;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  /** ISO datetime (YYYY-MM-DDTHH:mm) lower/upper bounds — date part is enforced. */
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => pad2(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => pad2(i * 5));

function parseTime(value: string): { hour: string; minute: string } {
  const m = /T(\d{2}):(\d{2})/.exec(value);
  return m ? { hour: m[1], minute: m[2] } : { hour: '09', minute: '00' };
}

/**
 * Custom date-and-time picker: calendar popover plus hour/minute selects.
 * Formik keeps holding a "YYYY-MM-DDTHH:mm" string (same shape the native
 * datetime-local input produced), so existing submit logic is unchanged.
 */
export function DateTimeField({ name, label, icon: Icon = CalendarClock, hint, min, max, disabled, id }: DateTimeFieldProps) {
  const [field, meta, helpers] = useField<string>(name);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const inputId = id ?? name;
  const selectedDay = parseISODate(field.value);
  const { hour, minute } = parseTime(field.value ?? '');
  const showError = meta.touched && !!meta.error;
  const tone = showError ? 'error' : meta.touched && !meta.error && field.value ? 'valid' : 'default';

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    void helpers.setTouched(true);
  }

  function commit(day: Date | null, h: string, m: string) {
    if (!day) return;
    void helpers.setValue(`${toISODate(day)}T${h}:${m}`);
  }

  function display(): string {
    if (!selectedDay) return 'Select date & time';
    return `${formatDisplayDate(selectedDay)}, ${hour}:${minute}`;
  }

  // Keep a non-step minute (e.g. an existing 09:37 value) selectable.
  const minuteOptions = MINUTES.includes(minute) ? MINUTES : [...MINUTES, minute].sort();

  const timeSelect =
    'flex-1 text-sm font-medium text-ink bg-surface border border-line rounded-lg px-2 py-2 cursor-pointer focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft';

  return (
    <FieldShell error={showError ? meta.error : undefined} hint={hint}>
      <div ref={rootRef} className="relative">
        <div className={frameClass(tone)}>
          <button
            id={inputId}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-invalid={showError || undefined}
            onClick={() => (open ? close() : setOpen(true))}
            className={`${controlClass} pl-11 pr-4 text-left ${selectedDay ? 'text-ink' : 'text-ink-3/60'}`}
          >
            {display()}
          </button>
          <Icon aria-hidden="true" className={leadingIconClass} />
          <FloatingLabel htmlFor={inputId} error={showError} always>
            {label}
          </FloatingLabel>
        </div>

        {open && (
          <div
            role="dialog"
            aria-label={`${label} calendar`}
            className="absolute z-30 mt-2 rounded-xl border border-line bg-card shadow-lg animate-fade-in"
          >
            <Calendar
              value={selectedDay}
              min={parseISODate(min)}
              max={parseISODate(max)}
              onSelect={(day) => commit(day, hour, minute)}
            />

            <div className="px-3 pb-3 space-y-2 w-[276px]">
              <div className="flex items-center gap-2">
                <select
                  aria-label="Hour"
                  className={timeSelect}
                  value={hour}
                  disabled={!selectedDay}
                  onChange={(e) => commit(selectedDay, e.target.value, minute)}
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="text-sm font-semibold text-ink-3">:</span>
                <select
                  aria-label="Minute"
                  className={timeSelect}
                  value={minute}
                  disabled={!selectedDay}
                  onChange={(e) => commit(selectedDay, hour, e.target.value)}
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={!selectedDay}
                onClick={close}
                className="w-full bg-brand text-white py-2 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </FieldShell>
  );
}
