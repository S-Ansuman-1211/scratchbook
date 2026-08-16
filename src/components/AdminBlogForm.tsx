"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

// Create a blog post. You can write a full article (body) and/or add an
// external article link (linkUrl).
export default function AdminBlogForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", excerpt: "", body: "", linkUrl: "" });
  const [coverUrl, setCoverUrl] = useState("");
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

    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, coverUrl, published }),
    });

    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not create the post.");
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
        <label className="label">Short summary (excerpt)</label>
        <input className="input" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="One line shown on the blog list" />
      </div>
      <div>
        <label className="label">Article body</label>
        <textarea className="input" rows={8} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Write the article here. Leave blank if you're only linking to an external article." />
      </div>
      <div>
        <label className="label">External article link (optional)</label>
        <input className="input" value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://… (e.g. a news feature about the book)" />
      </div>

      <ImageUpload label="Cover image" folder="blog" value={coverUrl} onUploaded={setCoverUrl} />

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Publish immediately (uncheck to save as hidden draft)
      </label>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Creating…" : "Create post"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
