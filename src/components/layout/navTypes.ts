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
