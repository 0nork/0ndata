// API call usage tracking for billing ($0.01 per API call)
// In-memory counter with periodic flush

interface DailyUsage {
  count: number;
  date: string; // YYYY-MM-DD
}

const usage = new Map<string, DailyUsage>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getKey(locationId: string): string {
  return `${locationId}:${todayKey()}`;
}

export const tracker = {
  /** Increment API call counter for a location */
  increment(locationId: string): void {
    const key = getKey(locationId);
    const current = usage.get(key);
    if (current) {
      current.count += 1;
    } else {
      usage.set(key, { count: 1, date: todayKey() });
    }
  },

  /** Get usage count for a location on a given date */
  getUsage(locationId: string, date?: string): number {
    const d = date || todayKey();
    const key = `${locationId}:${d}`;
    return usage.get(key)?.count || 0;
  },

  /** Get all usage data (for billing export) */
  getAllUsage(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [key, value] of usage.entries()) {
      result[key] = value.count;
    }
    return result;
  },

  /** Reset counter (for testing or after billing flush) */
  reset(locationId?: string): void {
    if (locationId) {
      for (const key of usage.keys()) {
        if (key.startsWith(locationId)) {
          usage.delete(key);
        }
      }
    } else {
      usage.clear();
    }
  },
};
