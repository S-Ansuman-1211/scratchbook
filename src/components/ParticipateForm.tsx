"use client";

import { useState } from "react";

type EventInfo = { id?: string; title: string; type: string };

/**
 * A "Participate" button that opens a modal registration form and posts the
 * entry to /api/events/participate. Used on the Events page.
 */
export default function ParticipateForm({ event }: { event: EventInfo }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      eventId: event.id,
      eventTitle: event.title,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      category: String(form.get("category") ?? ""),
      message: String(form.get("message") ?? ""),
      entryUrl: String(form.get("entryUrl") ?? ""),
    };

    const res = await fetch("/api/events/participate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("done");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline mt-4 w-full py-1.5 text-sm">
        Participate
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "done" ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">
                  ✓
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-ink">You&apos;re in!</h3>
                <p className="mt-2 text-sm text-ink/65">
                  Thanks for entering <strong>{event.title}</strong>. We&apos;ll email you the
                  next steps and submission details.
                </p>
                <button onClick={() => setOpen(false)} className="btn-primary mt-6 px-6 py-2.5">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="eyebrow">{event.type}</span>
                    <h3 className="mt-1 font-serif text-xl font-bold text-ink">{event.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">Register to participate.</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="text-ink/40 hover:text-ink"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="name">Full name *</label>
                      <input id="name" name="name" required className="input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="label" htmlFor="phone">Phone</label>
                      <input id="phone" name="phone" className="input" placeholder="Optional" />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" required className="input" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="label" htmlFor="category">Category</label>
                    <input id="category" name="category" className="input" placeholder="e.g. Poetry, Photography" />
                  </div>
                  <div>
                    <label className="label" htmlFor="entryUrl">Link to your entry</label>
                    <input id="entryUrl" name="entryUrl" className="input" placeholder="Google Drive / portfolio link (optional)" />
                  </div>
                  <div>
                    <label className="label" htmlFor="message">A note (optional)</label>
                    <textarea id="message" name="message" rows={3} className="input" placeholder="Tell us about your submission" />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button type="submit" disabled={status === "saving"} className="btn-primary w-full py-2.5 disabled:opacity-60">
                    {status === "saving" ? "Submitting…" : "Submit entry"}
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
