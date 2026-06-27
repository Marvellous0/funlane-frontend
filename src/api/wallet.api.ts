import type {
  TransactionListResponse,
  WalletResponse,
} from '@/interface';
import { apiFetch } from './client';

/** GET /wallet/me — the authenticated client's balance + locked funds. */
export function myWallet(): Promise<WalletResponse> {
  return apiFetch<WalletResponse>('/wallet/me', { auth: true });
}

/** GET /wallet/me/transactions — the authenticated client's ledger. */
export function myTransactions(params?: { page?: number; limit?: number }): Promise<TransactionListResponse> {
  return apiFetch<TransactionListResponse>('/wallet/me/transactions', {
    auth: true,
    query: { page: params?.page, limit: params?.limit },
  });
}

/**
 * POST /wallet/topup/initialize — start a Paystack top-up. The backend returns
 * a checkout URL once enabled; until then it responds 503, whose message is
 * surfaced to the user verbatim.
 */
export function initializeTopup(amount: number): Promise<{ authorizationUrl?: string; reference?: string }> {
  return apiFetch('/wallet/topup/initialize', { method: 'POST', body: { amount }, auth: true });
}

/** GET /wallet/{userId} — any user's balance (admin / agent view). */
export function userWallet(userId: string): Promise<WalletResponse> {
  return apiFetch<WalletResponse>(`/wallet/${userId}`, { auth: true });
}

/** GET /wallet/{userId}/transactions — any user's ledger (admin / agent view). */
export function userTransactions(userId: string, params?: { page?: number; limit?: number }): Promise<TransactionListResponse> {
  return apiFetch<TransactionListResponse>(`/wallet/${userId}/transactions`, {
    auth: true,
    query: { page: params?.page, limit: params?.limit },
  });
}
