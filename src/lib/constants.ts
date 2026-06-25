import type { RequestStatus, BudgetTierKey } from '@/interface';

/** localStorage key for the persisted portal dataset. */
export const STORE_KEY = 'funlane_portal_v1';
/** localStorage key for the persisted auth principal. */
export const AUTH_STORE_KEY = 'funlane_auth_v1';
/** localStorage key for the backend-issued JWT. */
export const AUTH_TOKEN_KEY = 'funlane_token_v1';
/** Non-HttpOnly cookie read by middleware for route authorization. */
export const AUTH_COOKIE = 'funlane_auth';

/**
 * Base URL of the Funlane backend API. Override per-environment with
 * `NEXT_PUBLIC_API_BASE_URL` (e.g. a local server); falls back to the
 * deployed Render instance. No trailing slash — paths are joined directly.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend-0u43.onrender.com/api'
).replace(/\/$/, '');

interface StatusMeta {
  key: RequestStatus;
  label: string;
  badge: string;
  col: string;
}

/* Pipeline statuses:
   pending  -> in agent queue (new or bounced-back from rejection)
   quoted   -> agent sent options, awaiting client review
   approved -> client approved, wallet funds LOCKED, ready to issue
   issued   -> ticket uploaded + completed, funds captured & agency paid */
export const STATUS: Record<RequestStatus, StatusMeta> = {
  pending: { key: 'pending', label: 'Pending', badge: 'badge-pending', col: 'New Requests' },
  quoted: { key: 'quoted', label: 'Options Sent', badge: 'badge-quoted', col: 'Quoted — Awaiting Client' },
  approved: { key: 'approved', label: 'Approved — Funds Locked', badge: 'badge-approved', col: 'Approved — Ready to Issue' },
  issued: { key: 'issued', label: 'Ticket Issued', badge: 'badge-issued', col: 'Completed' },
};

interface BudgetTier {
  key: BudgetTierKey;
  label: string;
  desc: string;
}

export const BUDGET_TIERS: BudgetTier[] = [
  { key: 'economy', label: 'Economy', desc: 'Lowest fare, flexible routing' },
  { key: 'standard', label: 'Standard', desc: 'Balance of price & timing' },
  { key: 'premium', label: 'Premium', desc: 'Premium / business, best times' },
];

export const AIRLINES = [
  'Air Peace',
  'Ibom Air',
  'Arik Air',
  'United Nigeria',
  'Green Africa',
  'Dana Air',
  'No preference',
];

export interface BoardColumn {
  status: RequestStatus;
  title: string;
  color: string;
}

export const BOARD_COLUMNS: BoardColumn[] = [
  { status: 'pending', title: 'New Requests', color: '#D97706' },
  { status: 'quoted', title: 'Quoted — Awaiting Client', color: '#7C3AED' },
  { status: 'approved', title: 'Approved — Ready to Issue', color: '#10B981' },
  { status: 'issued', title: 'Completed', color: '#0369A1' },
];
