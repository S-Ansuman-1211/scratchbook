"use client";

import { useState } from "react";

type BookRow = {
  id: string;
  title: string;
  status: string;
  paperbackPrice: number | null;
  hardcasePrice: number | null;
  ebookPrice: number | null;
  coverUrl: string | null;
};

// Prices are shown/edited in rupees; the API converts to paise.
const paiseToRupees = (p: number | null) => (p == null ? "" : String(p / 100));

export default function AdminBookRow({ book }: { book: BookRow }) {
  const [status, setStatus] = useState(book.status);
  const [paperback, setPaperback] = useState(paiseToRupees(book.paperbackPrice));
  const [hardcase, setHardcase] = useState(paiseToRupees(book.hardcasePrice));
  const [ebook, setEbook] = useState(paiseToRupees(book.ebookPrice));
  const [coverUrl, setCoverUrl] = useState(book.coverUrl ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const num = (s: string) => (s.trim() === "" ? null : Number(s));

  async function save() {
    setState("saving");
    const res = await fetch("/api/admin/books", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: book.id,
        status,
        paperbackPrice: num(paperback),
        hardcasePrice: num(hardcase),
        ebookPrice: num(ebook),
        coverUrl: coverUrl.trim(),
      }),
    });
    if (res.ok) {
      setState("saved");
      setTimeout(() => setState("idle"), 1500);
    } else {
      setState("error");
    }
  }

  const priceInput = "w-24 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-brand";

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3 font-medium">{book.title}</td>
      <td className="px-4 py-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-brand">
          <option value="PUBLISHED">Published</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="DRAFT">Draft</option>
        </select>
      </td>
      <td className="px-4 py-3"><input value={paperback} onChange={(e) => setPaperback(e.target.value)} placeholder="—" className={priceInput} /></td>
      <td className="px-4 py-3"><input value={hardcase} onChange={(e) => setHardcase(e.target.value)} placeholder="—" className={priceInput} /></td>
      <td className="px-4 py-3"><input value={ebook} onChange={(e) => setEbook(e.target.value)} placeholder="—" className={priceInput} /></td>
      <td className="px-4 py-3"><input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://…" className="w-40 rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-brand" /></td>
      <td className="px-4 py-3">
        <button onClick={save} disabled={state === "saving"} className="btn-primary px-4 py-1.5 text-xs">
          {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : state === "error" ? "Retry" : "Save"}
        </button>
      </td>
    </tr>
  );
}
