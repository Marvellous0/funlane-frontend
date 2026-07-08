'use client';

import { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';
import { CalendarDays, type LucideIcon } from 'lucide-react';
import { FieldShell, FloatingLabel, frameClass, controlClass, leadingIconClass } from './FieldShell';
import { Calendar, parseISODate, toISODate, formatDisplayDate } from './Calendar';

interface DateFieldProps {
  name: string;
  label: string;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  /** ISO date (YYYY-MM-DD) lower/upper bounds. */
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Custom date picker: a read-only trigger styled like every other field that
 * opens a themed calendar popover. Formik keeps holding a plain YYYY-MM-DD
 * string, so schemas and API payloads are unchanged.
 */
export function DateField({ name, label, icon: Icon = CalendarDays, hint, min, max, disabled, id }: DateFieldProps) {
  const [field, meta, helpers] = useField<string>(name);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const inputId = id ?? name;
  const selected = parseISODate(field.value);
  const showError = meta.touched && !!meta.error;
  const tone = showError ? 'error' : meta.touched && !meta.error && field.value ? 'valid' : 'default';

  // Close on outside click / Escape, marking the field as touched.
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

  function pick(day: Date) {
    void helpers.setValue(toISODate(day));
    setOpen(false);
    void helpers.setTouched(true, false);
  }

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
            className={`${controlClass} pl-11 pr-4 text-left ${selected ? 'text-ink' : 'text-ink-3/60'}`}
          >
            {selected ? formatDisplayDate(selected) : 'Select date'}
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
            <Calendar value={selected} min={parseISODate(min)} max={parseISODate(max)} onSelect={pick} />
          </div>
        )}
      </div>
    </FieldShell>
  );
}
