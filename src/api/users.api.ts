import type {
  BackendRole,
  ListUsersParams,
  ListUsersResponse,
  MessageResponse,
  UserResponse,
} from '@/interface';
import { apiFetch } from './client';

/** GET /admin/users — paginated list with optional role/status/search filters. */
export function listUsers(params: ListUsersParams = {}): Promise<ListUsersResponse> {
  return apiFetch<ListUsersResponse>('/admin/users', {
    auth: true,
    query: {
      page: params.page,
      limit: params.limit,
      role: params.role,
      status: params.status,
      search: params.search,
    },
  });
}

/** GET /admin/users/{id} */
export function getUser(id: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/admin/users/${id}`, { auth: true });
}

/** PATCH /admin/users/{id} — update name / phone. */
export function updateUser(id: string, payload: { name?: string; phone?: string }): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/admin/users/${id}`, { method: 'PATCH', body: payload, auth: true });
}

/** DELETE /admin/users/{id} — permanently delete. */
export function deleteUser(id: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>(`/admin/users/${id}`, { method: 'DELETE', auth: true });
}

/** POST /admin/users/{id}/suspend */
export function suspendUser(id: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/admin/users/${id}/suspend`, { method: 'POST', auth: true });
}

/** POST /admin/users/{id}/reactivate */
export function reactivateUser(id: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/admin/users/${id}/reactivate`, { method: 'POST', auth: true });
}

/** PATCH /admin/users/{id}/role — change a user's role. */
export function changeUserRole(id: string, role: BackendRole): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/admin/users/${id}/role`, { method: 'PATCH', body: { role }, auth: true });
}
