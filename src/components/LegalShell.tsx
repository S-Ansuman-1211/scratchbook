import Link from "next/link";

// Shared wrapper for legal/policy pages — consistent heading, meta and prose styling.
export default function LegalShell({
  title,
  updated = "August 2026",
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x max-w-3xl py-14">
      <nav className="text-sm text-ink/50">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{title}</span>
      </nav>

      <h1 className="mt-6 font-serif text-4xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {updated}</p>

      <div className="legal mt-8 space-y-6 text-[15px] leading-relaxed text-ink/75">
        {children}
      </div>

      <div className="mt-12 rounded-xl border border-line bg-cream p-5 text-sm text-ink/70">
        Questions about this policy? Contact us at{" "}
        <a href="mailto:scratchbookpublications@gmail.com" className="font-semibold text-brand hover:underline">
          scratchbookpublications@gmail.com
        </a>{" "}
        or <a href="tel:+918847816635" className="font-semibold text-brand hover:underline">+91 88478 16635</a>.
      </div>
    </div>
  );
}

// Reusable section heading inside a legal page.
export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl font-bold text-ink">{heading}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
