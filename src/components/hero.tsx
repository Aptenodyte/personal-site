"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

/* Lines that "type" into the terminal, one by one */
const BOOT_SEQUENCE = [
  { t: "cmd",     text: `whoami` },
  { t: "out",     text: site.name },
  { t: "gap",     text: "" },
  { t: "cmd",     text: "cat about.txt" },
  { t: "out",     text: site.tagline },
  { t: "gap",     text: "" },
  { t: "cmd",     text: "cat status.txt" },
  { t: "out",     text: `location   ${site.location}` },
  { t: "out",     text: `role       ${site.role}` },
  { t: "gap",     text: "" },
];

type Line = (typeof BOOT_SEQUENCE)[number];

const STEP_DELAY = 280;

/* Arrow width — the point extends this many px, and the next segment overlaps
   by the same amount so its notch receives the point exactly. They interlock
   into a single flowing chevron line instead of two protruding edges. */
const W = 6;

/* Middle segment: CONCAVE notch on the left (receives the previous point) +
   CONVEX point on the right (extends into the next notch). The left edge dips
   INWARD to (W, 50%), not outward, so it receives rather than protrudes. */
const ARROW = `polygon(0 0, calc(100% - ${W}px) 0, 100% 50%, calc(100% - ${W}px) 100%, 0 100%, ${W}px 50%)`;
/* First segment: flat left edge, point on the right. */
const ARROW_START = `polygon(0 0, calc(100% - ${W}px) 0, 100% 50%, calc(100% - ${W}px) 100%, 0 100%)`;
/* Last segment: concave notch on the left (receives previous point), flat right edge. */
const ARROW_END = `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${W}px 50%)`;

/* ── Zellij tab bar ── */
const TABS = [
  { name: "home", active: true },
  { name: "about", active: false },
  { name: "experience", active: false },
  { name: "writing", active: false },
  { name: "contact", active: false },
];

/* ── Zellij status bar segments ──
   First entry is the "Ctrl +" prefix; the rest are <letter> LABEL pairs.
   All segments use the same theme surface — no per-segment color. */
const STATUS_SEGMENTS = [
  { key: "Ctrl +", label: null },
  { key: "<p>",    label: "Pane" },
  { key: "<t>",    label: "Tab" },
  { key: "<n>",    label: "Resize" },
  { key: "<s>",    label: "Scroll" },
  { key: "<o>",    label: "Session" },
  { key: "<q>",    label: "Quit" },
];

export function Hero() {
  const [lines, setLines] = useState<Line[]>([]);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
        if (cancelled) return;
        await delay(i === 0 ? 300 : STEP_DELAY);
        setLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
        if (i === BOOT_SEQUENCE.length - 1 && !cancelled) setDone(true);
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [lines]);

  const prompt = `${site.username}@portfolio:~$`;

  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-28 pb-6">
      <div className="w-full max-w-4xl" style={{ fontFamily: "var(--font-mono)" }}>
        {/* ── Tab bar (interlocking chevrons) ── */}
        <div
          className="flex items-center overflow-hidden rounded-t-lg border border-b-0"
          style={{ borderColor: "var(--border-hi)", background: "var(--bg)" }}
        >
          {/* zellij label = first tab (flat left, point right) */}
          <div
            className="flex items-center justify-center text-[0.68rem] font-bold uppercase tracking-widest"
            style={{
              clipPath: ARROW_START,
              background: "var(--fg)",
              color: "var(--bg)",
              height: "1.9rem",
              /* W extra on the right for the arrow point */
              padding: "0 calc(0.6rem + 10px) 0 0.6rem",
            }}
          >
            zellij
          </div>
          {TABS.map((tab, i) => {
            const last = TABS.length - 1;
            const clip = i === last ? ARROW_END : ARROW;
            return (
              <div
                key={tab.name}
                className="flex items-center justify-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-wider"
                style={{
                  clipPath: clip,
                  background: tab.active ? "var(--surface-2)" : "var(--surface)",
                  color: tab.active ? "var(--hi)" : "var(--fg-muted)",
                  height: "1.9rem",
                  /* W extra on both sides so text sits centered in the
                     visible (clipped) region, not the full element box. */
                  padding: `0 calc(0.5rem + ${W}px)`,
                  marginLeft: `-${W}px`,
                }}
              >
                <span style={{ color: tab.active ? "var(--hi)" : "var(--fg-muted)", fontSize: "0.5rem" }}>
                  ●
                </span>
                {tab.name}
              </div>
            );
          })}
        </div>

        {/* ── Terminal body wrapper — encompasses screen + status bar. Content
            is clipped to rounded bottom corners; the border itself is an
            overlay drawn ON TOP (z-20) so it layers above the status bar. */}
        <div className="relative overflow-hidden rounded-b-lg">
          {/* Screen content */}
          <div
            className="relative min-h-[380px] p-6 md:p-8"
            style={{ background: "var(--bg)" }}
          >
            {/* Path header line (replaces the floating title chips) */}
            <div
              className="mb-4 flex items-center justify-between border-b pb-2"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-[0.66rem] font-bold" style={{ color: "var(--fg-muted)" }}>
                ~/{site.username}
              </span>
              <span className="text-[0.62rem] font-bold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
                NORMAL
              </span>
            </div>

            <div className="relative space-y-0.5">
              {lines.map((l, i) => (
                <div key={i} className="leading-relaxed" style={{ fontSize: "0.875rem" }}>
                  {l.t === "gap" ? (
                    <span>&nbsp;</span>
                  ) : l.t === "cmd" ? (
                    <span>
                      <span style={{ color: "var(--hi)", marginRight: "0.5em" }}>{prompt}</span>
                      <span style={{ color: "var(--fg)" }}>{l.text}</span>
                    </span>
                  ) : l.t === "system" ? (
                    <span style={{ color: "var(--fg-muted)", fontStyle: "italic" }}>
                      # {l.text}
                    </span>
                  ) : (
                    <span style={{ color: "var(--fg-dim)", paddingLeft: "1rem" }}>{l.text}</span>
                  )}
                </div>
              ))}

              {/* Blinking cursor line */}
              <div style={{ height: "1.5rem" }}>
                {done ? (
                  <span>
                    <span style={{ color: "var(--hi)", marginRight: "0.5em" }}>{prompt}</span>
                    <span
                      className="inline-block w-[0.6em] bg-[var(--hi)]"
                      style={{ height: "1.1em", verticalAlign: "text-bottom", animation: "blink 1.1s step-end infinite" }}
                    />
                  </span>
                ) : (
                  <span style={{ color: "var(--fg-muted)" }} className="animate-pulse">
                    loading...
                  </span>
                )}
              </div>
            </div>
            <div ref={bottomRef} />
          </div>

          {/* ── Status bar ──
              The container is bright (var(--fg)); each segment is dark
              (var(--surface)) with a clip-path that carves a ">" notch on its
              left edge. Segments do NOT overlap — placed flush side by side,
              so each notch gap reveals the bright container as a clearly
              visible chevron separator. No border on the row itself. */}
          <div
            className="flex items-stretch overflow-x-auto text-[0.66rem] font-bold uppercase tracking-wide status-scroll"
            style={{ background: "var(--fg)" }}
          >
            {STATUS_SEGMENTS.map((seg, i) => {
              const last = STATUS_SEGMENTS.length - 1;
              const clip = i === 0 ? ARROW_START : i === last ? ARROW_END : ARROW;
              return (
                <div
                  key={seg.key}
                  className="flex items-stretch justify-center"
                  style={{
                    clipPath: clip,
                    background: "var(--surface)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="flex items-center gap-1.5"
                    style={{
                      color: "var(--fg-muted)",
                      padding: `0.5rem calc(0.6rem + ${W}px)`,
                    }}
                  >
                    <span style={{ color: "var(--hi)" }}>{seg.key}</span>
                    {seg.label && (
                      <span>{seg.label}</span>
                    )}
                  </span>
                </div>
              );
            })}
            {/* trailing fill so the row spans the full terminal width on desktop */}
            <div className="flex-1" style={{ background: "var(--surface)", flexShrink: 1, minWidth: 0 }} />
          </div>

          {/* Border overlay — drawn ABOVE everything (including the status bar)
              so the terminal border layers over the status bar controls. */}
          <div
            className="pointer-events-none absolute inset-0 z-20 rounded-b-lg border"
            style={{ borderColor: "var(--border-hi)" }}
          />
        </div>

        {/* ── CTA bar ── */}
        <div className="flex flex-wrap items-center gap-3 px-1 py-4">
          <Link href="/experience" className="btn btn-fill">VIEW WORK</Link>
          <Link href="/blog" className="btn">READ WRITING</Link>
          <Link href="/contact" className="btn">SAY HELLO</Link>
        </div>
      </div>
    </section>
  );
}

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}
