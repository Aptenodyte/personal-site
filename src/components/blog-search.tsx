"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { PostCard } from "@/components/post-card";

/**
 * Searchable blog listing. When the query is empty it shows the normal
 * featured-post + archive layout; when typing, it filters all posts by
 * title, excerpt, slug, and full body content.
 */
export function BlogSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const haystack = [p.title, p.excerpt ?? "", p.slug, p.content]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, posts]);

  const isSearching = query.trim().length > 0;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border-hi)",
    color: "var(--fg)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    padding: "0.65rem 0.85rem 0.65rem 2.2rem",
    outline: "none",
    letterSpacing: "0.02em",
  };

  return (
    <>
      {/* ── Search bar ── */}
      <div className="relative mt-8">
        {/* Search prompt icon */}
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.8rem] font-bold"
          style={{ color: "var(--fg-muted)" }}
        >
          /
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="grep writing/ ..."
          style={inputStyle}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--fg)"; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-hi)"; }}
        />
        {/* Clear button */}
        {isSearching && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.7rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
            style={{ color: "var(--fg-muted)" }}
          >
            [×]
          </button>
        )}
      </div>

      {/* ── Results ── */}
      {isSearching ? (
        <div className="mt-6">
          {/* Result count header */}
          <div
            className="mb-1 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
            style={{ background: "var(--surface-2)", color: "var(--fg-muted)", border: "1px solid var(--border-hi)", borderBottom: "none" }}
          >
            $ grep -i &quot;{query.trim()}&quot; writing/ &nbsp;&nbsp; // {filtered.length}{" "}
            {filtered.length === 1 ? "match" : "matches"}
          </div>

          {filtered.length === 0 ? (
            <div
              className="border p-12 text-center"
              style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
            >
              <p className="text-[0.88rem] font-bold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
                // no matches found
              </p>
              <p className="mt-2 text-[0.82rem]" style={{ color: "var(--fg-dim)" }}>
                No posts match &quot;{query.trim()}&quot;. Try a different search.
              </p>
            </div>
          ) : (
            <div
              className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3"
              style={{ border: "1px solid var(--border-hi)" }}
            >
              {filtered.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Normal layout: featured + archive */}
          {posts.length === 0 ? (
            <Reveal className="mt-10">
              <div
                className="border p-12 text-center"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <p
                  className="text-[0.88rem] font-bold uppercase tracking-widest"
                  style={{ color: "var(--fg-muted)" }}
                >
                  // no posts yet
                </p>
                <p
                  className="mt-2 text-[0.82rem]"
                  style={{ color: "var(--fg-dim)" }}
                >
                  Drop a <code style={{ color: "var(--hi-2)" }}>.mdx</code> file
                  into <code style={{ color: "var(--hi-2)" }}>content/blog/</code>
                </p>
              </div>
            </Reveal>
          ) : (
            <>
              {/* Featured post */}
              {posts[0] && (
                <FeaturedPost post={posts[0]} />
              )}

              {/* Archive */}
              {posts.length > 1 && (
                <Reveal className="mt-8" delay={0.1}>
                  <div
                    className="mb-1 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
                    style={{ background: "var(--surface-2)", color: "var(--fg-muted)", border: "1px solid var(--border)", borderBottom: "none" }}
                  >
                    $ ls -t writing/ | tail -n +2 &nbsp;&nbsp; // {posts.length - 1} more
                  </div>
                  <div
                    className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    {posts.slice(1).map((p, i) => (
                      <PostCard key={p.slug} post={p} index={i + 1} />
                    ))}
                  </div>
                </Reveal>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

/** Featured post block (the most recent entry). */
function FeaturedPost({ post }: { post: Post }) {
  return (
    <Reveal className="mt-10">
      <div
        className="mb-1 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
        style={{ background: "var(--surface-2)", color: "var(--fg-muted)", border: "1px solid var(--border-hi)", borderBottom: "none" }}
      >
        // featured — most recent entry
      </div>
      <Link
        href={`/blog/${post.slug}`}
        className="group block border transition-colors duration-100"
        style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
      >
        <div className="grid md:grid-cols-[auto_1fr]">
          <div
            className="hidden items-center justify-center border-r p-8 md:flex"
            style={{ borderColor: "var(--border)", minWidth: "7rem" }}
          >
            <span
              className="text-[4.5rem] font-bold leading-none"
              style={{ color: "var(--border-hi)" }}
            >
              01
            </span>
          </div>
          <div className="p-6 md:p-8">
            <div
              className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              {post.date.slice(0, 10)} // {post.readingMinutes} min read
            </div>
            <h2
              className="text-[clamp(1.2rem,3vw,1.75rem)] font-bold uppercase leading-tight tracking-wide transition-colors group-hover:text-[var(--hi)]"
              style={{ color: "var(--fg)" }}
            >
              {post.title}
            </h2>
            {post.excerpt && (
              <p
                className="mt-3 max-w-2xl text-[0.88rem] leading-relaxed"
                style={{ color: "var(--fg-dim)" }}
              >
                {post.excerpt}
              </p>
            )}
            <p
              className="mt-5 text-[0.72rem] font-bold uppercase tracking-widest transition-colors group-hover:text-[var(--hi)]"
              style={{ color: "var(--fg-muted)" }}
            >
              cat {post.slug}.mdx →
            </p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
