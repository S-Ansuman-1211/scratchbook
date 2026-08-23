"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function AdminCollaborationForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", tagline: "", description: "", linkUrl: "", status: "ACTIVE" });
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
    const res = await fetch("/api/admin/collaborations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl, published }),
    });
    if (res.ok) {
      router.push("/admin/collaborations");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not create the collaboration.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Name *</label>
          <input className="input" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. D'Artiste Artifex (DAA)" />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="COMING_SOON">Coming soon</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Tagline</label>
        <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Short one-line tagline" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div>
        <label className="label">Link (optional)</label>
        <input className="input" value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="/daa-magazine or https://…" />
      </div>
      <ImageUpload label="Cover image" folder="collaborations" value={imageUrl} onUploaded={setImageUrl} />
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published (visible on the site)
      </label>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating…" : "Create collaboration"}</button>
        <button type="button" onClick={() => router.push("/admin/collaborations")} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
