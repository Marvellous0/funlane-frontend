import type { RequestVM } from '@/services/requestView';

/** "Lagos (LOS) → Abuja (ABV)" as a plain string. */
export function routeText(req: Pick<RequestVM, 'origin' | 'destination'>): string {
  return `${req.origin} → ${req.destination}`;
}

/** City-only short form used on board cards, e.g. "Lagos → Abuja". */
export function shortRoute(req: Pick<RequestVM, 'origin' | 'destination'>): string {
  return `${req.origin.split(' ')[0]} → ${req.destination.split(' ')[0]}`;
}

/** Traveler count summary from a list/detail view-model. */
export function passengerSummary(req: RequestVM): string {
  const count = req.passengers.length || req.passengerCount;
  if (!count) return '—';
  if (req.passengers[0]?.fullName) {
    const extra = count > 1 ? ` +${count - 1} more` : '';
    return `${req.passengers[0].fullName}${extra}`;
  }
  return count === 1 ? '1 traveler' : `${count} travelers`;
}
