import { useCallback } from 'react';
import { usePortalStore } from '@/store/usePortalStore';
import { walletApi } from '@/api';
import { ledgerFor, lockedFunds } from '@/services/wallet.service';
import { useToast } from './useToast';
import { fmtNaira } from '@/utils/format';
import { AlertCircle, CreditCard, CheckCircle, Coins } from 'lucide-react';

export function useWallet(clientId: string | undefined) {
  const clients = usePortalStore((s) => s.clients);
  const ledger = usePortalStore((s) => s.ledger);
  const { toast } = useToast();

  const client = clients.find((c) => c.id === clientId);
  const transactions = clientId ? ledgerFor(ledger, clientId) : [];
  const locked = clientId ? lockedFunds(ledger, clientId) : 0;
  const topUp = useCallback(
    async (amount: number, method: string) => {
      if (!clientId || !amount) {
        toast({ title: 'Enter an amount', icon: AlertCircle });
        return;
      }
      toast({ title: 'Paystack checkout…', msg: 'Verifying payment via webhook', icon: CreditCard });
      await walletApi.topUp(clientId, amount, method);
      toast({ title: 'Top-up confirmed', msg: `${fmtNaira(amount)} added to your wallet.`, icon: Coins });
    },
    [clientId, toast],
  );

  return { client, transactions, locked, topUp };
}
