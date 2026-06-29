'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useHydration } from '@/hooks/useHydration';
import { FunlaneMark } from '@/components/ui/Logo';

/**
 * Canonical entry point for a request deep-link (e.g. the "review your quote"
 * email points at `/requests/{id}`). It forwards the visitor into their own
 * role area — `/client|agent|admin/requests/{id}` — or, if signed out, stashes
 * the destination and sends them to sign in so they land here afterwards.
 */
export function RequestRedirectContainer({ id }: { id: string }) {
  const router = useRouter();
  const hydrated = useHydration();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      router.replace(`/${user.role}/requests/${id}`);
    } else {
      try {
        sessionStorage.setItem('funlane-next', `/requests/${id}`);
      } catch {
        /* ignore storage failures */
      }
      router.replace('/login');
    }
  }, [hydrated, user, id, router]);

  return (
    <div className="grid place-items-center min-h-screen bg-surface text-ink-3">
      <div className="flex flex-col items-center gap-4">
        <FunlaneMark className="w-12 h-12 animate-pulse" />
        <span className="text-sm font-medium">Opening your request…</span>
      </div>
    </div>
  );
}
