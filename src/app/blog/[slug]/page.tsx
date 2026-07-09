import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getAllPosts, formatDate } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { Comments } from "@/components/comments";

export const dynamic = "force-static";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="pb-16 pt-28 md:pt-36">
      <div className="page">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-block text-[0.72rem] font-bold uppercase tracking-widest transition-colors hover:text-[var(--hi)]"
          style={{ color: "var(--fg-muted)" }}
        >
          ← ls writing/
        </Link>

        {/* Header panel */}
        <div
          className="border"
          style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
        >
          {/* Title bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3"
            style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[0.65rem] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--fg-muted)" }}
              >
                $ cat {post.slug}.mdx
              </span>
            </div>
            <div className="flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--fg-muted)" }}>
              <span>{formatDate(post.date)}</span>
              <span style={{ color: "var(--border-hi)" }}>|</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <h1
              className="text-[clamp(1.5rem,4.5vw,2.5rem)] font-bold uppercase leading-tight tracking-wide"
              style={{ color: "var(--fg)" }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p
                className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed"
                style={{ color: "var(--fg-dim)" }}
              >
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div
          className="mt-4 border p-6 md:p-10"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <article className="markdown max-w-2xl">
            <MDXRemote source={post.content} components={mdxComponents} />
          </article>
        </div>

        {/* Comments */}
        <div className="mt-4 max-w-2xl">
          <Comments slug={post.slug} />
        </div>

        {/* Footer */}
        <div
          className="mt-4 flex items-center justify-between border px-5 py-4"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
        >
          <span
            className="text-[0.65rem] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--fg-muted)" }}
          >
            [EOF] // {post.slug}.mdx
          </span>
          <Link href="/blog" className="btn">
            LS WRITING/
          </Link>
        </div>
      </div>
    </article>
  );
}
