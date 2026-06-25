import type { LedgerEntry } from '@/interface';

/** Client ledger, newest first. */
export function ledgerFor(ledger: LedgerEntry[], clientId: string): LedgerEntry[] {
  return ledger.filter((l) => l.clientId === clientId).slice().reverse();
}

/** Funds currently locked (approved but not yet captured) for a client. */
export function lockedFunds(ledger: LedgerEntry[], clientId: string): number {
  const locked = ledger
    .filter((l) => l.clientId === clientId && l.type === 'lock')
    .reduce((s, l) => s + Math.abs(l.amount), 0);
  const captured = ledger
    .filter((l) => l.clientId === clientId && l.type === 'capture')
    .reduce((s, l) => s + Math.abs(l.amount), 0);
  return locked - captured;
}
