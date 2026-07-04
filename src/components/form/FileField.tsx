'use client';

import { useField, useFormikContext } from 'formik';
import { Upload, FileCheck2, X } from 'lucide-react';
import { FieldShell } from './FieldShell';

interface FileFieldProps {
  name: string;
  label: string;
  accept?: string;
  hint?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileField({ name, label, accept, hint, placeholder = 'Click to upload', disabled, id }: FileFieldProps) {
  const [field, meta] = useField<File | null>(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const inputId = id ?? name;
  const file = field.value;
  const showError = meta.touched && !!meta.error;

  const tone = showError
    ? 'border-red/50 bg-red-soft/40'
    : file
      ? 'border-green/40 bg-green-soft/50'
      : 'border-line bg-surface hover:border-brand/50 hover:bg-brand-soft/30';

  return (
    <FieldShell error={showError ? meta.error : undefined} hint={hint}>
      <label
        htmlFor={inputId}
        className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-dashed cursor-pointer transition-all duration-200 focus-within:ring-4 focus-within:ring-brand-soft focus-within:border-brand ${tone} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none absolute top-0 left-3 -translate-y-1/2 whitespace-nowrap select-none text-[11px] font-semibold tracking-wide px-1.5 rounded bg-card ${showError ? 'text-red-dark' : 'text-ink-3'}`}
        >
          {label}
        </span>
        <span
          className={`flex w-8 h-8 shrink-0 items-center justify-center rounded-lg transition-colors ${file ? 'bg-green/10 text-green-dark' : 'bg-brand-soft text-brand'}`}
        >
          {file ? <FileCheck2 aria-hidden="true" className="w-4 h-4" /> : <Upload aria-hidden="true" className="w-4 h-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-sm ${file ? 'font-medium text-ink' : 'text-ink-3/70'}`}>
            {file ? file.name : placeholder}
          </span>
          <span className="block text-[11px] text-ink-3/70">
            {file ? formatSize(file.size) : accept ? accept.split(',').map((t) => t.split('/')[1]?.toUpperCase() ?? t).join(', ') : 'Any file'}
          </span>
        </span>
        {file && !disabled && (
          <button
            type="button"
            aria-label={`Remove ${file.name}`}
            onClick={(e) => {
              e.preventDefault();
              void setFieldValue(name, null);
              void setFieldTouched(name, true, false);
            }}
            className="flex w-7 h-7 shrink-0 items-center justify-center rounded-lg text-ink-3 hover:bg-card hover:text-red transition-colors"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        )}
        <input
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          aria-invalid={showError || undefined}
          onChange={(e) => {
            void setFieldValue(name, e.currentTarget.files?.[0] ?? null);
            void setFieldTouched(name, true, false);
            e.currentTarget.value = '';
          }}
          onBlur={() => void setFieldTouched(name, true)}
        />
      </label>
    </FieldShell>
  );
}
