'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavSection } from './navTypes';
import { bestMatchHref } from './navTypes';

interface SidebarProps {
  sections: NavSection[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ sections, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const activeHref = bestMatchHref(sections, pathname);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-16 left-0 h-[calc(100vh-64px)] lg:h-full w-64 shrink-0 bg-card border-r border-line z-[70] lg:z-auto transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <nav aria-label="Primary" className="p-4 flex flex-col gap-7 h-full overflow-y-auto">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-[11px] uppercase tracking-wider font-semibold text-ink-3 mb-2 px-3">
                {section.title}
              </h2>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = item.href === activeHref;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium text-sm transition-colors ${active
                            ? 'bg-brand-soft text-brand'
                            : 'text-ink-2 hover:bg-surface hover:text-ink'
                          }`}
                      >
                        <span aria-hidden="true" className="flex items-center justify-center w-5">
                          <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge ? (
                          <span
                            className={`min-w-[20px] text-center text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-brand text-white' : 'bg-surface text-ink-3 border border-line'
                              }`}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
