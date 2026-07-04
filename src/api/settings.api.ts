import type {
  ChangePasswordPayload,
  MessageResponse,
  SettingsProfile,
  UpdateProfilePayload,
} from '@/interface';
import { apiFetch } from './client';

/** Some endpoints wrap the record as `{ user }`; tolerate both shapes. */
function unwrapProfile(res: unknown): SettingsProfile {
  const r = res as { user?: SettingsProfile } | SettingsProfile;
  return (r as { user?: SettingsProfile }).user ?? (r as SettingsProfile);
}

/** GET /settings/me — the authenticated CLIENT/AGENT's profile. */
export function getMyProfile(): Promise<SettingsProfile> {
  return apiFetch<unknown>('/settings/me', { auth: true }).then(unwrapProfile);
}

/** PATCH /settings/profile — update name and/or phone (email is not editable). */
export function updateProfile(payload: UpdateProfilePayload): Promise<SettingsProfile> {
  return apiFetch<unknown>('/settings/profile', { method: 'PATCH', body: payload, auth: true }).then(unwrapProfile);
}

/**
 * POST /settings/change-password — requires the current password. On success the
 * backend invalidates every JWT issued before the change, so the caller must
 * re-authenticate afterwards.
 */
export function changePassword(payload: ChangePasswordPayload): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/settings/change-password', { method: 'POST', body: payload, auth: true });
}
