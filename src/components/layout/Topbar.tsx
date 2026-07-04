'use client';

import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { FunlaneLogo, FunlaneMark } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { openCommandPalette } from '@/components/ui/CommandPalette';

interface TopbarProps {
  onToggleMenu: () => void;
  menuOpen?: boolean;
}

export function Topbar({ onToggleMenu, menuOpen = false }: TopbarProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-line flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMenu}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg text-ink hover:bg-surface transition-colors"
        >
          <span aria-hidden="true" className="w-5 h-0.5 bg-current rounded-full" />
          <span aria-hidden="true" className="w-5 h-0.5 bg-current rounded-full" />
          <span aria-hidden="true" className="w-5 h-0.5 bg-current rounded-full" />
        </button>

        {/* Wordmark on >=sm, compact mark on mobile */}
        <FunlaneLogo tone="dark" className="hidden sm:inline-flex" />
        <FunlaneMark className="w-9 h-9 sm:hidden" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command palette trigger */}
        <button
          onClick={openCommandPalette}
          aria-label="Open command palette"
          className="inline-flex items-center gap-2 h-9 rounded-lg border border-line text-ink-3 hover:text-ink hover:bg-surface transition-colors px-2.5 sm:pr-2"
        >
          <Search aria-hidden="true" className="w-[18px] h-[18px]" />
          <span className="hidden sm:inline text-xs">Search</span>
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-semibold bg-surface border border-line rounded px-1.5 py-0.5">⌘K</kbd>
        </button>

        <div className="hidden md:flex flex-col items-end text-right mr-1">
          <div className="font-semibold text-[13px] text-ink leading-tight">{user?.name}</div>
          <div className="text-[11px] text-ink-3">
            {user?.role === 'client' ? 'Client' : user?.role === 'admin' ? 'Administrator' : 'Agency Agent'}
          </div>
        </div>

        <ThemeToggle />

        <button
          onClick={signOut}
          className="h-9 px-3.5 flex items-center border border-line hover:border-ink-3 hover:bg-surface text-ink font-medium text-xs rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
