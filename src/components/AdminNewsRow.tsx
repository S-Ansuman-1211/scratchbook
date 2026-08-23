"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { id: string; title: string; published: boolean; createdAt: string };

export default function AdminNewsRow({ item }: { item: Row }) {
  const router = useRouter();
  const [published, setPublished] = useState(item.published);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !published;
    const res = await fetch("/api/admin/news", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, published: next }),
    });
    if (res.ok) { setPublished(next); router.refresh(); }
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res = await fetch(`/api/admin/news?id=${item.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3 font-medium">{item.title}</td>
      <td className="px-4 py-3 text-ink/60">{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${published ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
          {published ? "Published" : "Hidden"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={toggle} disabled={busy} className="text-xs font-semibold text-brand hover:underline">{published ? "Hide" : "Publish"}</button>
          <button onClick={remove} className="text-xs font-semibold text-ink/40 hover:text-red-600">Delete</button>
        </div>
      </td>
    </tr>
  );
}
