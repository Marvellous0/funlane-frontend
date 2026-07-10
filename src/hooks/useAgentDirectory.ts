'use client';

import { useEffect, useState } from 'react';
import { usersApi } from '@/api';
import type { AdminUserView } from '@/interface';

/**
 * Agent directory for resolving `assignedAgentId` to a human name on admin
 * screens. Backed by the ADMIN-scoped users API, so use it only in admin
 * containers. Cached at module level — one fetch per session regardless of
 * how many components mount it.
 */

let cache: AdminUserView[] | null = null;
let inflight: Promise<AdminUserView[]> | null = null;

export function useAgentDirectory() {
  const [agents, setAgents] = useState<AdminUserView[]>(cache ?? []);

  useEffect(() => {
    if (cache) return;
    inflight ??= usersApi.listUsers({ role: 'AGENT', limit: 100 }).then((res) => (cache = res.users));
    let alive = true;
    inflight.then((list) => alive && setAgents(list)).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /** Name for an agent id; falls back to a short id while loading/unknown. */
  function agentName(id: string | null | undefined): string | null {
    if (!id) return null;
    return agents.find((a) => a.id === id)?.name ?? `Agent ${id.slice(0, 8)}`;
  }

  return { agents, agentName };
}
