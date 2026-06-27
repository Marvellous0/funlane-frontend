import { useCallback, useEffect, useState } from 'react';
import { requestsApi, ApiError } from '@/api';
import type { AddQuoteOptionPayload, ApiRequestStatus, Pagination, RequestResponse } from '@/interface';
import { detailToVM, summaryToVM, type RequestVM } from '@/services/requestView';
import { toast } from 'react-toastify';

const msg = (err: unknown, fallback: string) =>
  err instanceof ApiError ? err.message : fallback;

interface ListParams {
  page?: number;
  limit?: number;
  status?: ApiRequestStatus;
  mine?: boolean;
}

/** Paginated request list — `mine` for clients, `queue` for agents. */
export function useRequestList(source: 'mine' | 'queue', initial: ListParams = { page: 1, limit: 50 }) {
  const [items, setItems] = useState<RequestVM[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ListParams>(initial);

  const load = useCallback(async (p: ListParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = source === 'mine' ? await requestsApi.listMine(p) : await requestsApi.queue(p);
      setItems(res.requests.map(summaryToVM));
      setPagination(res.pagination);
    } catch (err) {
      setError(msg(err, 'Could not load requests. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    load(params);
  }, [load, params]);

  return { items, pagination, loading, error, params, setParams, refresh: () => load(params) };
}

/** Single request + every state-transition action, shared by client & agent detail. */
export function useRequestDetail(id: string) {
  const [request, setRequest] = useState<RequestVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { request } = await requestsApi.getOne(id);
      setRequest(detailToVM(request));
    } catch (err) {
      setError(msg(err, 'Could not load this request.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const run = useCallback(async (fn: () => Promise<RequestResponse>, success: string): Promise<boolean> => {
    setBusy(true);
    try {
      const { request } = await fn();
      setRequest(detailToVM(request));
      toast.success(success);
      return true;
    } catch (err) {
      toast.error(msg(err, 'Something went wrong. Please try again.'));
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const addOption = useCallback(async (payload: AddQuoteOptionPayload): Promise<boolean> => {
    setBusy(true);
    try {
      await requestsApi.addOption(id, payload);
      await load();
      toast.success('Quote option added.');
      return true;
    } catch (err) {
      toast.error(msg(err, 'Could not add the option.'));
      return false;
    } finally {
      setBusy(false);
    }
  }, [id, load]);

  return {
    request,
    loading,
    error,
    busy,
    refresh: load,
    addOption,
    claim: () => run(() => requestsApi.claim(id), 'Request claimed.'),
    removeOption: (optionId: string) => run(() => requestsApi.removeOption(id, optionId), 'Option removed.'),
    sendOptions: () => run(() => requestsApi.sendOptions(id), 'Options sent to the client.'),
    approve: (optionId: string) => run(() => requestsApi.approve(id, optionId), 'Approved — funds locked.'),
    reject: (reason: string) => run(() => requestsApi.reject(id, reason), 'Sent back to the agent.'),
    cancel: (reason: string) => run(() => requestsApi.cancel(id, reason), 'Request cancelled — funds released.'),
    complete: () => run(() => requestsApi.complete(id), 'Marked complete — funds captured.'),
    uploadTicket: (file: File) => run(() => requestsApi.uploadTicket(id, file), 'Ticket uploaded.'),
  };
}
