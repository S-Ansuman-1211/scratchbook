"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function AdminMagazineForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", type: "PERSONAL", edition: "", description: "",
    pages: "4", gsm: "190", pricePerPageRupees: "8", pdfUrl: "",
  });
  const [coverUrl, setCoverUrl] = useState("");
  const [readOnline, setReadOnline] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/magazines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        type: form.type,
        edition: form.edition,
        description: form.description,
        pages: Number(form.pages) || 4,
        gsm: Number(form.gsm) || 190,
        pricePerPage: Math.round((Number(form.pricePerPageRupees) || 0) * 100),
        coverUrl,
        pdfUrl: form.pdfUrl,
        readOnline,
      }),
    });
    if (res.ok) {
      router.push("/admin/magazines");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not create the magazine.");
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
          <label className="label">Edition</label>
          <input className="input" value={form.edition} onChange={(e) => set("edition", e.target.value)} placeholder="e.g. June 2026" />
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="PERSONAL">Personal</option>
            <option value="MOVIE">Movie</option>
            <option value="GROUP_DIVA">Group / Diva</option>
          </select>
        </div>
        <div>
          <label className="label">Pages (multiples of 4)</label>
          <input className="input" value={form.pages} onChange={(e) => set("pages", e.target.value)} />
        </div>
        <div>
          <label className="label">GSM</label>
          <input className="input" value={form.gsm} onChange={(e) => set("gsm", e.target.value)} />
        </div>
        <div>
          <label className="label">Price per page (₹)</label>
          <input className="input" value={form.pricePerPageRupees} onChange={(e) => set("pricePerPageRupees", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div>
        <label className="label">PDF link (optional)</label>
        <input className="input" value={form.pdfUrl} onChange={(e) => set("pdfUrl", e.target.value)} placeholder="https://… (link to the readable/downloadable PDF)" />
      </div>

      <ImageUpload label="Cover image" folder="magazines" value={coverUrl} onUploaded={setCoverUrl} />

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={readOnline} onChange={(e) => setReadOnline(e.target.checked)} />
        Allow reading online
      </label>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating…" : "Create magazine"}</button>
        <button type="button" onClick={() => router.push("/admin/magazines")} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
