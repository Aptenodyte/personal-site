"use client";

import { Children, useState, type ReactNode } from "react";

export function Tabs({
  labels,
  children,
}: {
  labels?: string;
  children: ReactNode;
}) {
  const panels = Children.toArray(children).filter(
    (c) => !(typeof c === "string" && c.trim() === "")
  );
  const parsed =
    labels && labels.trim()
      ? labels.split("|").map((s) => s.trim()).filter(Boolean)
      : [];
  const tabs = parsed.length > 0 ? parsed : panels.map((_, i) => `tab_${i + 1}`);
  const [active, setActive] = useState(0);

  if (panels.length === 0) return null;

  return (
    <div
      style={{
        margin: "1.5rem 0",
        border: "1px solid var(--border-hi)",
        background: "var(--surface)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface-2)",
        }}
      >
        {tabs.map((label, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: "0.45rem 1rem",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "none",
              borderRight: "1px solid var(--border)",
              cursor: "pointer",
              background: active === i ? "var(--fg)" : "transparent",
              color: active === i ? "var(--bg)" : "var(--fg-muted)",
              fontFamily: "var(--font-mono)",
              textShadow: "none",
              transition: "background 0.1s, color 0.1s",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ padding: "1rem 1.1rem", color: "var(--fg-dim)", fontSize: "0.88rem", lineHeight: 1.65 }}>
        {panels[active]}
      </div>
    </div>
  );
}
