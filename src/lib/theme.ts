/**
 * Light/dark theming. The chosen mode is persisted in localStorage and applied
 * as a `.dark` class on <html>. A tiny inline script in the root layout applies
 * the stored (or system) mode before first paint to avoid a flash.
 */
export type ThemeMode = 'light' | 'dark';

export const THEME_KEY = 'funlane_theme';

export function getStoredMode(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(THEME_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

export function systemMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Current mode from the actually-applied class (source of truth after paint). */
export function activeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function applyMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

export function setMode(mode: ThemeMode): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, mode);
  applyMode(mode);
}

/** Inline <script> body that applies the mode before paint (no FOUC). */
export const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem('${THEME_KEY}');if(m!=='light'&&m!=='dark'){m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.toggle('dark',m==='dark');}catch(e){}})();`;
