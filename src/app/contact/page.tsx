import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { SocialIcon } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="page pb-16 pt-32 md:pt-36">
      <SectionHeading
        id="04"
        label="contact.sh"
        title="GET IN TOUCH"
        description="Internship, project, or just want to talk about security and privacy? Email's the best way to reach me."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        {/* Left panel */}
        <Reveal className="flex flex-col gap-4">
          {/* Direct */}
          <div
            className="border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div
              className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              // direct_line
            </div>
            <a
              href={`mailto:${site.email}`}
              className="block text-[0.88rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
              style={{ color: "var(--fg-dim)" }}
            >
              → {site.email}
            </a>
            <p
              className="mt-1.5 text-[0.78rem]"
              style={{ color: "var(--fg-muted)" }}
            >
              // {site.location}
            </p>
          </div>

          {/* Socials */}
          <div
            className="border p-5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div
              className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--fg-muted)" }}
            >
              // socials
            </div>
            <div className="flex flex-col gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-[0.82rem] font-bold uppercase tracking-wider transition-colors hover:text-[var(--hi)]"
                  style={{ color: "var(--fg-dim)" }}
                >
                  <SocialIcon name={s.icon} className="h-3.5 w-3.5" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>

        </Reveal>

        {/* Right: form */}
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
