'use client';

import { useCallback, useRef } from 'react';
import { requestsApi } from '@/api';
import { summaryToVM } from '@/services/requestView';
import { routeText } from '@/utils/request.utils';
import type { Role } from '@/interface';

export interface RequestHit {
  id: string;
  ref: string;
  title: string;
  href: string;
}

function detailHref(role: Role, id: string): string {
  if (role === 'agent') return `/agent/requests/${id}`;
  if (role === 'admin') return `/admin/requests/${id}`;
  return `/client/requests/${id}`;
}

/**
 * Returns a search function for the command palette that finds requests by ref
 * or route. The user's list is fetched once (per role) on first use and cached,
 * then filtered client-side — so keystrokes don't hit the network.
 */
export function useRequestSearch(role: Role) {
  const cacheRef = useRef<RequestHit[] | null>(null);
  const inflightRef = useRef<Promise<RequestHit[]> | null>(null);

  return useCallback(
    async (query: string): Promise<RequestHit[]> => {
      const q = query.trim().toLowerCase();
      if (!q) return [];

      if (!cacheRef.current) {
        if (!inflightRef.current) {
          inflightRef.current = (async () => {
            const res =
              role === 'agent'
                ? await requestsApi.queue({ limit: 100 })
                : role === 'admin'
                  ? await requestsApi.listAll({ limit: 100 })
                  : await requestsApi.listMine({ limit: 100 });
            return res.requests.map(summaryToVM).map((vm) => ({
              id: vm.id,
              ref: vm.ref,
              title: routeText(vm),
              href: detailHref(role, vm.id),
            }));
          })().catch(() => [] as RequestHit[]);
        }
        cacheRef.current = await inflightRef.current;
      }

      return cacheRef.current.filter((h) => `${h.ref} ${h.title}`.toLowerCase().includes(q)).slice(0, 5);
    },
    [role],
  );
}
