"use client";

import { useState } from "react";

/**
 * Admin image uploader. Uploads the chosen file to /api/admin/upload (Vercel
 * Blob) and calls onUploaded with the resulting public URL. Shows a preview.
 */
export default function ImageUpload({
  value,
  onUploaded,
  folder = "uploads",
  label = "Image",
}: {
  value?: string | null;
  onUploaded: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok && data.url) {
      onUploaded(data.url);
    } else {
      setError(data.error ?? "Upload failed.");
    }
    setUploading(false);
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="preview" className="h-20 w-16 rounded-lg border border-line object-cover" />
        ) : (
          <div className="grid h-20 w-16 place-items-center rounded-lg border border-dashed border-line text-xs text-ink/40">
            none
          </div>
        )}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="block text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark"
          />
          {uploading && <p className="mt-1 text-xs text-brand">Uploading…</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          {value && !uploading && <p className="mt-1 text-xs text-emerald-600">✓ Uploaded</p>}
        </div>
      </div>
    </div>
  );
}
