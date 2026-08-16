"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function AdminEventForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", type: "COMPETITION", description: "" });
  const [bannerUrl, setBannerUrl] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, bannerUrl, isOpen }),
    });
    if (res.ok) {
      router.push("/admin/events");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not create the event.");
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
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="COMPETITION">Competition</option>
            <option value="EVENT">Event</option>
            <option value="COLLABORATION">Collaboration</option>
            <option value="AWARD">Award</option>
            <option value="RECORD">Record</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description / rules</label>
        <textarea className="input" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <ImageUpload label="Banner image" folder="events" value={bannerUrl} onUploaded={setBannerUrl} />

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
        Open for submissions
      </label>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating…" : "Create event"}</button>
        <button type="button" onClick={() => router.push("/admin/events")} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
