"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { id: string; title: string; type: string; isOpen: boolean };

export default function AdminEventRow({ event }: { event: Row }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(event.isOpen);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !isOpen;
    const res = await fetch("/api/admin/events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: event.id, isOpen: next }),
    });
    if (res.ok) {
      setIsOpen(next);
      router.refresh();
    }
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Delete "${event.title}"?`)) return;
    const res = await fetch(`/api/admin/events?id=${event.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3 font-medium">{event.title}</td>
      <td className="px-4 py-3"><span className="badge">{event.type}</span></td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
          {isOpen ? "Open" : "Closed"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={toggle} disabled={busy} className="text-xs font-semibold text-brand hover:underline">
            {isOpen ? "Close" : "Open"}
          </button>
          <button onClick={remove} className="text-xs font-semibold text-ink/40 hover:text-red-600">Delete</button>
        </div>
      </td>
    </tr>
  );
}
