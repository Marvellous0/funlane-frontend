import type { AuthUser, BackendRole, PublicUser, Role } from '@/interface';

/**
 * Map the backend's role enum onto the app's lowercase principal role. Each
 * backend role has its own area: clients use the client portal, agents the
 * agency dashboard, and admins the admin console.
 */
export function mapRole(role: BackendRole): Role {
  if (role === 'CLIENT') return 'client';
  if (role === 'ADMIN') return 'admin';
  return 'agent';
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
  if (role === 'client') return '/client/dashboard';
  if (role === 'admin') return '/admin';
  return '/agent/board';
}

export function loginPathFor(role?: Role) {
  switch (role) {
    case 'admin':
      return '/admin/login';

    case 'agent':
      return '/agent/login';

    default:
      return '/login';
  }
}
