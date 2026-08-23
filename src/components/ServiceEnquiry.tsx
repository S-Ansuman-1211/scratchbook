"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

// "Enquire pricing" button + modal for a service. Posts the enquiry to the
// contact endpoint so it lands in Admin -> Messages (with the user's email),
// and the admin can reply / send pricing by mail.
export default function ServiceEnquiry({ serviceName }: { serviceName: string }) {
  const { data: session } = useSession();
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
        message: `[Pricing enquiry: ${serviceName}] ${String(form.get("message") ?? "")}`,
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
      <button onClick={() => setOpen(true)} className="btn-outline mt-3 w-full py-1.5 text-sm">
        Enquire pricing
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-soft" onClick={(e) => e.stopPropagation()}>
            {status === "done" ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">✓</div>
                <h3 className="mt-4 font-serif text-xl font-bold text-ink">Enquiry sent!</h3>
                <p className="mt-2 text-sm text-ink/65">Our team will email you the pricing and details for <strong>{serviceName}</strong> shortly.</p>
                <button onClick={() => setOpen(false)} className="btn-primary mt-6 px-6 py-2.5">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="eyebrow">Pricing enquiry</span>
                    <h3 className="mt-1 font-serif text-xl font-bold text-ink">{serviceName}</h3>
                    <p className="mt-1 text-sm text-ink/60">Share your details and we&apos;ll email you the pricing.</p>
                  </div>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink/40 hover:text-ink">✕</button>
                </div>

                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label">Full name *</label><input name="name" required defaultValue={session?.user?.name ?? ""} className="input" /></div>
                    <div><label className="label">Phone</label><input name="phone" className="input" /></div>
                  </div>
                  <div><label className="label">Email *</label><input name="email" type="email" required defaultValue={session?.user?.email ?? ""} className="input" /></div>
                  <div><label className="label">Message</label><textarea name="message" rows={3} className="input" placeholder="Any specific requirements for this service…" /></div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={status === "saving"} className="btn-primary w-full py-2.5">
                    {status === "saving" ? "Sending…" : "Send enquiry"}
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
