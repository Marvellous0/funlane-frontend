import { usePortalStore } from '@/store/usePortalStore';
import { simulate } from './client';

export function topUp(clientId: string, amount: number, method: string): Promise<void> {
  usePortalStore.getState().topUp(clientId, amount, method);
  return simulate(undefined, 1100);
}
