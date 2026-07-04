'use client';

import { useEffect, useId, useMemo, useRef, useState, type ElementType } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft, Moon, Sun, LogOut, FileText, Command as CommandIcon } from 'lucide-react';
import type { NavSection } from '@/components/layout/navTypes';
import { useAuth } from '@/hooks/useAuth';
import { activeMode, setMode } from '@/lib/theme';

/** Fire this to open the palette from anywhere (e.g. the Topbar search button). */
export const COMMAND_EVENT = 'funlane:command-palette';
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(COMMAND_EVENT));
}

export interface Command {
  id: string;
  label: string;
  /** Optional second line (e.g. a request's route). */
  description?: string;
  icon: ElementType;
  group: string;
  keywords?: string;
  perform: () => void;
}

/** A request match surfaced by the dynamic search provider. */
export interface RequestHit {
  id: string;
  ref: string;
  title: string;
  href: string;
}

interface CommandPaletteProps {
  /** Navigation targets — mirrors the sidebar, grouped by section title. */
  sections: NavSection[];
  /** Extra static quick actions (role-specific). */
  actions?: Command[];
  /** Query-driven request lookup (by ref/route). */
  onSearchRequests?: (query: string) => Promise<RequestHit[]>;
}

/**
 * ⌘K / Ctrl-K command palette. Fuzzy-searches navigation (from the sidebar
 * sections), quick actions, and — as you type — matching requests by ref/route.
 * Fully keyboard-driven per the WAI-ARIA combobox/listbox pattern; portals to
 * <body> and locks scroll.
 */
export function CommandPalette({ sections, actions, onSearchRequests }: CommandPaletteProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [reqCommands, setReqCommands] = useState<Command[]>([]);

  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setMounted(true), []);

  // Global open: ⌘K / Ctrl-K toggles; custom event (Topbar button) opens.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(COMMAND_EVENT, onEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(COMMAND_EVENT, onEvent);
    };
  }, []);

  // On open: reset, sync theme, lock scroll, focus input.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    setReqCommands([]);
    setIsDark(activeMode() === 'dark');
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      cancelAnimationFrame(id);
    };
  }, [open]);

  // Static commands: quick actions + navigation + appearance/session actions.
  const staticCommands = useMemo<Command[]>(() => {
    const nav: Command[] = sections.flatMap((s) =>
      s.items.map((it) => ({
        id: `nav:${it.href}`,
        label: it.label,
        icon: it.icon,
        group: s.title,
        keywords: `go to ${it.label} ${it.href}`,
        perform: () => router.push(it.href),
      })),
    );

    const appearance: Command[] = [
      {
        id: 'action:theme',
        label: isDark ? 'Switch to light mode' : 'Switch to dark mode',
        icon: isDark ? Sun : Moon,
        group: 'Actions',
        keywords: 'theme dark light appearance',
        perform: () => setMode(isDark ? 'light' : 'dark'),
      },
      {
        id: 'action:signout',
        label: 'Sign out',
        icon: LogOut,
        group: 'Actions',
        keywords: 'logout log out leave',
        perform: () => signOut(),
      },
    ];

    return [...(actions ?? []), ...nav, ...appearance];
  }, [sections, actions, isDark, router, signOut]);

  const filteredStatic = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staticCommands;
    const terms = q.split(/\s+/);
    return staticCommands.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [staticCommands, query]);

  // Dynamic request lookup (debounced), mapped to navigate commands.
  useEffect(() => {
    if (!onSearchRequests) return;
    const q = query.trim();
    if (!q) {
      setReqCommands([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const hits = await onSearchRequests(q);
        if (cancelled) return;
        setReqCommands(
          hits.map((h) => ({
            id: `req:${h.id}`,
            label: h.ref,
            description: h.title,
            icon: FileText,
            group: 'Requests',
            perform: () => router.push(h.href),
          })),
        );
      } catch {
        if (!cancelled) setReqCommands([]);
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, onSearchRequests, router]);

  const results = useMemo(() => [...reqCommands, ...filteredStatic], [reqCommands, filteredStatic]);

  // Keep the active index in range as the list changes.
  useEffect(() => {
    setActive((i) => (i >= results.length ? 0 : i));
  }, [results.length]);

  // Scroll the highlighted row into view.
  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  if (!open || !mounted) return null;

  function run(cmd?: Command) {
    if (!cmd) return;
    cmd.perform();
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  }

  // Group while preserving order so indices stay correct.
  const groups: { title: string; items: { cmd: Command; idx: number }[] }[] = [];
  results.forEach((cmd, idx) => {
    const g = groups.find((x) => x.title === cmd.group);
    if (g) g.items.push({ cmd, idx });
    else groups.push({ title: cmd.group, items: [{ cmd, idx }] });
  });

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-card border border-line rounded-2xl shadow-lg overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search aria-hidden="true" className="w-[18px] h-[18px] text-ink-3 shrink-0" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-opt-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            placeholder="Search or jump to…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent py-4 text-sm text-ink placeholder:text-ink-3/70 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-ink-3 bg-surface border border-line rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <ul ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-ink-3">No results for “{query.trim()}”.</li>
          ) : (
            groups.map((group) => (
              <li key={group.title} role="presentation">
                <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-3">{group.title}</div>
                <ul role="presentation">
                  {group.items.map(({ cmd, idx }) => {
                    const Icon = cmd.icon;
                    return (
                      <li
                        key={cmd.id}
                        id={`${listId}-opt-${idx}`}
                        data-idx={idx}
                        role="option"
                        aria-selected={idx === active}
                        onMouseEnter={() => setActive(idx)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => run(cmd)}
                        className={`mx-2 flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${idx === active ? 'bg-brand-soft/70' : ''}`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${idx === active ? 'bg-brand text-white' : 'bg-surface text-ink-3'}`}>
                          <Icon aria-hidden="true" className="w-4 h-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink truncate">{cmd.label}</span>
                          {cmd.description && <span className="block text-[11px] text-ink-3 truncate">{cmd.description}</span>}
                        </span>
                        {idx === active && <CornerDownLeft aria-hidden="true" className="w-4 h-4 text-ink-3 shrink-0" />}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-line bg-surface text-[11px] text-ink-3">
          <span className="inline-flex items-center gap-1"><CommandIcon aria-hidden="true" className="w-3 h-3" />K to toggle</span>
          <span className="inline-flex items-center gap-1"><CornerDownLeft aria-hidden="true" className="w-3 h-3" /> to select</span>
          <span className="hidden sm:inline">↑↓ to navigate</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
