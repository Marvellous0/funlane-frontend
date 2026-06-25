'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import type { NavSection } from '@/components/layout/navTypes';
import { usePortalStore } from '@/store/usePortalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { clientRequests } from '@/services/request.service';

import { LayoutDashboard, Plane, ClipboardList, Bell, CreditCard } from 'lucide-react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const requests = usePortalStore((s) => s.requests);

  const reqs = clientRequests(requests, userId);
  const needsReview = reqs.filter((r) => r.status === 'quoted').length;

  const sections: NavSection[] = [
    {
      title: 'Client',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/client/dashboard' },
        { label: 'New Request', icon: Plane, href: '/client/new' },
        { label: 'My Requests', icon: ClipboardList, href: '/client/requests', badge: reqs.length },
        { label: 'Review Options', icon: Bell, href: '/client/review', badge: needsReview || undefined },
      ],
    },
    {
      title: 'Account',
      items: [{ label: 'Wallet', icon: CreditCard, href: '/client/wallet' }],
    },
  ];

  return (
    <DashboardShell role="client" sections={sections}>
      {children}
    </DashboardShell>
  );
}
