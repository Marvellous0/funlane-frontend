'use client';

import { useField } from 'formik';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { FieldShell, FloatingLabel, frameClass, controlClass, leadingIconClass } from './FieldShell';

interface SelectFieldProps {
  name: string;
  label: string;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  children: React.ReactNode;
}

export function SelectField({ name, label, icon: Icon, hint, disabled, id, children }: SelectFieldProps) {
  const [field, meta] = useField<string>(name);

  const inputId = id ?? name;
  const showError = meta.touched && !!meta.error;

  return (
    <FieldShell error={showError ? meta.error : undefined} hint={hint}>
      <div className={frameClass(showError ? 'error' : 'default')}>
        <select
          id={inputId}
          disabled={disabled}
          aria-invalid={showError || undefined}
          className={`${controlClass} appearance-none cursor-pointer pr-10 ${Icon ? 'pl-11' : 'pl-4'}`}
          {...field}
        >
          {children}
        </select>
        {Icon && <Icon aria-hidden="true" className={leadingIconClass} />}
        <FloatingLabel htmlFor={inputId} error={showError} always>
          {label}
        </FloatingLabel>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 w-4 h-4 text-ink-3/70 transition-transform duration-200 peer-focus:rotate-180 peer-focus:text-brand" />
      </div>
    </FieldShell>
  );
}
