'use client';

import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import type { NavSection } from '@/components/layout/navTypes';
import { usePortalStore } from '@/store/usePortalStore';
import { useShallow } from 'zustand/react/shallow';
import { agentStats } from '@/services/request.service';

import { FolderKanban, Ticket, ClipboardList, ShieldCheck, Users } from 'lucide-react';

export default function AgentLayout({ children }: { children: ReactNode }) {
  const data = usePortalStore(useShallow((s) => ({ clients: s.clients, agents: s.agents, requests: s.requests, ledger: s.ledger, refSeq: s.refSeq })));
  const stats = agentStats(data);

  const sections: NavSection[] = [
    {
      title: 'Agency',
      items: [
        { label: 'Request Queue', icon: FolderKanban, href: '/agent/board', badge: stats.newRequests || undefined },
        { label: 'Ready to Issue', icon: Ticket, href: '/agent/issue', badge: stats.readyToIssue || undefined },
        { label: 'All Requests', icon: ClipboardList, href: '/agent/list', badge: stats.total },
      ],
    },
    {
      title: 'Governance',
      items: [
        { label: 'Security Audit', icon: ShieldCheck, href: '/agent/audit' },
        { label: 'Clients & Wallets', icon: Users, href: '/agent/clients' },
      ],
    },
  ];

  return (
    <DashboardShell role="agent" sections={sections}>
      {children}
    </DashboardShell>
  );
}
