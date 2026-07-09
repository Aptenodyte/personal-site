"use client";

import { useState } from "react";

export function Counter({ start = 0 }: { start?: number }) {
  const [count, setCount] = useState(start);
  return (
    <div
      style={{
        margin: "1.5rem 0",
        border: "1px solid var(--border-hi)",
        background: "var(--surface)",
        padding: "1.25rem 1.5rem",
        fontFamily: "var(--font-mono)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "1rem",
      }}
    >
      <div
        style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--fg-muted)" }}
      >
        // interactive_widget :: counter
      </div>
      <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "var(--hi)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {String(count).padStart(3, "0")}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[
          { label: "[ -- ]", fn: () => setCount((c) => c - 1) },
          { label: "[ RESET ]", fn: () => setCount(start) },
          { label: "[ ++ ]", fn: () => setCount((c) => c + 1), fill: true },
        ].map(({ label, fn, fill }) => (
          <button
            key={label}
            onClick={fn}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "0.35rem 0.7rem",
              border: "1px solid var(--border-hi)",
              background: fill ? "var(--fg)" : "transparent",
              color: fill ? "var(--bg)" : "var(--fg)",
              cursor: "pointer",
              textShadow: "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
