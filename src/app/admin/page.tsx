"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Comment = {
  id: number;
  slug: string;
  name: string;
  body: string;
  parentId: number | null;
  createdAt: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.ok)))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <div className="page grid min-h-[70vh] place-items-center pt-32">
        <span className="animate-pulse text-[0.8rem]" style={{ color: "var(--fg-muted)" }}>
          // checking session...
        </span>
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase: pass }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Incorrect passphrase.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page grid min-h-[80vh] place-items-center pt-32">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border p-8"
        style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
      >
        <div
          className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--fg-muted)" }}
        >
          // admin access required
        </div>
        <h1
          className="mb-5 text-[1.4rem] font-bold uppercase tracking-wider"
          style={{ color: "var(--fg)" }}
        >
          ADMIN LOGIN
        </h1>
        <label
          className="mb-1 block text-[0.7rem] font-bold uppercase tracking-wider"
          style={{ color: "var(--fg-muted)" }}
        >
          PASSPHRASE
        </label>
        <input
          type="password"
          autoFocus
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="••••••••"
          style={{
            width: "100%",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--fg)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            padding: "0.6rem 0.8rem",
            outline: "none",
          }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-hi)"; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
        />
        {error && (
          <p className="mt-2 text-[0.78rem] font-bold" style={{ color: "var(--hi)" }}>
            ✗ {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-fill mt-5 w-full justify-center"
        >
          {loading ? "AUTHENTICATING..." : "LOGIN →"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id: number, slug: string) {
    if (!confirm("Delete this comment and its replies?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/comments/${slug}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    onLogout();
  }

  // Group comments by slug.
  const groups = comments.reduce<Record<string, Comment[]>>((acc, c) => {
    (acc[c.slug] ??= []).push(c);
    return acc;
  }, {});
  const slugs = Object.keys(groups).sort();

  return (
    <div className="page pb-16 pt-32 md:pt-36">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--fg-muted)" }}>
            // moderation console
          </div>
          <h1
            className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold uppercase tracking-wider"
            style={{ color: "var(--fg)" }}
          >
            COMMENT MOD
          </h1>
          <p className="mt-2 text-[0.82rem]" style={{ color: "var(--fg-dim)" }}>
            {loading ? "loading..." : `${comments.length} total comments across ${slugs.length} ${slugs.length === 1 ? "post" : "posts"}`}
          </p>
        </div>
        <button onClick={logout} className="btn">
          LOGOUT
        </button>
      </div>

      {loading ? (
        <div className="border p-10 text-center text-[0.82rem]" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--fg-muted)" }}>
          <span className="animate-pulse">loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="border p-10 text-center text-[0.82rem]" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--fg-muted)" }}>
          // no comments to moderate. all clear.
        </div>
      ) : (
        <div className="space-y-6">
          {slugs.map((slug) => {
            const list = groups[slug].sort(
              (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
            );
            return (
              <div key={slug} className="border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <div
                  className="flex items-center justify-between border-b px-5 py-3"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
                >
                  <Link
                    href={`/blog/${slug}`}
                    className="text-[0.78rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
                    style={{ color: "var(--fg-dim)" }}
                  >
                    {slug}.mdx
                  </Link>
                  <span className="text-[0.65rem] font-bold" style={{ color: "var(--fg-muted)" }}>
                    {list.length} {list.length === 1 ? "comment" : "comments"}
                  </span>
                </div>
                <ul className="flex flex-col divide-y" style={{ borderColor: "var(--border)" }}>
                  {list.map((c) => (
                    <li key={c.id} className="px-5 py-4" style={{ borderColor: "var(--border)" }}>
                      <div className="mb-1 flex items-baseline gap-2 text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>
                        <span style={{ color: c.parentId ? "var(--hi-2)" : "var(--hi)" }}>
                          {c.name.toLowerCase().replace(/\s+/g, "_")}
                        </span>
                        {c.parentId && <span>↳ reply</span>}
                        <span>· {timeAgo(c.createdAt)}</span>
                      </div>
                      <div className="whitespace-pre-wrap break-words text-[0.85rem] leading-relaxed" style={{ color: "var(--fg-dim)" }}>
                        <span style={{ color: "var(--fg-muted)" }}>{"> "}</span>
                        {c.body}
                      </div>
                      <button
                        onClick={() => onDelete(c.id, c.slug)}
                        disabled={deletingId === c.id}
                        className="mt-2 text-[0.65rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        {deletingId === c.id ? "[DELETING...]" : "✗ [DELETE]"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
