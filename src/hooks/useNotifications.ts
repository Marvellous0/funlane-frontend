'use client';

import { useCallback, useEffect, useState } from 'react';
import * as notificationsApi from '@/api/notifications.api';
import { toNotificationView } from '@/services/notificationView';
import type { NotificationView } from '@/interface';

/** How often to re-poll while a session is open — no WS/SSE push yet. */
const POLL_MS = 30_000;

/**
 * Notification state shared by the bell + panel, backed by the live
 * `/notifications*` endpoints. `unreadCount` comes from its own endpoint
 * rather than counting the fetched page, since a user can have more unread
 * notifications than fit on one page. Point this at a socket push later by
 * calling `refresh()` from the push handler — the UI needs no changes.
 */
export function useNotifications() {
  const [items, setItems] = useState<NotificationView[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        notificationsApi.listNotifications({ limit: 20 }),
        notificationsApi.getUnreadCount(),
      ]);
      setItems(list.notifications.map(toNotificationView));
      setUnreadCount(count.count ?? count.unreadCount ?? 0);
    } catch {
      /* keep whatever was last loaded — the bell just won't update this cycle */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (alive) void refresh();
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [refresh]);

  async function markRead(id: string) {
    const target = items.find((n) => n.id === id);
    const wasUnread = !!target && !target.read;
    // Optimistic — the panel feels instant even on a slow network.
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      const res = await notificationsApi.markRead(id);
      // Trust the server's version of the record over our own guess, in case
      // it disagrees (e.g. our read-field heuristic doesn't match its schema).
      if (res?.notification) {
        const confirmed = toNotificationView(res.notification);
        setItems((list) => list.map((n) => (n.id === id ? confirmed : n)));
      }
    } catch {
      await refresh();
    }
  }

  async function markAllRead() {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await notificationsApi.markAllRead();
    } finally {
      // The read-all endpoint doesn't echo back the updated list, so re-fetch
      // to confirm it actually stuck server-side — surfaces a persistence
      // problem immediately instead of only after the next page reload.
      await refresh();
    }
  }

  return { items, unreadCount, loading, refresh, markRead, markAllRead };
}
