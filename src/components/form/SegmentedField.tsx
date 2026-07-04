'use client';

import { useField } from 'formik';
import type { LucideIcon } from 'lucide-react';

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedFieldProps<V extends string> {
  name: string;
  label: string;
  options: SegmentedOption<V>[];
}

/** Pill-style radio group (e.g. one-way vs round trip). */
export function SegmentedField<V extends string>({ name, label, options }: SegmentedFieldProps<V>) {
  const [field, , helpers] = useField<V>(name);

  return (
    <div role="radiogroup" aria-label={label} className="inline-flex p-1 bg-surface border border-line rounded-xl">
      {options.map(({ value, label: text, icon: Icon }) => {
        const active = field.value === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => void helpers.setValue(value)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              active ? 'bg-card text-brand shadow-sm' : 'text-ink-3 hover:text-ink'
            }`}
          >
            {Icon && <Icon aria-hidden="true" className="w-4 h-4" />}
            {text}
          </button>
        );
      })}
    </div>
  );
}
