import type { Client, FlightOption, PortalData, TravelRequest } from '@/interface';
import { lockedFunds } from './wallet.service';

export function clientRequests(requests: TravelRequest[], clientId: string): TravelRequest[] {
  return requests.filter((r) => r.clientId === clientId);
}

export function canAfford(client: Client, option: FlightOption): boolean {
  return client.wallet >= option.price;
}

export function agentName(agents: PortalData['agents'], id: string): string {
  const a = agents.find((x) => x.id === id);
  return a ? a.name : 'Unassigned';
}

export interface ClientStats {
  wallet: number;
  locked: number;
  active: number;
  needsReview: number;
}

export function clientStats(data: PortalData, clientId: string): ClientStats {
  const client = data.clients.find((c) => c.id === clientId);
  const reqs = clientRequests(data.requests, clientId);
  return {
    wallet: client?.wallet ?? 0,
    locked: lockedFunds(data.ledger, clientId),
    active: reqs.filter((r) => r.status !== 'issued').length,
    needsReview: reqs.filter((r) => r.status === 'quoted').length,
  };
}

export interface AgentStats {
  newRequests: number;
  readyToIssue: number;
  total: number;
}

export function agentStats(data: PortalData): AgentStats {
  return {
    newRequests: data.requests.filter((r) => r.status === 'pending').length,
    readyToIssue: data.requests.filter((r) => r.status === 'approved').length,
    total: data.requests.length,
  };
}
