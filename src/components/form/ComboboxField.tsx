'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useField } from 'formik';
import { ChevronsUpDown, Check, type LucideIcon } from 'lucide-react';
import { FieldShell, FloatingLabel, frameClass, controlClass, leadingIconClass } from './FieldShell';

export interface ComboOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  keywords?: string;
}

interface ComboboxFieldProps {
  name: string;
  label: string;
  options: ComboOption[];
  icon?: LucideIcon;
  placeholder?: string;
  hint?: React.ReactNode;
  disabled?: boolean;
  /** Cap on rendered matches. Defaults to 8. */
  limit?: number;
  id?: string;
}

function haystack(o: ComboOption) {
  return `${o.label} ${o.value} ${o.description ?? ''} ${o.badge ?? ''} ${o.keywords ?? ''}`.toLowerCase();
}

/**
 * Accessible airport/city autocomplete. Formik holds the free-text value (so
 * the existing string schema keeps working), while the dropdown assists with
 * canonical picks. Selecting an option commits its `value`; typing commits the
 * raw text. Fully keyboard-driven per the WAI-ARIA combobox pattern.
 */
export function ComboboxField({
  name,
  label,
  options,
  icon: Icon,
  placeholder,
  hint,
  disabled,
  limit = 8,
  id,
}: ComboboxFieldProps) {
  const [field, meta, helpers] = useField<string>(name);
  const [query, setQuery] = useState(field.value ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const focusedRef = useRef(false);

  const inputId = id ?? name;
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!focusedRef.current && field.value !== query) setQuery(field.value ?? '');
  }, [field.value]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, limit);
    const terms = q.split(/\s+/);
    return options.filter((o) => { const h = haystack(o); return terms.every((t) => h.includes(t)); }).slice(0, limit);
  }, [query, options, limit]);

  // Scroll the highlighted row into view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const showError = meta.touched && !!meta.error;
  const tone = showError ? 'error' : meta.touched && !meta.error && (field.value ?? '').trim() !== '' ? 'valid' : 'default';

  function commit(text: string) {
    setQuery(text);
    void helpers.setValue(text);
  }

  function selectOption(o: ComboOption) {
    commit(o.value);
    setOpen(false);
    void helpers.setTouched(true, false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setActive((i) => (matches.length ? (i + 1) % matches.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setActive((i) => (matches.length ? (i - 1 + matches.length) % matches.length : 0));
    } else if (e.key === 'Enter') {
      if (open && matches[active]) { e.preventDefault(); selectOption(matches[active]); }
    } else if (e.key === 'Escape') {
      if (open) { e.preventDefault(); setOpen(false); }
    }
  }

  const activeId = open && matches[active] ? `${listId}-opt-${active}` : undefined;

  return (
    <FieldShell error={showError ? meta.error : undefined} hint={hint}>
      <div className="relative">
        <div className={frameClass(tone)}>
          <input
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            aria-invalid={showError || undefined}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder ?? ' '}
            value={query}
            onChange={(e) => { commit(e.target.value); setOpen(true); setActive(0); }}
            onFocus={() => { focusedRef.current = true; setOpen(true); }}
            onBlur={() => { focusedRef.current = false; setOpen(false); void helpers.setTouched(true); }}
            onKeyDown={onKeyDown}
            className={`${controlClass} placeholder:text-transparent focus:placeholder:text-ink-3/50 ${Icon ? 'pl-11' : 'pl-4'} pr-10`}
          />
          {Icon && <Icon aria-hidden="true" className={leadingIconClass} />}
          <FloatingLabel htmlFor={inputId} hasIcon={!!Icon} error={showError}>
            {label}
          </FloatingLabel>
          <ChevronsUpDown aria-hidden="true" className="pointer-events-none absolute right-3.5 w-4 h-4 text-ink-3/70" />
        </div>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto rounded-xl border border-line bg-card shadow-lg py-1.5 animate-fade-in"
          >
            {matches.length === 0 ? (
              <li className="px-3.5 py-3 text-sm text-ink-3">No matches for “{query.trim()}”.</li>
            ) : (
              matches.map((o, i) => {
                const selected = field.value === o.value;
                return (
                  <li
                    key={o.value}
                    id={`${listId}-opt-${i}`}
                    data-idx={i}
                    role="option"
                    aria-selected={selected}
                    // Keep focus on the input so blur doesn't close before click.
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => selectOption(o)}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${i === active ? 'bg-brand-soft/70' : 'hover:bg-surface'}`}
                  >
                    {o.badge && (
                      <span className="shrink-0 w-11 text-center text-[11px] font-semibold tracking-wide text-brand bg-brand-soft rounded-md py-1">
                        {o.badge}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink truncate">{o.label}</span>
                      {o.description && <span className="block text-[11px] text-ink-3 truncate">{o.description}</span>}
                    </span>
                    {selected && <Check aria-hidden="true" className="shrink-0 w-4 h-4 text-brand" />}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </FieldShell>
  );
}
