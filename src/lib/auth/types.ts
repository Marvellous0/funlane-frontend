import type { Role } from '@/interface';

/** Decoded principal stored in the auth cookie (kept intentionally minimal). */
export interface CookiePrincipal {
  id: string;
  role: Role;
}
