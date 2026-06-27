/**
 * Maps the backend's request DTOs onto a single UI view-model and centralizes
 * status / budget presentation. The backend is the source of truth; the app no
 * longer keeps its own request shapes.
 */
import type {
  ApiBudgetTier,
  ApiRequestStatus,
  RequestSummaryView,
  TravelRequestView,
  QuoteOptionView,
  PassengerView,
} from '@/interface';

export interface RequestVM {
  id: string;
  ref: string;
  status: ApiRequestStatus;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'oneway' | 'round';
  budgetTier: ApiBudgetTier;
  budgetLabel: string;
  preferredAirline?: string;
  preferredTime?: string;
  assignedAgentId: string | null;
  passengerCount: number;
  passengers: PassengerView[];
  quoteOptions: QuoteOptionView[];
  rejectionReason: string | null;
  cancellationReason: string | null;
  ticketDownloadUrl: string | null;
  createdAt: string;
  issuedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export const BUDGET_TIERS: { value: ApiBudgetTier; label: string }[] = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' },
];

const BUDGET_LABEL: Record<ApiBudgetTier, string> = {
  ECONOMY: 'Economy',
  PREMIUM_ECONOMY: 'Premium Economy',
  BUSINESS: 'Business',
  FIRST: 'First Class',
};

export const STATUS_META: Record<ApiRequestStatus, { label: string; badge: string; dot: string }> = {
  PENDING: { label: 'Pending', badge: 'bg-amber-soft text-amber-dark', dot: 'bg-amber' },
  OPTIONS_SENT: { label: 'Options sent', badge: 'bg-purple-soft text-purple', dot: 'bg-purple' },
  APPROVED_LOCKED: { label: 'Approved · funds locked', badge: 'bg-green-soft text-green-dark', dot: 'bg-green' },
  ISSUED: { label: 'Ticket issued', badge: 'bg-blue-soft text-blue', dot: 'bg-blue' },
  COMPLETED: { label: 'Completed', badge: 'bg-green-soft text-green-dark', dot: 'bg-green' },
  CANCELLED: { label: 'Cancelled', badge: 'bg-red-soft text-red-dark', dot: 'bg-red' },
};

/** Short human reference synthesized from the backend id (no `ref` field exists). */
export function refOf(id: string): string {
  return 'FL-' + id.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase();
}

export function summaryToVM(s: RequestSummaryView): RequestVM {
  return {
    id: s.id,
    ref: refOf(s.id),
    status: s.status,
    origin: s.origin,
    destination: s.destination,
    departureDate: s.departureDate,
    returnDate: s.returnDate,
    tripType: s.returnDate ? 'round' : 'oneway',
    budgetTier: s.budgetTier,
    budgetLabel: BUDGET_LABEL[s.budgetTier] ?? s.budgetTier,
    preferredAirline: s.preferredAirline,
    preferredTime: s.preferredTime,
    assignedAgentId: s.assignedAgentId,
    passengerCount: s.passengerCount,
    passengers: [],
    quoteOptions: [],
    rejectionReason: null,
    cancellationReason: null,
    ticketDownloadUrl: null,
    createdAt: s.createdAt,
    issuedAt: null,
    completedAt: null,
    cancelledAt: null,
  };
}

export function detailToVM(r: TravelRequestView): RequestVM {
  return {
    id: r.id,
    ref: refOf(r.id),
    status: r.status,
    origin: r.origin,
    destination: r.destination,
    departureDate: r.departureDate,
    returnDate: r.returnDate,
    tripType: r.returnDate ? 'round' : 'oneway',
    budgetTier: r.budgetTier,
    budgetLabel: BUDGET_LABEL[r.budgetTier] ?? r.budgetTier,
    preferredAirline: r.preferredAirline,
    preferredTime: r.preferredTime,
    assignedAgentId: r.assignedAgentId,
    passengerCount: r.passengers.length,
    passengers: r.passengers,
    quoteOptions: r.quoteOptions,
    rejectionReason: r.rejectionReason,
    cancellationReason: r.cancellationReason,
    ticketDownloadUrl: r.ticketDownloadUrl,
    createdAt: r.createdAt,
    issuedAt: r.issuedAt,
    completedAt: r.completedAt,
    cancelledAt: r.cancelledAt,
  };
}

export type { QuoteOptionView, PassengerView };
