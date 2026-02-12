// Token bucket rate limiter with daily cap and exponential backoff

interface BucketState {
  tokens: number;
  lastRefill: number;
  dailyCount: number;
  dailyResetAt: number;
}

const BUCKET_CAPACITY = 100;
const REFILL_RATE = 10; // tokens per second
const DAILY_CAP = 200_000;
const MAX_BACKOFF_MS = 8_000;

const state: BucketState = {
  tokens: BUCKET_CAPACITY,
  lastRefill: Date.now(),
  dailyCount: 0,
  dailyResetAt: getNextMidnightUTC(),
};

function getNextMidnightUTC(): number {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  return tomorrow.getTime();
}

function refill(): void {
  const now = Date.now();
  const elapsed = (now - state.lastRefill) / 1000;
  state.tokens = Math.min(BUCKET_CAPACITY, state.tokens + elapsed * REFILL_RATE);
  state.lastRefill = now;

  // Reset daily counter at midnight UTC
  if (now >= state.dailyResetAt) {
    state.dailyCount = 0;
    state.dailyResetAt = getNextMidnightUTC();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const rateLimiter = {
  /** Acquire a token before making a CRM API call. Waits if needed. */
  async acquire(): Promise<void> {
    let backoff = 1000;
    while (true) {
      refill();

      if (state.dailyCount >= DAILY_CAP) {
        throw new Error(
          `Daily API limit reached (${DAILY_CAP}). Resets at midnight UTC.`
        );
      }

      if (state.tokens >= 1) {
        state.tokens -= 1;
        state.dailyCount += 1;
        return;
      }

      // Wait and retry with exponential backoff
      await sleep(backoff);
      backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
    }
  },

  /** Get current usage stats */
  getStats() {
    refill();
    return {
      availableTokens: Math.floor(state.tokens),
      dailyCount: state.dailyCount,
      dailyCap: DAILY_CAP,
      dailyRemaining: DAILY_CAP - state.dailyCount,
    };
  },
};
