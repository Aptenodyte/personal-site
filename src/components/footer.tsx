import Link from "next/link";
import { site } from "@/lib/site";
import { SocialIcon } from "@/components/social-icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t"
      style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
    >
      {/* Main footer row */}
      <div className="page grid gap-8 py-10 md:grid-cols-[1fr_auto_auto]">
        {/* Branding */}
        <div>
          <Link
            href="/"
            className="text-[0.82rem] font-bold uppercase tracking-[0.15em] transition-colors hover:text-[var(--hi)]"
            style={{ color: "var(--fg-dim)" }}
          >
            {site.name}
          </Link>
          <p
            className="mt-3 max-w-xs text-[0.8rem] leading-relaxed"
            style={{ color: "var(--fg-muted)" }}
          >
            // {site.summary}
          </p>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-2">
          <span
            className="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            // sitemap
          </span>
          {[
            ["/about",      "about"],
            ["/experience", "experience"],
            ["/blog",       "writing"],
            ["/contact",    "contact"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-[0.8rem] font-bold uppercase tracking-widest transition-colors hover:text-[var(--hi)]"
              style={{ color: "var(--fg-dim)" }}
            >
              → {label}
            </Link>
          ))}
        </div>

        {/* Socials */}
        <div className="flex flex-col gap-2">
          <span
            className="mb-1 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            // links
          </span>
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-widest transition-colors hover:text-[var(--hi)]"
              style={{ color: "var(--fg-dim)" }}
            >
              <SocialIcon name={s.icon} className="h-3.5 w-3.5" />
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div
        className="border-t px-4 py-2"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="page flex flex-wrap items-center justify-between gap-4">
          <span
            className="text-[0.62rem] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--fg-muted)" }}
          >
            © {year} {site.name}
          </span>
          <span
            className="text-[0.62rem] font-bold"
            style={{ color: "var(--fg-muted)" }}
          >
            [EOF]
          </span>
        </div>
      </div>
    </footer>
  );
}
