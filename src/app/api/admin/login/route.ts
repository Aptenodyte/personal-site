import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getPassphrase } from "@/lib/auth";
import {
  hashToken,
  rateLimit,
  timingSafeCompare,
  getClientIP,
} from "@/lib/security";

export const dynamic = "force-dynamic";

// Allow at most 10 login attempts per 15 minutes per IP to throttle brute force.
const LOGIN_MAX = 10;
const LOGIN_WINDOW = 15 * 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIP(req);

  // Rate limit before doing any work.
  if (!rateLimit(`login:${ip}`, LOGIN_MAX, LOGIN_WINDOW)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let body: { passphrase?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supplied = body.passphrase ?? "";
  const passphrase = getPassphrase();

  // Refuse login if no passphrase is configured.
  if (!passphrase) {
    return NextResponse.json(
      { error: "Admin login is not available." },
      { status: 403 }
    );
  }

  // Timing-safe comparison to prevent timing attacks.
  if (!supplied || !timingSafeCompare(supplied, passphrase)) {
    return NextResponse.json({ error: "Incorrect passphrase" }, { status: 401 });
  }

  const store = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  // Store a hash of the passphrase, never the raw value.
  store.set(ADMIN_COOKIE, hashToken(passphrase), {
    httpOnly: true,
    // SameSite=None;Secure so the cookie survives embedded/preview contexts
    // (iframes) where browsers block Lax cookies.
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return NextResponse.json({ ok: true });
}
