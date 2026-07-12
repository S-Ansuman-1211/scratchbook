"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
      }),
    });
    setLoading(false);
    if (res.ok) setSent(true);
    else setError("Could not send your message. Please try again.");
  }

  return (
    <div className="container-x grid max-w-5xl gap-12 py-16 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-gold">Get in touch</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-ink/70">
          Have a manuscript, an idea, or a question about our services? Connect with us and our
          team will guide you through the garden of opportunities.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-ink/70">
          <li><strong className="text-ink">Publication:</strong> ScratchBook Publications</li>
          <li><strong className="text-ink">Parent unit:</strong> Inkzoid Publication</li>
          <li className="text-ink/50">Email &amp; phone to be provided by client.</li>
        </ul>
      </div>

      <div className="card">
        {sent ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="font-serif text-2xl font-bold text-brand">Thank you!</h2>
            <p className="mt-2 text-sm text-ink/70">We&apos;ve received your message and will get back soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <div>
              <label className="label">Name</label>
              <input name="name" className="input" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" className="input" required />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input name="phone" className="input" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea name="message" rows={4} className="input" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
