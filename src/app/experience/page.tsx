import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Experience",
  description: "Internships, teaching, and projects.",
};

export default function ExperiencePage() {
  return (
    <div className="page pb-16 pt-32 md:pt-36">
      <SectionHeading
        id="02"
        label="experience.log"
        title="EXPERIENCE"
        description="Stuff I've done and/or are doing."
      />

      <div className="mt-10 space-y-4">
        {site.experiences.map((exp, i) => (
          <Reveal key={`${exp.company}-${i}`} delay={i * 0.06}>
            <div
              className="border"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              {/* Header bar */}
              <div
                className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b px-5 py-3"
                style={{ borderColor: "var(--border-hi)", background: "var(--surface-2)" }}
              >
                <span
                  className="text-[0.62rem] font-bold"
                  style={{ color: "var(--fg-muted)" }}
                >
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <span
                  className="font-bold uppercase tracking-wide"
                  style={{ fontSize: "0.9rem", color: "var(--hi)" }}
                >
                  {exp.role}
                </span>
                <span
                  className="font-bold uppercase tracking-wider"
                  style={{ fontSize: "0.78rem", color: "var(--fg-dim)" }}
                >
                  @ {exp.company}
                </span>
                <span
                  className="ml-auto text-[0.7rem] font-bold uppercase tracking-widest"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {exp.period} // {exp.location}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <p
                  className="text-[0.85rem] leading-relaxed"
                  style={{ color: "var(--fg-dim)" }}
                >
                  {exp.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {exp.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex gap-2.5 text-[0.82rem] leading-relaxed"
                      style={{ color: "var(--fg-dim)" }}
                    >
                      <span style={{ color: "var(--fg-muted)", flexShrink: 0 }}>
                        {String(j + 1).padStart(2, "0")}.
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Projects */}
      <div className="mt-14">
        <div
          className="mb-1 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
          style={{ background: "var(--surface-2)", color: "var(--fg-muted)", border: "1px solid var(--border)", borderBottom: "none" }}
        >
          $ ls projects/ &nbsp;&nbsp; // {site.projects.length} builds
        </div>
        <div
          className="grid divide-y border md:grid-cols-2 md:divide-x md:divide-y-0"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {site.projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.06}>
              <div className="flex h-full flex-col p-5" style={{ borderColor: "var(--border)" }}>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h3
                    className="text-[0.95rem] font-bold uppercase tracking-wide"
                    style={{ color: "var(--fg)" }}
                  >
                    {p.name}
                  </h3>
                  <span
                    className="text-[0.62rem] font-bold"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                </div>
                <p
                  className="text-[0.78rem] font-bold uppercase tracking-wider"
                  style={{ color: "var(--hi-2)" }}
                >
                  // {p.tagline}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {p.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-[0.8rem] leading-relaxed"
                      style={{ color: "var(--fg-dim)" }}
                    >
                      <span style={{ color: "var(--fg-muted)", flexShrink: 0 }}>
                        {String(j + 1).padStart(2, "0")}.
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Resume CTA */}
      <Reveal className="mt-8">
        <div
          className="flex flex-col items-start gap-4 border p-6 md:flex-row md:items-center md:justify-between md:p-8"
          style={{ borderColor: "var(--border-hi)", background: "var(--surface)" }}
        >
          <div>
            <div
              className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              // resume.pdf
            </div>
            <p
              className="text-[0.88rem] leading-relaxed"
              style={{ color: "var(--fg-dim)" }}
            >
              Want the full picture? Happy to share a detailed résumé on request.
            </p>
          </div>
          <a href="/contact" className="btn btn-fill shrink-0">
            CONTACT ME
          </a>
        </div>
      </Reveal>
    </div>
  );
}
