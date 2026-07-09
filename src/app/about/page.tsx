import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SocialIcon } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "About",
  description: site.about.intro,
};

export default function AboutPage() {
  return (
    <div className="page pb-16 pt-32 md:pt-36">
      <SectionHeading
        id="01"
        label="about.txt"
        title="ABOUT ME"
        description={site.about.intro}
      />

      {/* Bio */}
      <Reveal className="mt-10">
        <div
          className="border p-6 md:p-8"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div
            className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            $ cat bio.txt
          </div>
          <div
            className="space-y-4 text-[0.9rem] leading-relaxed"
            style={{ color: "var(--fg-dim)" }}
          >
            {site.about.body.map((p, i) => (
              <p key={i}>
                {i === 0 && (
                  <span style={{ color: "var(--hi)", marginRight: "0.4em" }}>
                    &gt;
                  </span>
                )}
                {p}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Identity block */}
      <Reveal className="mt-4" delay={0.1}>
        <div
          className="grid border md:grid-cols-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {/* Stat block */}
          <div
            className="border-b p-6 md:border-b-0 md:border-r"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              $ env | grep USER_INFO
            </div>
            {[
              ["NAME",      site.name],
              ["ROLE",      site.role],
              ["LOCATION",  site.location],
              ["SCHOOL",    site.about.education.school],
              ["DEGREE",    site.about.education.degree],
              ["GRAD",      site.about.education.period],
              ["GPA",       site.about.education.gpa],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 py-0.5 text-[0.82rem]">
                <span
                  className="w-24 shrink-0 font-bold uppercase tracking-wider"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {k}
                </span>
                <span style={{ color: "var(--fg-dim)" }}>
                  = &quot;{v}&quot;
                </span>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="p-6">
            <div
              className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              $ cat links.json
            </div>
            <div className="flex flex-col gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2.5 text-[0.82rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
                  style={{ color: "var(--fg-dim)" }}
                >
                  <SocialIcon name={s.icon} className="h-3.5 w-3.5" />
                  {s.label}
                  <span style={{ color: "var(--fg-muted)" }}>
                    → {s.href}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Focus areas */}
      <Reveal className="mt-10">
        <div
          className="mb-1 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
          style={{ background: "var(--surface-2)", color: "var(--fg-muted)", border: "1px solid var(--border)", borderBottom: "none" }}
        >
          $ ls focuses/
        </div>
        <div
          className="grid divide-y border md:grid-cols-3 md:divide-x md:divide-y-0"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {site.about.focuses.map((f, i) => (
            <div key={f.title} className="p-5" style={{ borderColor: "var(--border)" }}>
              <span
                className="text-[0.62rem] font-bold uppercase tracking-widest"
                style={{ color: "var(--fg-muted)" }}
              >
                [{String(i + 1).padStart(2, "0")}]
              </span>
              <h3
                className="mt-1.5 text-[0.88rem] font-bold uppercase tracking-wide"
                style={{ color: "var(--fg)" }}
              >
                {f.title}
              </h3>
              <p
                className="mt-2 text-[0.82rem] leading-relaxed"
                style={{ color: "var(--fg-dim)" }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Coursework + honors */}
      <Reveal className="mt-4">
        <div
          className="grid border md:grid-cols-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div
            className="border-b p-5 md:border-b-0 md:border-r"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              $ cat coursework.txt
            </div>
            <p
              className="text-[0.82rem] leading-relaxed"
              style={{ color: "var(--fg-dim)" }}
            >
              {site.about.education.detail}
            </p>
          </div>
          <div className="p-5">
            <div
              className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              $ cat honors.txt
            </div>
            <p
              className="text-[0.82rem] leading-relaxed"
              style={{ color: "var(--fg-dim)" }}
            >
              {site.about.education.honors}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
