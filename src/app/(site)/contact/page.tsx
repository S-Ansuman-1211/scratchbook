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
        <span className="eyebrow">Get in touch</span>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Contact Us</h1>
        <p className="mt-4 text-ink/70">
          Have a manuscript, an idea, or a question about our services? Connect with us and our
          team will guide you through the garden of opportunities.
        </p>
        <ul className="mt-8 space-y-4 text-sm text-ink/75">
          <li className="flex gap-3">
            <span>✉️</span>
            <a href="mailto:scratchbookpublications@gmail.com" className="font-medium text-brand hover:underline">scratchbookpublications@gmail.com</a>
          </li>
          <li className="flex gap-3">
            <span>📱</span>
            <a href="tel:+918847816635" className="font-medium text-ink hover:text-brand">+91 88478 16635</a>
            <span className="text-ink/40">(Call / WhatsApp)</span>
          </li>
          <li className="flex gap-3">
            <span>📸</span>
            <a href="https://www.instagram.com/scratchbook.publication__/" target="_blank" rel="noreferrer" className="font-medium text-brand hover:underline">@scratchbook.publication__</a>
          </li>
          <li className="flex gap-3">
            <span>📍</span>
            <span className="text-ink/70">
              Flat No. 301, 3rd Floor, S Cube Apartments, 9th Phase, KPHB – Gokul Flats,
              Hyderabad, Telangana 500085
            </span>
          </li>
        </ul>
        <p className="mt-6 text-xs text-ink/45">An independent unit under Inkzoid Publication.</p>
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
