'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sun, Moon, Users, Palette, type LucideIcon } from 'lucide-react';
import { getOrgMode, setOrgMode, type ThemeMode } from '@/lib/theme';

type OrgThemeChoice = ThemeMode | 'user';

const CHOICES: { value: OrgThemeChoice; label: string; description: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', description: 'Force light mode on every portal.', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Force dark mode on every portal.', icon: Moon },
  { value: 'user', label: 'User choice', description: 'Each user picks their own theme.', icon: Users },
];

/**
 * Admin-only appearance control. Setting Light or Dark enforces that theme
 * across the landing page and the client, agent and admin portals, and hides
 * the personal theme toggles. "User choice" restores per-user preference.
 */
export function PortalThemeSettings() {
  const [choice, setChoice] = useState<OrgThemeChoice>('user');

  useEffect(() => {
    setChoice(getOrgMode() ?? 'user');
  }, []);

  function select(next: OrgThemeChoice) {
    setChoice(next);
    setOrgMode(next === 'user' ? null : next);
    toast.success(
      next === 'user'
        ? 'Users can now choose their own theme.'
        : `${next === 'dark' ? 'Dark' : 'Light'} mode is now enforced across all portals.`,
    );
  }

  return (
    <section className="bg-card rounded-2xl border border-line shadow-card overflow-hidden">
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <Palette aria-hidden="true" className="w-[18px] h-[18px]" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">Portal appearance</h2>
            <p className="text-sm text-ink-3 mt-0.5">
              Set the theme for every screen — landing, client, agent and admin. Choosing Light or
              Dark hides the personal theme toggles until you switch back to user choice.
            </p>
          </div>
        </div>

        <div role="radiogroup" aria-label="Portal theme" className="grid sm:grid-cols-3 gap-3">
          {CHOICES.map((c) => {
            const active = choice === c.value;
            return (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => select(c.value)}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  active
                    ? 'border-brand bg-brand-soft/60 ring-2 ring-brand-soft'
                    : 'border-line bg-surface hover:border-ink-3/40'
                }`}
              >
                <c.icon aria-hidden="true" className={`w-5 h-5 mb-2.5 ${active ? 'text-brand' : 'text-ink-3'}`} />
                <div className={`text-sm font-semibold ${active ? 'text-brand' : 'text-ink'}`}>{c.label}</div>
                <div className="text-xs text-ink-3 mt-1 leading-relaxed">{c.description}</div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-ink-3 leading-relaxed">
          Note: this setting is stored in the browser, so it applies to every account used on this
          device. Persisting it for all devices requires a backend organization-settings endpoint.
        </p>
      </div>
    </section>
  );
}
