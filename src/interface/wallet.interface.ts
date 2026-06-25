export type LedgerType = 'topup' | 'lock' | 'capture' | 'release';

export interface LedgerEntry {
  id: string;
  clientId: string;
  type: LedgerType;
  /** Positive for credits (top-up), negative for debits (lock). */
  amount: number;
  balanceAfter: number;
  note: string;
  ts: string;
}

export type PaymentMethod = 'Card' | 'Bank transfer' | 'USSD';
