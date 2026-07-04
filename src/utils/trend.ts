/**
 * Small, honest trend helpers for dashboard stat cards. They derive series and
 * deltas purely from real record timestamps — no fabricated data.
 */

interface Dated {
  createdAt: string;
}

/** Count of records created in each of the last `days` days (oldest → newest). */
export function dailyCounts(records: Dated[], days: number): number[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets = new Array<number>(days).fill(0);
  for (const r of records) {
    const t = new Date(r.createdAt);
    t.setHours(0, 0, 0, 0);
    const ago = Math.round((today.getTime() - t.getTime()) / 86_400_000);
    if (ago >= 0 && ago < days) buckets[days - 1 - ago] += 1;
  }
  return buckets;
}

/**
 * Whole-number % change between this week's and last week's volume. Returns
 * `null` when there's no basis for a comparison (both weeks empty).
 */
export function weekOverWeek(records: Dated[]): number | null {
  const last14 = dailyCounts(records, 14);
  const prev = last14.slice(0, 7).reduce((a, b) => a + b, 0);
  const curr = last14.slice(7).reduce((a, b) => a + b, 0);
  if (prev === 0) return curr === 0 ? null : 100;
  return Math.round(((curr - prev) / prev) * 100);
}
