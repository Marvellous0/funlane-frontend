import type { NewOptionInput, NewRequestInput, TravelRequest } from '@/interface';
import { usePortalStore, type ApproveResult } from '@/store/usePortalStore';
import { simulate } from './client';

export function createRequest(input: NewRequestInput, clientId: string): Promise<TravelRequest> {
  const req = usePortalStore.getState().createRequest(input, clientId);
  return simulate(req, 400);
}

export function addOption(reqId: string, option: NewOptionInput): Promise<void> {
  usePortalStore.getState().addOption(reqId, option);
  return simulate(undefined, 200);
}

export function removeOption(optId: string): Promise<void> {
  usePortalStore.getState().removeOption(optId);
  return simulate(undefined, 150);
}

export function sendOptions(reqId: string): Promise<void> {
  usePortalStore.getState().sendOptions(reqId);
  return simulate(undefined, 400);
}

export function reopenForEditing(reqId: string): Promise<void> {
  usePortalStore.getState().reopenForEditing(reqId);
  return simulate(undefined, 200);
}

export function approveOption(reqId: string, optId: string): Promise<ApproveResult> {
  const result = usePortalStore.getState().approveOption(reqId, optId);
  return simulate(result, 450);
}

export function rejectRequest(reqId: string, reason: string): Promise<void> {
  usePortalStore.getState().rejectRequest(reqId, reason);
  return simulate(undefined, 300);
}

export function markCompleted(reqId: string, ticketFileName: string): Promise<void> {
  usePortalStore.getState().markCompleted(reqId, ticketFileName);
  return simulate(undefined, 450);
}
