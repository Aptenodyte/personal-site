import type { ReactNode } from "react";

/* ============================================================================
   MDX BLOCKS — terminal-styled server components for .mdx posts.
============================================================================ */

const CALLOUT_PREFIXES: Record<string, string> = {
  note: "NOTE",
  tip:  "TIP ",
  warn: "WARN",
  info: "INFO",
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: string;
  title?: string;
  children: ReactNode;
}) {
  const prefix = CALLOUT_PREFIXES[type] ?? "NOTE";
  const headColor = type === "warn" ? "var(--hi)" : type === "tip" ? "var(--hi-2)" : "var(--fg-dim)";
  return (
    <aside
      style={{
        margin: "1.5rem 0",
        border: "1px solid var(--border-hi)",
        background: "var(--surface-2)",
        padding: "0.9rem 1.1rem",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: headColor,
          marginBottom: "0.4rem",
        }}
      >
        // {title ?? prefix}
      </div>
      <div style={{ color: "var(--fg-dim)", fontSize: "0.88rem", lineHeight: 1.65 }}>
        {children}
      </div>
    </aside>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        margin: "1.5rem 0",
        border: "1px solid var(--border-hi)",
        background: "var(--surface)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "baseline",
        gap: "1rem",
        fontFamily: "var(--font-mono)",
      }}
    >
      <span style={{ fontSize: "2.75rem", fontWeight: 700, color: "var(--hi)", lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)" }}>
        // {label}
      </span>
    </div>
  );
}

export function Figure({ src, alt = "", caption }: { src: string; alt?: string; caption?: string }) {
  return (
    <figure style={{ margin: "1.5rem 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", border: "1px solid var(--border-hi)", display: "block" }}
      />
      {caption && (
        <figcaption
          style={{
            marginTop: "0.4rem",
            fontSize: "0.7rem",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            color: "var(--fg-muted)",
          }}
        >
          // {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Pullquote({ children }: { children: ReactNode }) {
  return (
    <blockquote
      style={{
        margin: "1.75rem 0",
        borderLeft: "3px solid var(--border-hi)",
        paddingLeft: "1.2rem",
        fontFamily: "var(--font-mono)",
        fontSize: "1.05rem",
        color: "var(--fg)",
        lineHeight: 1.55,
      }}
    >
      <span style={{ color: "var(--fg-muted)", marginRight: "0.4em" }}>&gt;&gt;</span>
      {children}
    </blockquote>
  );
}

export function Divider() {
  return (
    <div
      style={{
        margin: "2rem 0",
        textAlign: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        letterSpacing: "0.4em",
        color: "var(--fg-muted)",
      }}
    >
      - - - - - - - - - -
    </div>
  );
}

export function Terminal({
  title = "bash",
  lines = "",
}: {
  title?: string;
  lines: string;
}) {
  const rows = lines
    .split(";;")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        margin: "1.5rem 0",
        border: "1px solid var(--border-hi)",
        background: "var(--surface-2)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0.35rem 0.75rem",
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          background: "var(--surface)",
        }}
      >
        {title}
      </div>
      <pre
        style={{
          padding: "0.85rem 1rem",
          overflowX: "auto",
          fontSize: "0.85rem",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {rows.map((l, i) => (
          <div key={i}>
            {l.startsWith("$") ? (
              <span>
                <span style={{ color: "var(--hi)", marginRight: "0.4em" }}>{">"}</span>
                <span style={{ color: "var(--fg)" }}>{l.slice(1).trimStart()}</span>
              </span>
            ) : (
              <span style={{ color: "var(--fg-dim)" }}>{l}</span>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
