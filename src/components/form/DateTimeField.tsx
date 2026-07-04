'use client';

import { useField } from 'formik';
import { CalendarClock, type LucideIcon } from 'lucide-react';
import { FieldShell, FloatingLabel, frameClass, controlClass, leadingIconClass } from './FieldShell';

interface DateTimeFieldProps {
  name: string;
  label: string;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
}

export function DateTimeField({ name, label, icon: Icon = CalendarClock, hint, min, max, disabled, id }: DateTimeFieldProps) {
  const [field, meta] = useField<string>(name);

  const inputId = id ?? name;
  const showError = meta.touched && !!meta.error;
  const tone = showError ? 'error' : meta.touched && !meta.error && field.value ? 'valid' : 'default';

  return (
    <FieldShell error={showError ? meta.error : undefined} hint={hint}>
      <div className={frameClass(tone)}>
        <input
          id={inputId}
          type="datetime-local"
          min={min}
          max={max}
          disabled={disabled}
          aria-invalid={showError || undefined}
          className={`${controlClass} pl-11 pr-4 ${field.value ? 'text-ink' : 'text-ink-3/60'}`}
          {...field}
        />
        <Icon aria-hidden="true" className={leadingIconClass} />
        <FloatingLabel htmlFor={inputId} error={showError} always>
          {label}
        </FloatingLabel>
      </div>
    </FieldShell>
  );
}
