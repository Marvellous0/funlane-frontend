'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useField } from 'formik';
import { ChevronsUpDown, Check, type LucideIcon } from 'lucide-react';
import { FieldShell, FloatingLabel, frameClass, controlClass, leadingIconClass } from './FieldShell';

/** Safe isomorphic useLayoutEffect (avoids SSR warning). */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
  /** @deprecated No longer used — all matches render (capped at MAX_RENDERED for perf). */
  limit?: number;
  strict?: boolean;
  id?: string;
}

function haystack(o: ComboOption) {
  return `${o.label} ${o.value} ${o.description ?? ''} ${o.badge ?? ''} ${o.keywords ?? ''}`.toLowerCase();
}

/**
 * All matches are shown in the scrollable list; this cap only bounds how many
 * DOM rows render at once so huge datasets (e.g. every world city) can't jank
 * the page. When it kicks in, a footer row invites the user to keep typing.
 */
const MAX_RENDERED = 100;

export function ComboboxField({
  name,
  label,
  options,
  icon: Icon,
  placeholder,
  hint,
  disabled,
  strict = false,
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
  const anchorRef = useRef<HTMLDivElement>(null);
  const [portalPos, setPortalPos] = useState<{ top: number; left: number; width: number } | null>(null);

  // Keep query text in sync when Formik value changes externally.
  const fieldValue = field.value;
  useEffect(() => {
    if (!focusedRef.current) setQuery(fieldValue ?? '');
  }, [fieldValue]);

  // Recompute portal position whenever the dropdown opens or the window scrolls/resizes.
  const updatePosition = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPortalPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!open) { setPortalPos(null); return; }
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  const { matches, totalMatches } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = !q
      ? options
      : options.filter((o) => { const h = haystack(o); return q.split(/\s+/).every((t) => h.includes(t)); });
    return { matches: filtered.slice(0, MAX_RENDERED), totalMatches: filtered.length };
  }, [query, options]);

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

  function handleInput(text: string) {
    if (strict) {
      setQuery(text);
      if (field.value) void helpers.setValue('');
    } else {
      commit(text);
    }
  }

  function handleBlur() {
    focusedRef.current = false;
    setOpen(false);
    if (strict) {
      // Snap free text to an exact option match, otherwise clear it.
      const q = query.trim().toLowerCase();
      const exact = q
        ? options.find((o) => o.value.toLowerCase() === q || o.label.toLowerCase() === q)
        : undefined;
      if (exact) {
        setQuery(exact.value);
        void helpers.setValue(exact.value);
      } else if (q !== (field.value ?? '').toLowerCase()) {
        setQuery('');
        void helpers.setValue('');
      }
    }
    void helpers.setTouched(true);
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

  const dropdown =
    open && portalPos
      ? createPortal(
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            style={{ position: 'fixed', top: portalPos.top, left: portalPos.left, width: portalPos.width }}
            className="z-[9999] max-h-72 overflow-y-auto rounded-xl border border-line bg-card shadow-lg py-1.5 animate-fade-in"
          >
            {matches.length === 0 ? (
              <li className="px-3.5 py-3 text-sm text-ink-3">No matches for \u201c{query.trim()}\u201d.</li>
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
            {totalMatches > matches.length && (
              <li aria-hidden="true" className="px-3.5 py-2.5 text-[11px] text-ink-3 border-t border-line">
                Showing {matches.length} of {totalMatches.toLocaleString()} — keep typing to narrow the list.
              </li>
            )}
          </ul>,
          document.body,
        )
      : null;

  return (
    <FieldShell error={showError ? meta.error : undefined} hint={hint}>
      <div ref={anchorRef} className="relative">
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
            onChange={(e) => { handleInput(e.target.value); setOpen(true); setActive(0); }}
            onFocus={() => { focusedRef.current = true; setOpen(true); }}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            className={`${controlClass} placeholder:text-transparent focus:placeholder:text-ink-3/50 ${Icon ? 'pl-11' : 'pl-4'} pr-10`}
          />
          {Icon && <Icon aria-hidden="true" className={leadingIconClass} />}
          <FloatingLabel htmlFor={inputId} hasIcon={!!Icon} error={showError}>
            {label}
          </FloatingLabel>
          <ChevronsUpDown aria-hidden="true" className="pointer-events-none absolute right-3.5 w-4 h-4 text-ink-3/70" />
        </div>
        {dropdown}
      </div>
    </FieldShell>
  );
}
