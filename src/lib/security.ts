import crypto from "node:crypto";

/**
 * Security utilities shared across API routes.
 *
 * - timingSafeCompare: prevents timing attacks on secret comparisons.
 * - hashToken: produces a non-reversible token for cookie storage.
 * - rateLimit: in-memory sliding-window rate limiting per key (per IP).
 * - checkOrigin: CSRF defense for authenticated state-changing endpoints.
 */

/**
 * Constant-time string comparison. Hashes both inputs to equal-length
 * buffers first (timingSafeEqual requires equal lengths), then compares
 * the digests in constant time. Prevents an attacker from timing the
 * comparison to recover a secret character-by-character.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/**
 * Returns a SHA-256 hex digest of a value. Used to store a non-reversible
 * token in cookies instead of the raw passphrase — so even if a cookie is
 * somehow leaked, the real passphrase isn't exposed.
 */
export function hashToken(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// ── Rate limiting ───────────────────────────────────────────────────────────

type Bucket = { count: number; resetAt: number };

// Map is per-process; sufficient for a personal site. For multi-instance
// deployments, swap this for a Redis-backed limiter.
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

/**
 * In-memory fixed-window rate limiter. Returns `true` if the request is
 * within the allowed limit, `false` if exceeded. Cleans up stale entries
 * periodically to prevent unbounded memory growth.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    // Periodic cleanup to avoid memory growth under attack.
    if (buckets.size > MAX_BUCKETS) {
      for (const [k, v] of buckets) {
        if (now > v.resetAt) buckets.delete(k);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  bucket.count++;
  return bucket.count <= max;
}

/** Extract the client IP from standard proxy headers, with a fallback. */
export function getClientIP(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// ── CSRF defense ────────────────────────────────────────────────────────────

/**
 * Validates that a request originated from the same host (same-origin).
 * Browsers always send an `Origin` or `Referer` header on fetch/POST
 * requests, so a missing one is treated as suspicious. This blocks
 * cross-site request forgery on endpoints that rely on an auth cookie,
 * even when that cookie uses SameSite=None.
 */
export function checkOrigin(req: Request): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  // Fallback: check Referer if Origin is absent.
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // Neither header present — browsers always send one of these on
  // credentialed cross-origin or same-origin requests. Block it.
  return false;
}
