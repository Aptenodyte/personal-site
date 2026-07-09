import { cookies } from "next/headers";
import { timingSafeCompare, hashToken } from "@/lib/security";

export const ADMIN_COOKIE = "hg_admin";

/**
 * Returns the configured admin passphrase, or null if none is set.
 * When null, admin login is disabled entirely.
 */
export function getPassphrase(): string | null {
  return process.env.ADMIN_PASSPHRASE ?? null;
}

/**
 * True if the current request carries a valid admin session cookie.
 * Compares the stored hash to the expected hash in constant time to
 * prevent timing attacks.
 */
export async function isAuthorized(): Promise<boolean> {
  const passphrase = getPassphrase();
  if (!passphrase) return false;

  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  // The cookie stores hashToken(passphrase), not the raw passphrase.
  return timingSafeCompare(token, hashToken(passphrase));
}
