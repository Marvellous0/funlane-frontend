import type {
  LoginPayload,
  LoginResponse,
  MessageResponse,
  PublicUser,
  RegisterPayload,
  RegisterResponse,
} from '@/interface';
import { apiFetch } from './client';

/** POST /auth/register — create a client account; triggers a verification email. */
export function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>('/auth/register', { method: 'POST', body: payload });
}

/** POST /auth/login — exchange credentials for the user + JWT. */
export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: payload });
}

/** POST /auth/verify-email — activate an account with the emailed token. */
export function verifyEmail(token: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/auth/verify-email', { method: 'POST', body: { token } });
}

/** POST /auth/resend-verification — re-send the activation email. */
export function resendVerification(email: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/auth/resend-verification', { method: 'POST', body: { email } });
}

/** POST /auth/forgot-password — request a password-reset email. */
export function forgotPassword(email: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/auth/forgot-password', { method: 'POST', body: { email } });
}

/** POST /auth/reset-password — set a new password using the emailed token. */
export function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  });
}

/** GET /auth/me — the current user, resolved from the stored bearer token. */
export function getCurrentUser(): Promise<PublicUser> {
  return apiFetch<PublicUser>('/auth/me', { method: 'GET', auth: true });
}
