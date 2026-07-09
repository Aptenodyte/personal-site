import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <div
        className="border p-10 md:p-16"
        style={{ borderColor: "var(--border-hi)", background: "var(--surface)", maxWidth: "36rem", width: "100%" }}
      >
        <p
          className="text-[0.62rem] font-bold uppercase tracking-[0.25em]"
          style={{ color: "var(--fg-muted)" }}
        >
          // error_handler.sh
        </p>
        <p
          className="mt-3 text-[6rem] font-bold leading-none"
          style={{ color: "var(--border-hi)" }}
        >
          404
        </p>
        <h1
          className="mt-2 text-[1.1rem] font-bold uppercase tracking-wider"
          style={{ color: "var(--fg)" }}
        >
          PAGE NOT FOUND
        </h1>
        <p
          className="mt-3 text-[0.85rem] leading-relaxed"
          style={{ color: "var(--fg-dim)" }}
        >
          The path you requested does not exist in this filesystem.
          <br />
          Try navigating back to root.
        </p>
        <Link href="/" className="btn btn-fill mt-8 inline-flex">
          CD ~/HOME
        </Link>
      </div>
    </div>
  );
}
