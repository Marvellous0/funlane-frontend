import type { BackendRole } from './auth.interface';

/**
 * Self-service profile for CLIENT/AGENT accounts (`/settings/*`). Email is
 * read-only here; it can't be changed through self-service.
 */
export interface SettingsProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: BackendRole;
}

/** PATCH /settings/profile — only name and phone are editable. */
export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

/** POST /settings/change-password — requires the current password. */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
