import type {
  AddQuoteOptionPayload,
  ApiRequestStatus,
  PassengerInput,
  QuoteOptionResponse,
  RequestListResponse,
  RequestResponse,
  ApiBudgetTier,
} from '@/interface';
import { apiFetch } from './client';

export interface CreateRequestInput {
  /** Required when an ADMIN creates a request on a client's behalf. */
  clientId?: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  budgetTier: ApiBudgetTier;
  preferredAirline?: string;
  preferredTime?: string;
  passengers: PassengerInput[];
  passportDocs: File[];
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: ApiRequestStatus;
}

/** POST /requests — multipart: trip fields + passengers JSON + one scan per passenger. */
export function createRequest(input: CreateRequestInput): Promise<RequestResponse> {
  const fd = new FormData();
  if (input.clientId) fd.set('clientId', input.clientId);
  fd.set('origin', input.origin);
  fd.set('destination', input.destination);
  fd.set('departureDate', input.departureDate);
  if (input.returnDate) fd.set('returnDate', input.returnDate);
  fd.set('budgetTier', input.budgetTier);
  if (input.preferredAirline) fd.set('preferredAirline', input.preferredAirline);
  if (input.preferredTime) fd.set('preferredTime', input.preferredTime);
  fd.set('passengers', JSON.stringify(input.passengers));
  input.passportDocs.forEach((file) => fd.append('passportDocs', file));
  return apiFetch<RequestResponse>('/requests', { method: 'POST', body: fd, auth: true });
}

/** GET /requests — ADMIN: list/search every request, filterable by status, client or agent. */
export function listAll(
  params: ListParams & { clientId?: string; assignedAgentId?: string } = {},
): Promise<RequestListResponse> {
  return apiFetch<RequestListResponse>('/requests', {
    auth: true,
    query: {
      page: params.page,
      limit: params.limit,
      status: params.status,
      clientId: params.clientId,
      assignedAgentId: params.assignedAgentId,
    },
  });
}

/** GET /requests/mine — the authenticated client's own requests. */
export function listMine(params: ListParams = {}): Promise<RequestListResponse> {
  return apiFetch<RequestListResponse>('/requests/mine', {
    auth: true,
    query: { page: params.page, limit: params.limit, status: params.status },
  });
}

/** GET /requests/queue — the shared agent queue. `mine` filters to claimed-by-me. */
export function queue(params: ListParams & { mine?: boolean } = {}): Promise<RequestListResponse> {
  return apiFetch<RequestListResponse>('/requests/queue', {
    auth: true,
    query: { page: params.page, limit: params.limit, status: params.status, mine: params.mine },
  });
}

/** GET /requests/{id} */
export function getOne(id: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}`, { auth: true });
}

/**
 * POST /requests/{id}/claim — AGENT only (atomic: fails if no longer PENDING
 * and unassigned). Admins must use `assignAgent` instead.
 */
export function claim(id: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/claim`, { method: 'POST', auth: true });
}

/**
 * PATCH /requests/{id}/assign — ADMIN: reassign or unassign the agent,
 * bypassing the normal claim rule. Pass `null` to return the request to the
 * shared queue. Blocked once COMPLETED or CANCELLED.
 */
export function assignAgent(id: string, agentId: string | null): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/assign`, { method: 'PATCH', body: { agentId }, auth: true });
}

/**
 * POST /requests/{id}/admin-cancel — ADMIN: force-cancel any PENDING,
 * OPTIONS_SENT or APPROVED_LOCKED request regardless of owner, releasing any
 * locked wallet funds. Blocked once ISSUED, COMPLETED or CANCELLED.
 */
export function adminCancel(id: string, reason: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/admin-cancel`, { method: 'POST', body: { reason }, auth: true });
}

/**
 * PATCH /requests/{id}/status — ADMIN: force the request directly into any
 * status. Bypasses the state machine and does NOT lock/release/capture wallet
 * funds — reconcile the wallet manually when crossing an
 * APPROVED_LOCKED/COMPLETED boundary.
 */
export function forceStatus(id: string, status: ApiRequestStatus): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/status`, { method: 'PATCH', body: { status }, auth: true });
}

/** POST /requests/{id}/options — add a quote option. */
export function addOption(id: string, payload: AddQuoteOptionPayload): Promise<QuoteOptionResponse> {
  return apiFetch<QuoteOptionResponse>(`/requests/${id}/options`, { method: 'POST', body: payload, auth: true });
}

/** DELETE /requests/{id}/options/{optionId} */
export function removeOption(id: string, optionId: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/options/${optionId}`, { method: 'DELETE', auth: true });
}

/** POST /requests/{id}/send-options — release the staged options to the client. */
export function sendOptions(id: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/send-options`, { method: 'POST', auth: true });
}

/** POST /requests/{id}/approve — client approves an option, locking wallet funds. */
export function approve(id: string, optionId: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/approve`, { method: 'POST', body: { optionId }, auth: true });
}

/** POST /requests/{id}/reject — client rejects the sent options. */
export function reject(id: string, reason: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/reject`, { method: 'POST', body: { reason }, auth: true });
}

/** POST /requests/{id}/cancel — cancel an approved request, releasing locked funds. */
export function cancel(id: string, reason: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/cancel`, { method: 'POST', body: { reason }, auth: true });
}

/**
 * POST /requests/{id}/reissue — client asks for the issued ticket to be
 * re-issued (e.g. a mistake in passenger details on the original form).
 */
export function reissue(id: string, reason: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/reissue`, { method: 'POST', body: { reason }, auth: true });
}

/** POST /requests/{id}/complete — capture funds and complete. */
export function complete(id: string): Promise<RequestResponse> {
  return apiFetch<RequestResponse>(`/requests/${id}/complete`, { method: 'POST', auth: true });
}

/** POST /requests/{id}/ticket — multipart upload of the issued ticket. */
export function uploadTicket(id: string, ticket: File): Promise<RequestResponse> {
  const fd = new FormData();
  fd.set('ticket', ticket);
  return apiFetch<RequestResponse>(`/requests/${id}/ticket`, { method: 'POST', body: fd, auth: true });
}
