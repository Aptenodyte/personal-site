import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { ensureSchema } from "@/db/init";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIP, checkOrigin } from "@/lib/security";
import { notifyOwner } from "@/lib/email";
import { eq, asc, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// 5 comments per 5 minutes per IP — stops spam floods.
const COMMENT_MAX = 5;
const COMMENT_WINDOW = 5 * 60 * 1000;

type Params = { params: Promise<{ slug: string }> };

function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, "").slice(0, 160);
}

/** GET /api/comments/[slug] — list the thread for a post, oldest first. */
export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const safeSlug = sanitizeSlug(slug);

  try {
    await ensureSchema();
    const rows = await db
      .select({
        id: comments.id,
        name: comments.name,
        body: comments.body,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(eq(comments.slug, safeSlug))
      .orderBy(asc(comments.createdAt));

    return NextResponse.json({
      comments: rows.map((r) => ({
        id: r.id,
        name: r.name,
        body: r.body,
        parentId: r.parentId,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[comments/get] failed:", err);
    return NextResponse.json({ comments: [] });
  }
}

/** POST /api/comments/[slug] — create a comment or a reply. */
export async function POST(req: Request, { params }: Params) {
  const { slug } = await params;
  const safeSlug = sanitizeSlug(slug);

  const ip = getClientIP(req);
  if (!rateLimit(`comment:${ip}`, COMMENT_MAX, COMMENT_WINDOW)) {
    return NextResponse.json(
      { error: "You're posting too fast. Wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: { name?: string; body?: string; website?: string; parentId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots tend to fill hidden "website" fields; humans never see it.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }); // pretend it worked
  }

  const name = (body.name || "").trim().slice(0, 80);
  const text = (body.body || "").trim();

  if (name.length < 1) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (text.length < 1) {
    return NextResponse.json({ error: "Please write a comment." }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json(
      { error: "Comments are limited to 2000 characters." },
      { status: 400 }
    );
  }

  // parentId is optional; coerce to a positive int or null.
  const rawParent =
    typeof body.parentId === "number"
      ? body.parentId
      : Number(body.parentId);
  const parentId =
    Number.isFinite(rawParent) && rawParent > 0 ? rawParent : null;

  try {
    await ensureSchema();
    const [row] = await db
      .insert(comments)
      .values({ slug: safeSlug, name, body: text, parentId })
      .returning({
        id: comments.id,
        name: comments.name,
        body: comments.body,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
      });

    // Send email notification to the site owner (skips silently if SMTP
    // isn't configured — never blocks the comment from being saved).
    await notifyOwner({
      subject: parentId ? `New reply from ${name}` : `New comment from ${name}`,
      text: [
        `${name} ${parentId ? "replied to a comment" : "left a comment"} on:`,
        `/blog/${safeSlug}`,
        "",
        `"${text}"`,
        "",
        `View it at https://your-domain.com/blog/${safeSlug}`,
      ].join("\n"),
    });

    return NextResponse.json({
      ok: true,
      comment: {
        id: row.id,
        name: row.name,
        body: row.body,
        parentId: row.parentId,
        createdAt: row.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("[comments/post] failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/** DELETE /api/comments/[slug]?id=123 — admin-only moderation. */
export async function DELETE(req: Request, { params }: Params) {
  const { slug } = await params;
  const safeSlug = sanitizeSlug(slug);

  // CSRF defense: require same-origin since the auth cookie uses
  // SameSite=None. A cross-site request won't pass this check.
  if (!checkOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id"));
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid comment id" }, { status: 400 });
  }

  try {
    await ensureSchema();
    // Delete the comment itself (scoped to this post's slug) and any replies
    // that point to it as their parent.
    await db
      .delete(comments)
      .where(and(eq(comments.id, id), eq(comments.slug, safeSlug)));
    await db.delete(comments).where(eq(comments.parentId, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[comments/delete] failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
