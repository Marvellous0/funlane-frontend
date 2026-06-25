/**
 * DTOs mirroring the Funlane backend auth contract (`/api/auth/*`).
 * These match the server's wire shapes exactly; the app's own `AuthUser`
 * (see user.interface) is a mapped, role-normalized projection of `PublicUser`.
 */

/** Roles as the backend reports them. */
export type BackendRole = 'CLIENT' | 'AGENT' | 'ADMIN';

/** The user object the backend returns from register / login / me. */
export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: BackendRole;
}

/** POST /auth/register */
export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: PublicUser;
}

/** POST /auth/login */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: PublicUser;
  token: string;
}

/** Generic `{ message }` envelope returned by verify/resend/forgot/reset. */
export interface MessageResponse {
  message: string;
}
