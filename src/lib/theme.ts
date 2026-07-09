/**
 * Light/dark theming with two layers:
 *
 * 1. Personal preference — persisted per user in localStorage (THEME_KEY) and
 *    toggled from the UI.
 * 2. Organization override — set by an admin in Settings (ORG_THEME_KEY).
 *    When present it wins over the personal preference on every portal
 *    (landing, client, agent, admin), and the user-facing toggles hide.
 *
 * The chosen mode is applied as a `.dark` class on <html>. A tiny inline
 * script in the root layout applies the effective mode before first paint to
 * avoid a flash.
 */
export type ThemeMode = 'light' | 'dark';

export const THEME_KEY = 'funlane_theme';
export const ORG_THEME_KEY = 'funlane_org_theme';

function readMode(key: string): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(key);
  return v === 'light' || v === 'dark' ? v : null;
}

export function getStoredMode(): ThemeMode | null {
  return readMode(THEME_KEY);
}

/** Admin-enforced portal theme, or null when users may choose their own. */
export function getOrgMode(): ThemeMode | null {
  return readMode(ORG_THEME_KEY);
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

/** Org override → personal preference → system preference. */
export function effectiveMode(): ThemeMode {
  return getOrgMode() ?? getStoredMode() ?? systemMode();
}

export function applyMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

/** Persists the user's personal preference. No-op visually if an org override is active. */
export function setMode(mode: ThemeMode): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(THEME_KEY, mode);
  applyMode(getOrgMode() ?? mode);
}

/** Admin: force a portal-wide theme, or pass null to restore user choice. */
export function setOrgMode(mode: ThemeMode | null): void {
  if (typeof window === 'undefined') return;
  if (mode === null) window.localStorage.removeItem(ORG_THEME_KEY);
  else window.localStorage.setItem(ORG_THEME_KEY, mode);
  applyMode(effectiveMode());
}

/** Inline <script> body that applies the effective mode before paint (no FOUC). */
export const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem('${ORG_THEME_KEY}');if(m!=='light'&&m!=='dark'){m=localStorage.getItem('${THEME_KEY}');}if(m!=='light'&&m!=='dark'){m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.toggle('dark',m==='dark');}catch(e){}})();`;
