import type { TravelRequest } from '@/interface';
import { BUDGET_TIERS } from '@/lib/constants';

export function tierLabel(key: string): string {
  const t = BUDGET_TIERS.find((b) => b.key === key);
  return t ? t.label : key;
}

export function passengerSummary(req: TravelRequest): string {
  const p = req.passengers[0];
  if (!p) return '—';
  const extra = req.passengers.length > 1 ? ` +${req.passengers.length - 1} more` : '';
  return `${p.first} ${p.last}${extra}`;
}

/** "Lagos (LOS) → Abuja (ABV)" as a plain string. */
export function routeText(req: Pick<TravelRequest, 'from' | 'to'>): string {
  return `${req.from} → ${req.to}`;
}

/** City-only short form used on board cards, e.g. "Lagos → Abuja". */
export function shortRoute(req: Pick<TravelRequest, 'from' | 'to'>): string {
  return `${req.from.split(' ')[0]} → ${req.to.split(' ')[0]}`;
}
