interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function checkRateLimit(ipOrKey: string): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = loginAttempts.get(ipOrKey);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ipOrKey, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetInSec: Math.ceil(WINDOW_MS / 1000) };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000),
  };
}

export function resetRateLimit(ipOrKey: string) {
  loginAttempts.delete(ipOrKey);
}
