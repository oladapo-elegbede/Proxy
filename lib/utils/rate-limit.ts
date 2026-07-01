// lib/utils/rate-limit.ts
// Simple in-memory rate limiter.
// Limits 10 requests per IP per minute per route.

const MAX_REQUESTS = 10;
const WINDOW_MS = 60_000;

const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, route: string): boolean {
  const key = `${ip}:${route}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}
