import { useEffect, useState } from 'react';
import { usePortalStore } from '@/store/usePortalStore';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Returns true once both persisted stores have rehydrated from localStorage.
 * Components gate on this to avoid SSR/client hydration mismatches.
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const check = () =>
      usePortalStore.persist.hasHydrated() && useAuthStore.persist.hasHydrated();

    if (check()) {
      setHydrated(true);
      return;
    }
    const unsubA = usePortalStore.persist.onFinishHydration(() => check() && setHydrated(true));
    const unsubB = useAuthStore.persist.onFinishHydration(() => check() && setHydrated(true));
    return () => {
      unsubA();
      unsubB();
    };
  }, []);

  return hydrated;
}
