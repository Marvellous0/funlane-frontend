import type { ReactNode, ElementType } from 'react';
export interface NavLink {
  label: string;
  icon: ElementType;
  href: string;
  badge?: number | string;
}

export interface NavSection {
  title: string;
  items: NavLink[];
}

/**
 * Returns the href of the single nav item that best matches the current path.
 * Uses longest-prefix matching so an index route (e.g. `/admin`) doesn't stay
 * highlighted on deeper routes (e.g. `/admin/users`) — only the most specific
 * match wins.
 */
export function bestMatchHref(sections: NavSection[], pathname: string): string | undefined {
  return sections
    .flatMap((s) => s.items)
    .map((i) => i.href)
    .filter((href) => pathname === href || pathname.startsWith(href + '/'))
    .sort((a, b) => b.length - a.length)[0];
}
