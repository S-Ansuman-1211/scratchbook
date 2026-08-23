"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function RequestDiscountPage() {
  const { status } = useSession();
  const [form, setForm] = useState({ message: "", bookTitle: "" });
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setError(null);
    const res = await fetch("/api/discount/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setState("done");
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not submit your request.");
      setState("idle");
    }
  }

  return (
    <div className="container-x max-w-xl py-14">
      <span className="eyebrow">Discounts</span>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">Request a discount</h1>
      <p className="mt-3 text-ink/60">Tell us what you&apos;d like a discount on. Our team will review and, if approved, apply it to your account automatically.</p>

      {status === "unauthenticated" ? (
        <p className="mt-8 card text-center text-sm">
          Please <Link href="/login?callbackUrl=/request-discount" className="font-semibold text-brand">sign in</Link> to request a discount.
        </p>
      ) : state === "done" ? (
        <div className="mt-8 card text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">✓</div>
          <h2 className="mt-4 font-serif text-xl font-bold text-ink">Request submitted</h2>
          <p className="mt-2 text-sm text-ink/65">If approved, your discount applies automatically at checkout. We&apos;ll email you.</p>
          <Link href="/books" className="btn-primary mt-6 px-6 py-2.5">Browse books</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="label">Book / order (optional)</label>
            <input className="input" value={form.bookTitle} onChange={(e) => setForm((f) => ({ ...f, bookTitle: e.target.value }))} placeholder="e.g. a specific book title" />
          </div>
          <div>
            <label className="label">Your request *</label>
            <textarea className="input" rows={4} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tell us why you'd like a discount…" />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={state === "saving"} className="btn-primary">
            {state === "saving" ? "Submitting…" : "Submit request"}
          </button>
        </form>
      )}
    </div>
  );
}
