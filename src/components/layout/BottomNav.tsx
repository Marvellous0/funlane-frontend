'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavSection } from './navTypes';

export function BottomNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  // Flatten all items from all sections for the bottom nav (max 5).
  const items = sections.flatMap((s) => s.items).slice(0, 5);

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-line z-50 lg:hidden flex items-stretch justify-around px-1"
    >
          {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center gap-1 flex-1 relative transition-colors ${
              active ? 'text-brand' : 'text-ink-3'
            }`}
          >
            <span aria-hidden="true" className={`transition-transform flex items-center justify-center ${active ? 'scale-110 text-brand' : 'text-ink-3'}`}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge ? (
              <span className="absolute top-1.5 right-[22%] bg-red text-white text-[9px] min-w-[15px] h-[15px] flex items-center justify-center px-1 rounded-full font-semibold border border-white">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
