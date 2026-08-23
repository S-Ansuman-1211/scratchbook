"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { id: string; name: string; status: string; published: boolean };

export default function AdminCollaborationRow({ item }: { item: Row }) {
  const router = useRouter();
  const [status, setStatus] = useState(item.status);
  const [published, setPublished] = useState(item.published);
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch("/api/admin/collaborations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, ...body }),
    });
    if (res.ok) router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Delete "${item.name}"?`)) return;
    const res = await fetch(`/api/admin/collaborations?id=${item.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3 font-medium">{item.name}</td>
      <td className="px-4 py-3">
        <select
          value={status}
          disabled={busy}
          onChange={(e) => { setStatus(e.target.value); patch({ status: e.target.value }); }}
          className="rounded-lg border border-line px-2 py-1.5 text-sm outline-none focus:border-brand"
        >
          <option value="ACTIVE">Active</option>
          <option value="COMING_SOON">Coming soon</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${published ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
          {published ? "Published" : "Hidden"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => { setPublished(!published); patch({ published: !published }); }} disabled={busy} className="text-xs font-semibold text-brand hover:underline">
            {published ? "Hide" : "Publish"}
          </button>
          <button onClick={remove} className="text-xs font-semibold text-ink/40 hover:text-red-600">Delete</button>
        </div>
      </td>
    </tr>
  );
}
