"use client";

import { useState } from "react";

type Kind = "submission" | "collab";

const LABELS: Record<Kind, { button: string; title: string; intro: string; tag: string }> = {
  submission: {
    button: "Submit content for the ongoing edition",
    title: "Submit content",
    intro: "Send your writing, photos or art for the ongoing magazine edition. Our team will get back to you.",
    tag: "Magazine content submission",
  },
  collab: {
    button: "Request for Collab",
    title: "Request a collaboration",
    intro: "Tell us about your collaboration idea for the magazine and we'll be in touch.",
    tag: "Magazine collab request",
  },
};

// Opens a modal that posts to the contact endpoint (lands in Admin → Messages
// and emails the business inbox).
export default function MagazineRequestForm({ kind }: { kind: Kind }) {
  const cfg = LABELS[kind];
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        message: `[${cfg.tag}] ${String(form.get("message") ?? "")}`,
      }),
    });
    if (res.ok) setStatus("done");
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline">{cfg.button}</button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
            {status === "done" ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">✓</div>
                <h3 className="mt-4 font-serif text-xl font-bold text-ink">Thank you!</h3>
                <p className="mt-2 text-sm text-ink/65">We&apos;ve received your {kind === "collab" ? "collaboration request" : "submission"} and will get back to you soon.</p>
                <button onClick={() => setOpen(false)} className="btn-primary mt-6 px-6 py-2.5">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-ink">{cfg.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{cfg.intro}</p>
                  </div>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink/40 hover:text-ink">✕</button>
                </div>

                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label">Full name *</label><input name="name" required className="input" /></div>
                    <div><label className="label">Phone</label><input name="phone" className="input" /></div>
                  </div>
                  <div><label className="label">Email *</label><input name="email" type="email" required className="input" /></div>
                  <div><label className="label">Details *</label><textarea name="message" rows={4} required className="input" placeholder={kind === "collab" ? "Describe your collaboration idea…" : "Describe your submission…"} /></div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={status === "saving"} className="btn-primary w-full py-2.5">
                    {status === "saving" ? "Sending…" : "Send"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
