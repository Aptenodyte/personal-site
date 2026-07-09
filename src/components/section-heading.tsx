import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

type Props = {
  id?: string;          // e.g. "01"
  label?: string;       // e.g. "about"
  title: ReactNode;
  description?: ReactNode;
};

export function SectionHeading({ id, label, title, description }: Props) {
  return (
    <Reveal>
      {/* ASCII top rule */}
      <div
        className="mb-6 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--border-hi)", paddingBottom: "0.6rem" }}
      >
        {id && (
          <span
            className="px-1 text-[0.65rem] font-bold"
            style={{ background: "var(--fg)", color: "var(--bg)" }}
          >
            {id}
          </span>
        )}
        {label && (
          <span
            className="text-[0.65rem] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--fg-muted)" }}
          >
            // {label}
          </span>
        )}
      </div>
      <h1
        className="text-[clamp(1.6rem,5vw,2.8rem)] font-bold uppercase leading-tight tracking-wider"
        style={{ color: "var(--fg)" }}
      >
        {title}
      </h1>
      {description && (
        <p
          className="mt-5 max-w-2xl text-[0.9rem] leading-relaxed"
          style={{ color: "var(--fg-dim)" }}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
