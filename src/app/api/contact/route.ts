import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { ensureSchema } from "@/db/init";
import { rateLimit, getClientIP } from "@/lib/security";
import { notifyOwner } from "@/lib/email";

export const dynamic = "force-dynamic";

// 3 messages per 10 minutes per IP — enough for real use, blocks floods.
const CONTACT_MAX = 3;
const CONTACT_WINDOW = 10 * 60 * 1000;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  const ip = getClientIP(req);
  if (!rateLimit(`contact:${ip}`, CONTACT_MAX, CONTACT_WINDOW)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Cap lengths explicitly (schema also enforces at the DB level).
  const name = (body.name || "").trim().slice(0, 140);
  const email = (body.email || "").trim().slice(0, 220);
  const message = (body.message || "").trim();

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Your message should be at least 10 characters." },
      { status: 400 }
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { error: "Your message is too long (5000 character max)." },
      { status: 400 }
    );
  }

  try {
    await ensureSchema();
    await db.insert(messages).values({ name, email, message });

    // Email notification (skips silently if SMTP isn't configured).
    await notifyOwner({
      subject: `New message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        `${message}`,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
