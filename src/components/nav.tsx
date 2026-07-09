"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";

const LINKS = [
  { href: "/about",      label: "about",      n: "01" },
  { href: "/experience", label: "experience", n: "02" },
  { href: "/blog",       label: "writing",    n: "03" },
  { href: "/contact",    label: "contact",    n: "04" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [time, setTime]         = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200"
      style={{
        borderColor: scrolled ? "var(--border-hi)" : "var(--border)",
        background: "var(--bg)",
      }}
    >
      {/* ── top status bar ── */}
      <div
        className="border-b px-4 py-0.5"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="page flex items-center justify-between">
          <span
            className="text-[0.62rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            {site.username}
          </span>
          <span
            className="cursor text-[0.62rem] font-bold tracking-widest"
            style={{ color: "var(--fg-muted)" }}
          >
            {time}
          </span>
        </div>
      </div>

      {/* ── main nav ── */}
      <nav className="page flex h-11 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-bold uppercase tracking-widest transition-colors"
          style={{ fontSize: "0.8rem", color: "var(--fg)" }}
        >
          <span style={{ color: "var(--fg-dim)" }}>{site.name}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-0 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-4 py-3 text-[0.75rem] font-bold uppercase tracking-widest transition-colors"
              style={{
                color: isActive(l.href) ? "var(--hi)" : "var(--fg-muted)",
                borderRight: "1px solid var(--border)",
              }}
            >
              {isActive(l.href) && (
                <motion.span
                  layoutId="nav-bar"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--hi)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span style={{ color: "var(--fg-muted)", marginRight: "0.3em", fontSize: "0.6rem" }}>
                {l.n}
              </span>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="md:hidden text-[0.75rem] font-bold uppercase tracking-widest transition-colors"
          style={{ color: open ? "var(--hi)" : "var(--fg-muted)" }}
        >
          {open ? "[CLOSE]" : "[MENU]"}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div className="page flex flex-col py-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-2.5 text-[0.8rem] font-bold uppercase tracking-widest"
                  style={{
                    color: isActive(l.href) ? "var(--hi)" : "var(--fg-dim)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span style={{ color: "var(--fg-muted)", marginRight: "0.5em", fontSize: "0.65rem" }}>
                    {l.n}
                  </span>
                  {l.label}
                </Link>
              ))}
              <Link href="/contact" className="btn btn-fill mt-3 self-start">
                GET IN TOUCH
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
