"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

// "Propose a collaboration" button + modal for organising an event together.
// Posts to the contact endpoint so it lands in Admin -> Messages (with the
// requester's email), and the admin can reply / contact them by mail.
export default function EventCollaboration() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const form = new FormData(e.currentTarget);
    const org = String(form.get("org") ?? "").trim();
    const eventType = String(form.get("eventType") ?? "").trim();
    const details = String(form.get("message") ?? "").trim();
    const message =
      `[Event collaboration request]` +
      (org ? ` Organisation: ${org}.` : "") +
      (eventType ? ` Event type: ${eventType}.` : "") +
      (details ? ` ${details}` : "");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        message,
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
      <button onClick={() => setOpen(true)} className="btn-primary px-6 py-2.5">
        Request a collaboration
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
            {status === "done" ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">✓</div>
                <h3 className="mt-4 font-serif text-xl font-bold text-ink">Request sent!</h3>
                <p className="mt-2 text-sm text-ink/65">
                  Thank you - our team will review your proposal and reach out to you by email to discuss the collaboration.
                </p>
                <button onClick={() => setOpen(false)} className="btn-primary mt-6 px-6 py-2.5">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="eyebrow">Collaborate with us</span>
                    <h3 className="mt-1 font-serif text-xl font-bold text-ink">Organise an event together</h3>
                    <p className="mt-1 text-sm text-ink/60">
                      Tell us about the event you&apos;d like to co-organise. We&apos;ll get back to you by email.
                    </p>
                  </div>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink/40 hover:text-ink">✕</button>
                </div>

                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label">Full name *</label><input name="name" required defaultValue={session?.user?.name ?? ""} className="input" /></div>
                    <div><label className="label">Phone</label><input name="phone" className="input" /></div>
                  </div>
                  <div><label className="label">Email *</label><input name="email" type="email" required defaultValue={session?.user?.email ?? ""} className="input" /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label">Organisation / College</label><input name="org" className="input" placeholder="Optional" /></div>
                    <div><label className="label">Type of event</label><input name="eventType" className="input" placeholder="e.g. book launch, contest, workshop" /></div>
                  </div>
                  <div><label className="label">Tell us about your idea *</label><textarea name="message" rows={4} required className="input" placeholder="What kind of event do you have in mind, expected scale, timeline, and how you'd like us to collaborate…" /></div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={status === "saving"} className="btn-primary w-full py-2.5">
                    {status === "saving" ? "Sending…" : "Send request"}
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
