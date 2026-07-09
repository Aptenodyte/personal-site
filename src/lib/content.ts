import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  excerpt?: string;
  date: string; // ISO date, e.g. 2026-01-15
  accent?: string;
  draft?: boolean;
  cover?: string; // optional image path in /public
};

export type PostSummary = PostFrontmatter & {
  slug: string;
  readingMinutes: number;
};

export type Post = PostSummary & {
  content: string;
};

/** Estimated reading time from raw markdown text. */
export function readingTime(text: string): number {
  const words = text
    .replace(/```[\s\S]*?```/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function getSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

/**
 * Sanitize a slug to prevent path traversal: strip directory separators,
 * parent-dir sequences, and any non-filename characters.
 */
function safeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, "").slice(0, 160);
}

function readPost(slug: string): Post | null {
  const clean = safeSlug(slug);
  if (!clean) return null;

  const fileCandidates = [
    path.join(POSTS_DIR, `${clean}.mdx`),
    path.join(POSTS_DIR, `${clean}.md`),
  ];
  // Verify each resolved path stays within POSTS_DIR (defense-in-depth
  // against directory traversal).
  const file = fileCandidates.find(
    (f) => path.resolve(f).startsWith(POSTS_DIR) && fs.existsSync(f)
  );
  if (!file) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;

  // gray-matter parses YAML dates as JS Date objects — normalize to ISO string
  const rawDate: unknown = fm.date;
  const dateStr =
    rawDate instanceof Date
      ? rawDate.toISOString()
      : typeof rawDate === "string"
      ? rawDate
      : new Date().toISOString();

  return {
    slug: clean,
    title: fm.title ?? clean,
    excerpt: fm.excerpt,
    date: dateStr,
    accent: fm.accent ?? "vermilion",
    draft: fm.draft ?? false,
    cover: fm.cover,
    readingMinutes: readingTime(content),
    content,
  };
}

/** All published posts (summaries only, no content), newest first. */
export function getAllPosts(): PostSummary[] {
  return getAllPostsFull().map(({ content, ...summary }) => summary);
}

/** All published posts WITH content, newest first — used by the blog search. */
export function getAllPostsFull(): Post[] {
  return getSlugs()
    .map(readPost)
    .filter((p): p is Post => !!p)
    .filter((p) => !p.draft || process.env.NODE_ENV !== "production")
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string): Post | null {
  const post = readPost(slug);
  if (!post) return null;
  if (post.draft && process.env.NODE_ENV === "production") return null;
  return post;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
