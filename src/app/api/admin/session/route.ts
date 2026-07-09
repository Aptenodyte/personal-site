import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAuthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Session check used by client components. */
export async function GET() {
  // Validate the cookie against the passphrase (not just existence).
  const ok = await isAuthorized();
  return NextResponse.json({ ok });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
