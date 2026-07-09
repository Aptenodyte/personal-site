import Link from "next/link";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/content";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-static";

const NAV_ITEMS = [
  { n: "01", href: "/about",      label: "about.txt",     desc: "who I am, what I care about" },
  { n: "02", href: "/experience", label: "experience.log", desc: "research, IT support, and projects" },
  { n: "03", href: "/blog",       label: "writing/",       desc: "notes, build logs, things I learned" },
  { n: "04", href: "/contact",    label: "contact.sh",     desc: "say hello or open a conversation" },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero />

      {/* Directory listing */}
      <section className="page pt-8 pb-20">
        <Reveal>
          <div
            className="mb-2 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
            style={{ background: "var(--surface-2)", color: "var(--fg-muted)", borderBottom: "1px solid var(--border)" }}
          >
            $ ls -la ~/portfolio/ &nbsp;&nbsp;&nbsp; total {NAV_ITEMS.length} entries
          </div>
          <div
            className="border"
            style={{ borderColor: "var(--border)" }}
          >
            {NAV_ITEMS.map((f, i) => (
              <Link
                key={f.href}
                href={f.href}
                className="dir-row group flex items-baseline gap-4 border-b px-4 py-3.5 last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="w-6 shrink-0 text-[0.65rem] font-bold"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {f.n}
                </span>
                <span
                  className="w-40 shrink-0 font-bold uppercase tracking-wide transition-colors group-hover:text-[var(--hi)]"
                  style={{ fontSize: "0.82rem", color: "var(--fg)" }}
                >
                  {f.label}
                </span>
                <span
                  className="truncate text-[0.78rem]"
                  style={{ color: "var(--fg-dim)" }}
                >
                  // {f.desc}
                </span>
                <span
                  className="ml-auto shrink-0 text-[0.65rem] font-bold uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: "var(--hi)" }}
                >
                  [OPEN →]
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Recent posts */}
      {posts.length > 0 && (
        <section className="page pb-8">
          <Reveal>
            <div
              className="mb-1 flex items-center justify-between px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
              style={{ background: "var(--surface-2)", color: "var(--fg-muted)", border: "1px solid var(--border)", borderBottom: "none" }}
            >
              <span>$ cat writing/*.mdx | head -3</span>
              <Link
                href="/blog"
                className="font-bold uppercase tracking-widest transition-colors hover:text-[var(--hi)]"
                style={{ color: "var(--fg-dim)" }}
              >
                ls -la writing/ →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-0 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0" style={{ borderColor: "var(--border)", border: "1px solid var(--border)" }}>
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07}>
                <PostCard post={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
