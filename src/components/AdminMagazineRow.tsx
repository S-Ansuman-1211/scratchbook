"use client";

import { useRouter } from "next/navigation";

type Row = { id: string; title: string; type: string; edition: string | null };

export default function AdminMagazineRow({ magazine }: { magazine: Row }) {
  const router = useRouter();

  async function remove() {
    if (!confirm(`Delete "${magazine.title}"?`)) return;
    const res = await fetch(`/api/admin/magazines?id=${magazine.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3 font-medium">{magazine.title}</td>
      <td className="px-4 py-3"><span className="badge">{magazine.type.replace("_", " / ")}</span></td>
      <td className="px-4 py-3 text-ink/60">{magazine.edition ?? "—"}</td>
      <td className="px-4 py-3">
        <button onClick={remove} className="text-xs font-semibold text-ink/40 hover:text-red-600">Delete</button>
      </td>
    </tr>
  );
}
