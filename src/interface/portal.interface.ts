import type { Client, Agent } from './user.interface';
import type { TravelRequest } from './request.interface';
import type { LedgerEntry } from './wallet.interface';

/** The full persisted portal dataset (mirrors the old in-memory STATE). */
export interface PortalData {
  clients: Client[];
  agents: Agent[];
  requests: TravelRequest[];
  ledger: LedgerEntry[];
  refSeq: number;
}
