"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthorApplyForm({
  requireAadhaar,
  requireManuscript,
}: {
  requireAadhaar: boolean;
  requireManuscript: boolean;
}) {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ name: "", phone: "", email: "", aadhaar: "", bio: "", genre: "" });
  const [manuscriptUrl, setManuscriptUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function uploadManuscript(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload/document", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok && data.url) setManuscriptUrl(data.url);
    else setError(data.error ?? "Upload failed.");
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setError(null);
    const res = await fetch("/api/author/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, manuscriptUrl }),
    });
    if (res.ok) setState("done");
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not submit your application.");
      setState("idle");
    }
  }

  if (status === "unauthenticated") {
    return (
      <p className="mt-8 card text-center text-sm">
        Please <Link href="/login?callbackUrl=/become-author" className="font-semibold text-brand">sign in</Link> (or{" "}
        <Link href="/signup" className="font-semibold text-brand">create a free account</Link>) to apply.
      </p>
    );
  }

  if (state === "done") {
    return (
      <div className="mt-8 card text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">✓</div>
        <h2 className="mt-4 font-serif text-xl font-bold text-ink">Application submitted!</h2>
        <p className="mt-2 text-sm text-ink/65">
          Thanks! Our team will review your application{requireManuscript ? " and manuscript" : ""} and get back to you.
          Once approved, your Author Dashboard unlocks.
        </p>
        <Link href="/" className="btn-primary mt-6 px-6 py-2.5">Back to home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Full name *</label>
          <input className="input" required value={form.name || session?.user?.name || ""} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="label">Phone *</label>
          <input className="input" required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className="label">Email *</label>
          <input type="email" className="input" required value={form.email || session?.user?.email || ""} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className="label">Writing genre / category</label>
          <input className="input" value={form.genre} onChange={(e) => set("genre", e.target.value)} placeholder="e.g. Fiction, Poetry" />
        </div>
      </div>

      <div>
        <label className="label">Aadhaar / ID number {requireAadhaar ? "*" : "(optional)"}</label>
        <input className="input" required={requireAadhaar} value={form.aadhaar} onChange={(e) => set("aadhaar", e.target.value)} />
        <p className="mt-1 text-xs text-ink/45">Kept confidential and used only for verification.</p>
      </div>

      <div>
        <label className="label">About you *</label>
        <textarea className="input" rows={4} required value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Your writing background, published work, why you want to publish with us…" />
      </div>

      <div>
        <label className="label">Manuscript {requireManuscript ? "*" : "(optional)"}</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={uploadManuscript} disabled={uploading}
          className="block text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark" />
        {uploading && <p className="mt-1 text-xs text-brand">Uploading…</p>}
        {manuscriptUrl && !uploading && <p className="mt-1 text-xs text-emerald-600">✓ Manuscript uploaded</p>}
        <p className="mt-1 text-xs text-ink/45">PDF or Word document, up to 20 MB.</p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={state === "saving" || uploading} className="btn-primary">
        {state === "saving" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
