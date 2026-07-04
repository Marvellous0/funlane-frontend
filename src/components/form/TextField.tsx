'use client';

import { useState } from 'react';
import { useField } from 'formik';
import { CheckCircle2, Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { FieldShell, FloatingLabel, frameClass, controlClass, leadingIconClass } from './FieldShell';

interface TextFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
  id?: string;
}

export function TextField({ name, label, type = 'text', placeholder, icon: Icon, hint, disabled, autoComplete, inputMode, id }: TextFieldProps) {
  const [field, meta] = useField<string>(name);
  const [revealed, setRevealed] = useState(false);

  const inputId = id ?? name;
  const showError = meta.touched && !!meta.error;
  const showValid = meta.touched && !meta.error && String(field.value ?? '').trim() !== '';
  const tone = showError ? 'error' : showValid ? 'valid' : 'default';
  const isPassword = type === 'password';

  return (
    <FieldShell error={showError ? meta.error : undefined} hint={hint}>
      <div className={frameClass(tone)}>
        <input
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          placeholder={placeholder ?? ' '}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={showError || undefined}
          className={`${controlClass} placeholder:text-transparent focus:placeholder:text-ink-3/50 ${Icon ? 'pl-11' : 'pl-4'} ${isPassword || showValid ? 'pr-11' : 'pr-4'}`}
          {...field}
        />
        {Icon && <Icon aria-hidden="true" className={leadingIconClass} />}
        <FloatingLabel htmlFor={inputId} hasIcon={!!Icon} error={showError}>
          {label}
        </FloatingLabel>
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 text-ink-3/70 hover:text-ink transition-colors"
          >
            {revealed ? <EyeOff aria-hidden="true" className="w-[18px] h-[18px]" /> : <Eye aria-hidden="true" className="w-[18px] h-[18px]" />}
          </button>
        ) : (
          showValid && <CheckCircle2 aria-hidden="true" className="absolute right-3.5 w-[18px] h-[18px] text-green animate-scale-in" />
        )}
      </div>
    </FieldShell>
  );
}
