'use client';

import { useState, type ReactNode } from 'react';
import type { NavSection } from './navTypes';
import type { Role } from '@/interface';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { SessionTimeout } from '../security/SessionTimeout';
import { useAuthStore } from '@/store/useAuthStore';
import { useHydration } from '@/hooks/useHydration';
import { homePathFor } from '@/services/auth.service';
import { ConciergeAssistant } from '../ui/ConciergeAssistant';
import { FunlaneMark } from '../ui/Logo';

interface DashboardShellProps {
  role: Role;
  sections: NavSection[];
  children: ReactNode;
}

export function DashboardShell({ role, sections, children }: DashboardShellProps) {
  const hydrated = useHydration();
  const user = useAuthStore((s) => s.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!hydrated || !user || user.role !== role) {
    return (
      <div className="grid place-items-center min-h-screen bg-surface text-ink-3">
        <div className="flex flex-col items-center gap-4">
          <FunlaneMark className="w-12 h-12 animate-pulse" />
          <span className="text-sm font-medium">Loading Funlane…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <Topbar menuOpen={mobileMenuOpen} onToggleMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar + Mobile Drawer */}
        <Sidebar 
          sections={sections} 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
        
        {/* Main View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full animate-fade-in relative z-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav sections={sections} />

      <SessionTimeout />
      <ConciergeAssistant />
    </div>
  );
}
