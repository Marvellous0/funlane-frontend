/** In-app notifications, backed by the live `/notifications*` endpoints. */
import type { Pagination } from './api.interface';

export type NotificationType = 'REQUEST' | 'WALLET' | 'SYSTEM';

/**
 * Raw notification as returned by the backend. The published docs only
 * confirm `GET /notifications`, `GET /notifications/unread-count`,
 * `PATCH /notifications/read-all` and `PATCH /notifications/{id}/read` —
 * the exact field names on each notification aren't nailed down yet, so this
 * tolerates the common variants (`message`/`body`, `isRead`/`read`/`readAt`,
 * `link`/`href`/`url`). See `toNotificationView` in
 * `@/services/notificationView` for how these are normalized. If
 * notifications keep showing as unread after a refresh even though marking
 * them read succeeds, the backend's real field name isn't one of these —
 * check a raw `GET /notifications` response and add it here.
 */
export interface ApiNotification {
  id: string;
  type?: string;
  title?: string;
  message?: string;
  body?: string;
  href?: string | null;
  link?: string | null;
  url?: string | null;
  requestId?: string | null;
  isRead?: boolean;
  read?: boolean;
  /** Some APIs mark "read" with a timestamp instead of a boolean. */
  readAt?: string | null;
  read_at?: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: ApiNotification[];
  pagination: Pagination;
}

export interface NotificationResponse {
  notification: ApiNotification;
}

export interface UnreadCountResponse {
  count?: number;
  unreadCount?: number;
}

/** App-facing shape the UI renders. */
export interface NotificationView {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** Internal path to open when the notification is clicked. */
  href?: string;
  read: boolean;
  createdAt: string;
}
