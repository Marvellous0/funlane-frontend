'use client';

import { useField } from 'formik';
import { AlertCircle } from 'lucide-react';

interface CheckboxFieldProps {
  name: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField({ name, children, disabled, className }: CheckboxFieldProps) {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const showError = meta.touched && !!meta.error;

  return (
    <div className={className}>
      <label className="flex items-start gap-2.5 text-sm text-ink-2 select-none cursor-pointer">
        <input
          type="checkbox"
          disabled={disabled}
          aria-invalid={showError || undefined}
          className="mt-0.5 w-4 h-4 shrink-0 rounded border-line accent-brand cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft"
          {...field}
        />
        <span className="leading-relaxed">{children}</span>
      </label>
      {showError && (
        <p role="alert" className="mt-1.5 flex items-start gap-1 text-xs text-red-dark animate-fade-in">
          <AlertCircle aria-hidden="true" className="mt-px w-3.5 h-3.5 shrink-0" />
          {meta.error}
        </p>
      )}
    </div>
  );
}
