import type { AuthUser, BackendRole, PublicUser, Role } from '@/interface';

/**
 * The backend has three roles (CLIENT/AGENT/ADMIN) but this portal only models
 * two areas: the client portal and the agency dashboard. Admins operate the
 * agency side, so they map onto the `agent` experience.
 */
export function mapRole(role: BackendRole): Role {
  return role === 'CLIENT' ? 'client' : 'agent';
}

/** Project the backend user onto the app's role-normalized principal. */
export function toAuthUser(user: PublicUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: mapRole(user.role),
  };
}

/** Where a freshly authenticated user should land. */
export function homePathFor(role: Role): string {
  return role === 'client' ? '/client/dashboard' : '/agent/board';
}
