"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

// Create-a-book form for the admin panel. Prices/MRP in ₹.
export default function AdminBookForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", authorName: "", type: "SOLO", status: "PUBLISHED",
    language: "", genre: "", isbn: "", pages: "", sizeLabel: "", editionLabel: "", stock: "",
    description: "", mrp: "", paperbackPrice: "", hardcasePrice: "", ebookPrice: "", discountPercent: "",
    amazonUrl: "", kindleUrl: "", otherStoreUrl: "",
  });
  const [coverUrl, setCoverUrl] = useState("");
  const [backCoverUrl, setBackCoverUrl] = useState("");
  const [extraImageUrl, setExtraImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  const num = (s: string) => (s.trim() === "" ? null : Number(s));
  const int = (s: string) => (s.trim() === "" ? null : Math.round(Number(s)));

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
        isbn: form.isbn,
        pages: int(form.pages),
        sizeLabel: form.sizeLabel,
        editionLabel: form.editionLabel,
        stock: int(form.stock),
        description: form.description,
        mrp: num(form.mrp),
        paperbackPrice: num(form.paperbackPrice),
        hardcasePrice: num(form.hardcasePrice),
        ebookPrice: num(form.ebookPrice),
        discountPercent: Math.max(0, Math.min(100, Math.round(Number(form.discountPercent) || 0))),
        amazonUrl: form.amazonUrl,
        kindleUrl: form.kindleUrl,
        otherStoreUrl: form.otherStoreUrl,
        coverUrl, backCoverUrl, extraImageUrl,
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

  const F = (label: string, k: keyof typeof form, placeholder = "") => (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-6">
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Title *</label>
            <input className="input" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className="label">Author name(s)</label>
            <input className="input" value={form.authorName} onChange={(e) => set("authorName", e.target.value)} placeholder="Separate multiple authors with commas" />
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
        </div>
        <div>
          <label className="label">About the book</label>
          <textarea className="input" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-sm font-bold uppercase tracking-wide text-ink/60">Details</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {F("ISBN", "isbn")}
          {F("Language", "language", "e.g. Telugu")}
          {F("Genre", "genre", "e.g. Fiction")}
          {F("Pages", "pages")}
          {F("Size", "sizeLabel", "e.g. 5x8 in")}
          {F("Edition", "editionLabel", "e.g. 1st Ed. 2026")}
          {F("Stock (qty)", "stock")}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-sm font-bold uppercase tracking-wide text-ink/60">Pricing (₹)</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          {F("MRP", "mrp")}
          {F("Paperback", "paperbackPrice")}
          {F("Hardcase", "hardcasePrice")}
          {F("eBook", "ebookPrice")}
        </div>
        <div className="mt-4 max-w-[10rem]">
          {F("Discount (%)", "discountPercent", "0")}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-sm font-bold uppercase tracking-wide text-ink/60">Marketplace links</h3>
        <div className="space-y-4">
          {F("Amazon (paperback) URL", "amazonUrl", "https://amazon.in/…")}
          {F("Amazon Kindle (ebook) URL", "kindleUrl", "https://amazon.in/dp/… (leave blank for regional books)")}
          {F("Other store URL", "otherStoreUrl")}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-serif text-sm font-bold uppercase tracking-wide text-ink/60">Images</h3>
        <div className="space-y-4">
          <ImageUpload label="Front cover (main)" folder="covers" value={coverUrl} onUploaded={setCoverUrl} />
          <ImageUpload label="Back cover" folder="covers" value={backCoverUrl} onUploaded={setBackCoverUrl} />
          <ImageUpload label="Additional image (optional)" folder="covers" value={extraImageUrl} onUploaded={setExtraImageUrl} />
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Creating…" : "Create book"}</button>
        <button type="button" onClick={() => router.push("/admin/books")} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
