import Link from "next/link";
import type { PostSummary } from "@/lib/content";
import { formatDate } from "@/lib/format";

/** Terminal-style blog post card — file listing aesthetic. */
export function PostCard({ post, index }: { post: PostSummary; index?: number }) {
  const idx = String(index ?? 0).padStart(2, "0");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="post-card group block border-0"
      style={{ background: "var(--surface)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-3 border-b px-4 py-2"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface-2)",
        }}
      >
        <span
          className="text-[0.65rem] font-bold"
          style={{ color: "var(--fg-muted)" }}
        >
          [{idx}]
        </span>
        <span
          className="flex-1 truncate text-[0.7rem] font-bold uppercase tracking-widest"
          style={{ color: "var(--fg-dim)" }}
        >
          {post.slug}.mdx
        </span>
        <span
          className="text-[0.65rem]"
          style={{ color: "var(--fg-muted)" }}
        >
          {post.readingMinutes}min
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p
          className="text-[0.68rem] font-bold uppercase tracking-widest"
          style={{ color: "var(--fg-muted)" }}
        >
          {formatDate(post.date)}
        </p>
        <h3
          className="post-card-title mt-1.5 text-[0.95rem] font-bold uppercase leading-snug tracking-wide"
          style={{ color: "var(--fg)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed"
            style={{ color: "var(--fg-dim)" }}
          >
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Bottom status line */}
      <div
        className="post-card-footer border-t px-4 py-1.5"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
      >
        <span
          className="text-[0.62rem] font-bold uppercase tracking-widest"
          style={{ color: "var(--fg-muted)" }}
        >
          cat {post.slug}.mdx →
        </span>
      </div>
    </Link>
  );
}
