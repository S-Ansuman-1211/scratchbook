"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

export default function SubmitBlogPage() {
  const { status } = useSession();
  const [form, setForm] = useState({ title: "", excerpt: "", body: "", linkUrl: "" });
  const [coverUrl, setCoverUrl] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setError(null);
    const res = await fetch("/api/blog/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, coverUrl }),
    });
    if (res.ok) setState("done");
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not submit.");
      setState("idle");
    }
  }

  return (
    <div className="container-x max-w-2xl py-14">
      <Link href="/blog" className="text-sm text-ink/50 hover:text-brand">← Back to blog</Link>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-ink">Write a blog</h1>
      <p className="mt-2 text-ink/60">Share your thoughts with the ScratchBook community. Submissions are reviewed before they appear publicly.</p>

      {status === "unauthenticated" ? (
        <p className="mt-8 card text-center text-sm">
          Please <Link href="/login?callbackUrl=/blog/submit" className="font-semibold text-brand">sign in</Link> to submit a blog.
        </p>
      ) : state === "done" ? (
        <div className="mt-8 card text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">✓</div>
          <h2 className="mt-4 font-serif text-xl font-bold text-ink">Submitted for review!</h2>
          <p className="mt-2 text-sm text-ink/65">Thanks! Our team will review your blog and publish it if approved.</p>
          <Link href="/blog" className="btn-primary mt-6 px-6 py-2.5">Back to blog</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="label">Title *</label>
            <input className="input" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className="label">Short summary</label>
            <input className="input" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </div>
          <div>
            <label className="label">Your article *</label>
            <textarea className="input" rows={10} required value={form.body} onChange={(e) => set("body", e.target.value)} />
          </div>
          <div>
            <label className="label">External link (optional)</label>
            <input className="input" value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://…" />
          </div>
          <ImageUpload label="Cover image (optional)" folder="user-blog" endpoint="/api/upload" value={coverUrl} onUploaded={setCoverUrl} />
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={state === "saving"} className="btn-primary">
            {state === "saving" ? "Submitting…" : "Submit for review"}
          </button>
        </form>
      )}
    </div>
  );
}
