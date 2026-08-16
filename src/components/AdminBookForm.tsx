"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

// Create-a-book form for the admin panel. Prices are entered in ₹.
export default function AdminBookForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    authorName: "",
    type: "SOLO",
    status: "PUBLISHED",
    language: "",
    genre: "",
    description: "",
    paperbackPrice: "",
    ebookPrice: "",
    hardcasePrice: "",
  });
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  const num = (s: string) => (s.trim() === "" ? null : Number(s));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        authorName: form.authorName,
        type: form.type,
        status: form.status,
        language: form.language,
        genre: form.genre,
        description: form.description,
        coverUrl,
        paperbackPrice: num(form.paperbackPrice),
        ebookPrice: num(form.ebookPrice),
        hardcasePrice: num(form.hardcasePrice),
      }),
    });

    if (res.ok) {
      router.push("/admin/books");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not create the book.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Title *</label>
          <input className="input" required value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className="label">Author name</label>
          <input className="input" value={form.authorName} onChange={(e) => set("authorName", e.target.value)} />
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="SOLO">Solo</option>
            <option value="ANTHOLOGY">Anthology</option>
            <option value="BIOGRAPHY">Biography</option>
            <option value="AUTOBIOGRAPHY">Autobiography</option>
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="PUBLISHED">Published (buy now)</option>
            <option value="UPCOMING">Upcoming (pre-order)</option>
            <option value="DRAFT">Draft (hidden)</option>
          </select>
        </div>
        <div>
          <label className="label">Language</label>
          <input className="input" value={form.language} onChange={(e) => set("language", e.target.value)} placeholder="e.g. Telugu" />
        </div>
        <div>
          <label className="label">Genre</label>
          <input className="input" value={form.genre} onChange={(e) => set("genre", e.target.value)} placeholder="e.g. Fiction" />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Paperback ₹</label>
          <input className="input" value={form.paperbackPrice} onChange={(e) => set("paperbackPrice", e.target.value)} placeholder="e.g. 299" />
        </div>
        <div>
          <label className="label">Hardcase ₹</label>
          <input className="input" value={form.hardcasePrice} onChange={(e) => set("hardcasePrice", e.target.value)} />
        </div>
        <div>
          <label className="label">eBook ₹</label>
          <input className="input" value={form.ebookPrice} onChange={(e) => set("ebookPrice", e.target.value)} />
        </div>
      </div>

      <ImageUpload label="Cover image" folder="covers" value={coverUrl} onUploaded={setCoverUrl} />

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Creating…" : "Create book"}
        </button>
        <button type="button" onClick={() => router.push("/admin/books")} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
