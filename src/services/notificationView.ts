/**
 * Maps the backend's notification DTO onto the UI's `NotificationView`.
 * The published endpoint docs don't pin down every field name yet, so this
 * tolerates the reasonable variants instead of assuming one exact shape —
 * tighten it once the schema is confirmed.
 */
import type { ApiNotification, NotificationType, NotificationView } from '@/interface';

const KNOWN_TYPES: readonly NotificationType[] = ['REQUEST', 'WALLET', 'SYSTEM'];

const TYPE_LABEL: Record<NotificationType, string> = {
  REQUEST: 'Request update',
  WALLET: 'Wallet update',
  SYSTEM: 'Notification',
};

function normalizeType(raw?: string): NotificationType {
  const upper = (raw ?? '').toUpperCase();
  return (KNOWN_TYPES as readonly string[]).includes(upper) ? (upper as NotificationType) : 'SYSTEM';
}

/**
 * Checks every reasonable "is this read?" shape: an explicit boolean
 * (`isRead`/`read`), or a nullable timestamp (`readAt`/`read_at`) that some
 * APIs use instead. Only falls back to `false` when none of these fields are
 * present at all, rather than whenever the boolean happens to be `false`.
 */
function resolveRead(n: ApiNotification): boolean {
  if (typeof n.isRead === 'boolean') return n.isRead;
  if (typeof n.read === 'boolean') return n.read;
  if ('readAt' in n) return n.readAt != null;
  if ('read_at' in n) return n.read_at != null;
  return false;
}

export function toNotificationView(n: ApiNotification): NotificationView {
  const type = normalizeType(n.type);
  // Prefer an explicit title; fall back to a generic message field, then a
  // type-based label so the row is never blank.
  const title = n.title?.trim() || n.message?.trim() || TYPE_LABEL[type];
  // If `message` was already used as the title (no explicit title given),
  // don't repeat it as the body too.
  const body = n.body?.trim() || (n.title?.trim() ? n.message?.trim() ?? '' : '');
  const href = n.href ?? n.link ?? n.url ?? (n.requestId ? `/requests/${n.requestId}` : undefined);

  return {
    id: n.id,
    type,
    title,
    body,
    href: href ?? undefined,
    read: resolveRead(n),
    createdAt: n.createdAt,
  };
}
