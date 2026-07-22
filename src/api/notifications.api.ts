import type { NotificationListResponse, NotificationResponse, UnreadCountResponse } from '@/interface';
import { apiFetch } from './client';

/**
 * Notifications — backed by the live backend:
 *   GET   /notifications              → { notifications, pagination }
 *   GET   /notifications/unread-count → { count }
 *   PATCH /notifications/read-all     → { message }
 *   PATCH /notifications/{id}/read    → { notification }
 *
 * No WS/SSE push yet — `useNotifications` polls on an interval. Swap that for
 * a socket feed later without touching this file.
 */

interface ListNotificationsParams {
  page?: number;
  limit?: number;
}

/** GET /notifications — the authenticated user's in-app notifications. */
export function listNotifications(params: ListNotificationsParams = {}): Promise<NotificationListResponse> {
  return apiFetch<NotificationListResponse>('/notifications', {
    auth: true,
    query: { page: params.page, limit: params.limit },
  });
}

/** GET /notifications/unread-count */
export function getUnreadCount(): Promise<UnreadCountResponse> {
  return apiFetch<UnreadCountResponse>('/notifications/unread-count', { auth: true });
}

/** PATCH /notifications/{id}/read */
export function markRead(id: string): Promise<NotificationResponse> {
  return apiFetch<NotificationResponse>(`/notifications/${id}/read`, { method: 'PATCH', auth: true });
}

/** PATCH /notifications/read-all */
export function markAllRead(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/notifications/read-all', { method: 'PATCH', auth: true });
}
