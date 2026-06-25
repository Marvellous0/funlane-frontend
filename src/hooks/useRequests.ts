import { useCallback } from 'react';
import type { NewOptionInput, NewRequestInput, TravelRequest } from '@/interface';
import { usePortalStore } from '@/store/usePortalStore';
import { requestsApi } from '@/api';
import { useToast } from './useToast';
import { fmtNaira } from '@/utils/format';
import { CheckCircle2, Send, Lock, Undo2, Ticket } from 'lucide-react';

/** Read + mutate travel requests, wiring store actions to user-facing toasts. */
export function useRequests() {
  const requests = usePortalStore((s) => s.requests);
  const agents = usePortalStore((s) => s.agents);
  const { toast, notifyClient } = useToast();

  const byId = useCallback(
    (id: string): TravelRequest | undefined => requests.find((r) => r.id === id),
    [requests],
  );

  const createRequest = useCallback(
    async (input: NewRequestInput, clientId: string) => {
      const req = await requestsApi.createRequest(input, clientId);
      toast({ title: 'Request submitted', msg: `${req.ref} is now in the Funlane agent queue.`, icon: CheckCircle2 });
      return req;
    },
    [toast],
  );

  const addOption = useCallback((reqId: string, option: NewOptionInput) => requestsApi.addOption(reqId, option), []);
  const removeOption = useCallback((optId: string) => requestsApi.removeOption(optId), []);

  const sendOptions = useCallback(
    async (req: TravelRequest) => {
      await requestsApi.sendOptions(req.id);
      notifyClient(req.clientName, 'Your travel options are ready for review', `${req.options.length} options for ${req.from} → ${req.to}`);
      toast({ title: 'Options sent', msg: 'Client notified by email & SMS.', icon: Send });
    },
    [toast, notifyClient],
  );

  const reopenForEditing = useCallback((reqId: string) => requestsApi.reopenForEditing(reqId), []);

  const approveOption = useCallback(
    async (req: TravelRequest, optId: string) => {
      const opt = req.options.find((o) => o.id === optId);
      const result = await requestsApi.approveOption(req.id, optId);
      if (!result.ok) return result;
      toast({
        title: 'Approved & funds locked',
        msg: `${fmtNaira(opt?.price ?? 0)} reserved. Funlane is issuing your ticket.`,
        icon: Lock,
      });
      return result;
    },
    [toast],
  );

  const rejectRequest = useCallback(
    async (reqId: string, reason: string) => {
      await requestsApi.rejectRequest(reqId, reason);
      toast({ title: 'Sent back to agent', msg: 'They will propose alternative routes.', icon: Undo2 });
    },
    [toast],
  );

  const markCompleted = useCallback(
    async (req: TravelRequest, ticketFileName: string) => {
      const opt = req.options.find((o) => o.id === req.selectedOptionId);
      await requestsApi.markCompleted(req.id, ticketFileName);
      notifyClient(req.clientName, 'Your ticket has been issued', `${opt?.airline ?? ''} ${opt?.flightNo ?? ''} — PDF attached`);
      toast({ title: 'Completed', msg: 'Funds captured, agency paid, ticket emailed.', icon: Ticket });
    },
    [toast, notifyClient],
  );

  return {
    requests,
    agents,
    byId,
    createRequest,
    addOption,
    removeOption,
    sendOptions,
    reopenForEditing,
    approveOption,
    rejectRequest,
    markCompleted,
  };
}
