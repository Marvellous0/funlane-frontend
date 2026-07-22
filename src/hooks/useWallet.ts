import { useCallback, useEffect, useState } from 'react';
import { walletApi, ApiError } from '@/api';
import type { WalletView, WalletTransactionView, Pagination } from '@/interface';
import { toast } from 'react-toastify';

interface TxnParams {
  page: number;
  limit: number;
}

const DEFAULT_TXN_PARAMS: TxnParams = { page: 1, limit: 10 };

/**
 * Live client wallet: balance + locked funds (fetched once) and a paginated
 * transaction ledger from `/wallet/me/transactions`, which can hold far more
 * rows than fit on one page. `topUp` kicks off a Paystack checkout; until the
 * backend enables it, its API message (a 503) is surfaced verbatim.
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletView | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionView[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [txnParams, setTxnParams] = useState<TxnParams>(DEFAULT_TXN_PARAMS);
  const [loading, setLoading] = useState(true);
  const [txnLoading, setTxnLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    setLoading(true);
    try {
      const w = await walletApi.myWallet();
      setWallet(w.wallet);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load your wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTransactions = useCallback(async (params: TxnParams) => {
    setTxnLoading(true);
    try {
      const t = await walletApi.myTransactions(params);
      setTransactions(t.transactions);
      setPagination(t.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load your transactions. Please try again.');
    } finally {
      setTxnLoading(false);
    }
  }, []);

  // Balance loads once (plus on an explicit refresh); the ledger reloads
  // whenever the page or page size changes.
  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  useEffect(() => {
    loadTransactions(txnParams);
  }, [loadTransactions, txnParams]);

  const refresh = useCallback(() => {
    loadWallet();
    loadTransactions(txnParams);
  }, [loadWallet, loadTransactions, txnParams]);

  const topUp = useCallback(async (amount: number): Promise<boolean> => {
    try {
      const res = await walletApi.initializeTopup(amount);
      if (res?.authorizationUrl) {
        window.location.href = res.authorizationUrl;
        return true;
      }
      toast.success('Top-up initialized.');
      refresh();
      return true;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not start the top-up. Please try again.');
      return false;
    }
  }, [refresh]);

  return {
    wallet,
    transactions,
    pagination,
    txnParams,
    setTxnParams,
    loading,
    txnLoading,
    error,
    refresh,
    topUp,
  };
}
