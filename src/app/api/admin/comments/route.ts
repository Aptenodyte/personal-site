import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { ensureSchema } from "@/db/init";
import { isAuthorized } from "@/lib/auth";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

/** GET /api/admin/comments — every comment across all posts (moderation view). */
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureSchema();
    const rows = await db
      .select({
        id: comments.id,
        slug: comments.slug,
        name: comments.name,
        body: comments.body,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .orderBy(desc(comments.createdAt));

    return NextResponse.json({
      comments: rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        body: r.body,
        parentId: r.parentId,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[admin/comments] failed:", err);
    return NextResponse.json({ comments: [] });
  }
}
