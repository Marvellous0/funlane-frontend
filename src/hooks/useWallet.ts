import { useCallback, useEffect, useState } from 'react';
import { walletApi, ApiError } from '@/api';
import type { WalletView, WalletTransactionView } from '@/interface';
import { toast } from 'react-toastify';

/**
 * Live client wallet: balance + locked funds and the transaction ledger,
 * fetched from `/wallet/me`. `topUp` kicks off a Paystack checkout; until the
 * backend enables it, its API message (a 503) is surfaced verbatim.
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletView | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [w, t] = await Promise.all([
        walletApi.myWallet(),
        walletApi.myTransactions({ limit: 50 }),
      ]);
      setWallet(w.wallet);
      setTransactions(t.transactions);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load your wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const topUp = useCallback(async (amount: number): Promise<boolean> => {
    try {
      const res = await walletApi.initializeTopup(amount);
      if (res?.authorizationUrl) {
        window.location.href = res.authorizationUrl;
        return true;
      }
      toast.success('Top-up initialized.');
      await load();
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not start the top-up. Please try again.');
      return false;
    }
  }, [load]);

  return { wallet, transactions, loading, error, refresh: load, topUp };
}
