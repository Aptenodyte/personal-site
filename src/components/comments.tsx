"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Comment = {
  id: number;
  name: string;
  body: string;
  parentId: number | null;
  createdAt: string;
};

type Thread = Comment & { replies: Comment[] };
type Status = "idle" | "loading" | "error";

/** Format a relative "time ago" string, e.g. "3h ago", "2d ago". */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--fg)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.85rem",
  padding: "0.55rem 0.75rem",
  outline: "none",
  letterSpacing: "0.02em",
};

const smallInputStyle: React.CSSProperties = {
  ...inputStyle,
  fontSize: "0.8rem",
  padding: "0.45rem 0.65rem",
};

export function Comments({ slug }: { slug: string }) {
  const [flat, setFlat] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", body: "", website: "" });

  // Reply state: which comment id we're replying to (null = none).
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyForm, setReplyForm] = useState({ name: "", body: "", website: "" });
  const [replyStatus, setReplyStatus] = useState<Status>("idle");
  const [replyError, setReplyError] = useState("");

  // Admin session (controls whether delete buttons appear).
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${slug}`);
      const data = await res.json();
      setFlat(data.comments ?? []);
    } catch {
      setFlat([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  // Check admin session on mount AND whenever the window regains focus.
  // (So logging in at /admin in another tab is picked up here without a
  // full page reload.) credentials:"include" is required for SameSite=None.
  useEffect(() => {
    const checkAdmin = () => {
      fetch("/api/admin/session", { credentials: "include" })
        .then((r) => r.json())
        .then((d) => setIsAdmin(Boolean(d.ok)))
        .catch(() => setIsAdmin(false));
    };
    checkAdmin();
    window.addEventListener("focus", checkAdmin);
    return () => window.removeEventListener("focus", checkAdmin);
  }, []);

  // Build the threaded view (top-level comments + nested replies).
  const threads = useMemo<Thread[]>(() => {
    const tops = flat.filter((c) => c.parentId == null);
    const replies = flat.filter((c) => c.parentId != null);
    return tops.map((top) => ({
      ...top,
      replies: replies
        .filter((r) => r.parentId === top.id)
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    }));
  }, [flat]);

  const totalReplies = flat.filter((c) => c.parentId != null).length;

  // ── Submit a top-level comment ──────────────────────────────────────────
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong.");
        return;
      }
      setStatus("idle");
      setForm({ name: "", body: "", website: "" });
      if (data.comment) {
        setFlat((prev) => [...prev, data.comment]);
      } else {
        load();
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  // ── Submit a reply ───────────────────────────────────────────────────────
  async function onReply(e: React.FormEvent, parentId: number) {
    e.preventDefault();
    setReplyStatus("loading");
    setReplyError("");
    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...replyForm, parentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReplyStatus("error");
        setReplyError(data.error || "Something went wrong.");
        return;
      }
      setReplyStatus("idle");
      setReplyForm({ name: "", body: "", website: "" });
      setReplyTo(null);
      if (data.comment) {
        setFlat((prev) => [...prev, data.comment]);
      } else {
        load();
      }
    } catch {
      setReplyStatus("error");
      setReplyError("Network error. Please try again.");
    }
  }

  // ── Admin: delete a comment ─────────────────────────────────────────────
  async function onDelete(id: number) {
    if (!confirm("Delete this comment? Its replies will also be removed.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/comments/${slug}?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        // remove the comment and any replies under it
        setFlat((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
      }
    } catch {
      /* ignore */
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-6">
      {/* Header bar */}
      <div
        className="px-5 py-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
        style={{
          border: "1px solid var(--border-hi)",
          borderBottom: "none",
          background: "var(--surface-2)",
          color: "var(--fg-muted)",
        }}
      >
        // comments &nbsp; [ {loading ? "..." : `${flat.length} ${
          flat.length === 1 ? "thread" : "threads"
        }`} {totalReplies > 0 ? `/ ${totalReplies} ${totalReplies === 1 ? "reply" : "replies"}` : ""} ]
        {isAdmin && (
          <span style={{ color: "var(--hi)" }}> · MOD MODE</span>
        )}
      </div>

      <div
        className="border p-5 md:p-6"
        style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
      >
        {/* Comment threads */}
        {loading ? (
          <div className="py-6 text-center text-[0.8rem]" style={{ color: "var(--fg-muted)" }}>
            <span className="animate-pulse">loading comments...</span>
          </div>
        ) : threads.length === 0 ? (
          <div className="py-6 text-center text-[0.82rem]" style={{ color: "var(--fg-muted)" }}>
            // no comments yet. be the first to leave one.
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {threads.map((t) => (
              <li key={t.id}>
                {/* Top-level comment */}
                <CommentRow
                  c={t}
                  onReply={() => setReplyTo(t.id)}
                  canDelete={isAdmin}
                  onDelete={onDelete}
                  deleting={deletingId === t.id}
                />

                {/* Replies */}
                {t.replies.length > 0 && (
                  <ul
                    className="mt-3 flex flex-col gap-3 border-l-2 pl-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {t.replies.map((r) => (
                      <li key={r.id}>
                        <CommentRow
                          c={r}
                          isReply
                          parentName={t.name}
                          onReply={() => setReplyTo(t.id)}
                          canDelete={isAdmin}
                          onDelete={onDelete}
                          deleting={deletingId === r.id}
                        />
                      </li>
                    ))}
                  </ul>
                )}

                {/* Inline reply form */}
                {replyTo === t.id && (
                  <div
                    className="mt-3 border-l-2 pl-4"
                    style={{ borderColor: "var(--border-hi)" }}
                  >
                    <form onSubmit={(e) => onReply(e, t.id)}>
                      {/* Honeypot */}
                      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={replyForm.website}
                          onChange={(e) => setReplyForm({ ...replyForm, website: e.target.value })}
                        />
                      </div>

                      <div
                        className="mb-2 text-[0.6rem] font-bold uppercase tracking-[0.2em]"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        ↳ replying to {t.name.toLowerCase().replace(/\s+/g, "_")}
                      </div>

                      <div className="mb-2 flex items-center gap-0">
                        <label
                          className="w-20 shrink-0 border-r px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider"
                          style={{
                            borderColor: "var(--border)",
                            color: "var(--fg-muted)",
                            background: "var(--surface-2)",
                          }}
                        >
                          NAME
                        </label>
                        <input
                          required
                          type="text"
                          maxLength={80}
                          value={replyForm.name}
                          onChange={(e) => setReplyForm({ ...replyForm, name: e.target.value })}
                          placeholder="your_name"
                          style={smallInputStyle}
                          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-hi)"; }}
                          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
                        />
                      </div>

                      <textarea
                        required
                        rows={2}
                        maxLength={2000}
                        value={replyForm.body}
                        onChange={(e) => setReplyForm({ ...replyForm, body: e.target.value })}
                        placeholder={`// reply to ${t.name.split(" ")[0]}...`}
                        style={{ ...smallInputStyle, resize: "vertical", marginBottom: "0.6rem" }}
                        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border-hi)"; }}
                        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
                      />

                      {replyStatus === "error" && (
                        <div
                          className="mb-2 px-3 py-2 text-[0.78rem] font-bold"
                          style={{ border: "1px solid var(--border-hi)", color: "var(--hi)", background: "var(--surface-2)" }}
                        >
                          ✗ ERROR: {replyError}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={replyStatus === "loading"}
                          className="btn btn-fill"
                          style={replyStatus === "loading" ? { opacity: 0.6 } : { fontSize: "0.7rem", padding: "0.35rem 0.8rem" }}
                        >
                          {replyStatus === "loading" ? "POSTING..." : "POST REPLY →"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setReplyTo(null); setReplyError(""); setReplyStatus("idle"); }}
                          className="text-[0.7rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          [CANCEL]
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Divider */}
        <div className="my-5" style={{ borderTop: "1px solid var(--border)" }} />

        {/* Main comment form */}
        <form onSubmit={onSubmit}>
          {/* Honeypot — hidden from humans */}
          <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
          </div>

          <div className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--fg-muted)" }}>
            $ ./comment.sh
          </div>

          <div className="mb-3 flex items-center gap-0">
            <label
              className="w-24 shrink-0 border-r px-4 py-3 text-[0.72rem] font-bold uppercase tracking-wider"
              style={{ borderColor: "var(--border)", color: "var(--fg-muted)", background: "var(--surface-2)" }}
            >
              NAME
            </label>
            <input
              required
              type="text"
              maxLength={80}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="your_name"
              style={inputStyle}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-hi)"; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
            />
          </div>

          <textarea
            required
            rows={3}
            maxLength={2000}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="// share your thoughts..."
            style={{ ...inputStyle, resize: "vertical", marginBottom: "0.75rem" }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border-hi)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
          />

          {status === "error" && (
            <div
              className="mb-3 px-3 py-2 text-[0.8rem] font-bold"
              style={{ border: "1px solid var(--border-hi)", color: "var(--hi)", background: "var(--surface-2)" }}
            >
              ✗ ERROR: {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] font-bold" style={{ color: "var(--fg-muted)" }}>
              // {form.body.length}/2000
            </span>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn btn-fill"
              style={status === "loading" ? { opacity: 0.6 } : {}}
            >
              {status === "loading" ? "POSTING..." : "POST COMMENT →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ── Single comment row (top-level or reply) ─────────────────────────────────
function CommentRow({
  c,
  isReply,
  parentName,
  onReply,
  canDelete,
  onDelete,
  deleting,
}: {
  c: Comment;
  isReply?: boolean;
  parentName?: string;
  onReply: () => void;
  canDelete: boolean;
  onDelete: (id: number) => void;
  deleting: boolean;
}) {
  const handle = c.name.toLowerCase().replace(/\s+/g, "_");
  return (
    <div className="group">
      <div
        className="mb-1 flex items-baseline gap-2 text-[0.7rem] font-bold uppercase tracking-wider"
        style={{ color: "var(--fg-muted)" }}
      >
        <span style={{ color: isReply ? "var(--hi-2)" : "var(--hi)" }}>{handle}</span>
        <span>@blog</span>
        {isReply && parentName && (
          <span style={{ color: "var(--fg-muted)" }}>
            ↳ {parentName.toLowerCase().replace(/\s+/g, "_")}
          </span>
        )}
        <span style={{ color: "var(--fg-muted)" }}>· {timeAgo(c.createdAt)}</span>
      </div>
      <div
        className="whitespace-pre-wrap break-words text-[0.85rem] leading-relaxed"
        style={{ color: "var(--fg-dim)", paddingLeft: "0.25rem" }}
      >
        <span style={{ color: "var(--fg-muted)" }}>{"> "}</span>
        {c.body}
      </div>
      <div className="mt-1.5 flex gap-3">
        <button
          type="button"
          onClick={onReply}
          className="text-[0.65rem] font-bold uppercase tracking-wider opacity-60 transition-opacity hover:opacity-100"
          style={{ color: "var(--fg-dim)" }}
        >
          ↳ [REPLY]
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(c.id)}
            disabled={deleting}
            className="text-[0.65rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
            style={{ color: deleting ? "var(--fg-muted)" : "var(--fg-muted)" }}
          >
            {deleting ? "[DELETING...]" : "✗ [DELETE]"}
          </button>
        )}
      </div>
    </div>
  );
}
