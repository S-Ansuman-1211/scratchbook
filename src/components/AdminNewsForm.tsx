"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function AdminNewsForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", summary: "", linkUrl: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl, published }),
    });
    if (res.ok) {
      router.push("/admin/news");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not create the news item.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div>
        <label className="label">Title *</label>
        <input className="input" required value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div>
        <label className="label">Summary</label>
        <textarea className="input" rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
      </div>
      <div>
        <label className="label">Link (optional)</label>
        <input className="input" value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://… or /events" />
      </div>
      <ImageUpload label="News image" folder="news" value={imageUrl} onUploaded={setImageUrl} />
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Publish immediately
      </label>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating…" : "Create news"}</button>
        <button type="button" onClick={() => router.push("/admin/news")} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
