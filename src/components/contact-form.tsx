"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error,  setError]  = useState<string>("");
  const [form,   setForm]   = useState({ name: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res  = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); setError(data.error || "error."); return; }
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setError("network error. try again.");
    }
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

  if (status === "success") {
    return (
      <div
        className="border p-8"
        style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
      >
        <p
          className="text-[0.62rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--fg-muted)" }}
        >
          // response received
        </p>
        <p
          className="mt-3 text-[0.95rem] font-bold uppercase tracking-wide"
          style={{ color: "var(--hi)" }}
        >
          ✓ MESSAGE SENT.
        </p>
        <p
          className="mt-2 text-[0.82rem] leading-relaxed"
          style={{ color: "var(--fg-dim)" }}
        >
          I&apos;ll reply to {form.email || "your email"} as soon as I can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn mt-6"
        >
          SEND ANOTHER
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border"
      style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
    >
      {/* Header */}
      <div
        className="border-b px-5 py-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
        style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--fg-muted)" }}
      >
        $ ./send_message.sh
      </div>

      <div className="flex flex-col gap-0">
        {/* NAME */}
        <div
          className="flex items-center gap-0 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <label
            className="w-24 shrink-0 border-r px-4 py-3 text-[0.72rem] font-bold uppercase tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--fg-muted)", background: "var(--surface-2)" }}
          >
            NAME
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="your_name"
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-hi)"; }}
            onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
          />
        </div>

        {/* EMAIL */}
        <div
          className="flex items-center gap-0 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <label
            className="w-24 shrink-0 border-r px-4 py-3 text-[0.72rem] font-bold uppercase tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--fg-muted)", background: "var(--surface-2)" }}
          >
            EMAIL
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border-hi)"; }}
            onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
          />
        </div>

        {/* MESSAGE */}
        <div
          className="flex border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <label
            className="w-24 shrink-0 border-r px-4 py-3 text-[0.72rem] font-bold uppercase tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--fg-muted)", background: "var(--surface-2)" }}
          >
            MSG
          </label>
          <textarea
            required
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="// what's on your mind?"
            style={{ ...inputStyle, resize: "none" }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border-hi)"; }}
            onBlur={(e)  => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"; }}
          />
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <div
          className="border-b px-5 py-2.5 text-[0.8rem] font-bold"
          style={{ borderColor: "var(--border)", color: "var(--hi)", background: "var(--surface-2)" }}
        >
          ✗ ERROR: {error}
        </div>
      )}

      {/* Submit */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: "var(--surface-2)" }}
      >
        <span
          className="text-[0.65rem] font-bold"
          style={{ color: "var(--fg-muted)" }}
        >
          // or: <a href={`mailto:${site.email}`} style={{ color: "var(--hi-2)" }}>{site.email}</a>
        </span>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-fill"
          style={status === "loading" ? { opacity: 0.6 } : {}}
        >
          {status === "loading" ? "SENDING..." : "SEND →"}
        </button>
      </div>
    </form>
  );
}
