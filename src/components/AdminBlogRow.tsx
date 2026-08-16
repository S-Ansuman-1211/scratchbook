"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { id: string; title: string; published: boolean; linkUrl: string | null; createdAt: string };

export default function AdminBlogRow({ post }: { post: Row }) {
  const router = useRouter();
  const [published, setPublished] = useState(post.published);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !published;
    const res = await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: next }),
    });
    if (res.ok) {
      setPublished(next);
      router.refresh();
    }
    setBusy(false);
  }

  async function remove() {
    if (!confirm(`Delete "${post.title}"?`)) return;
    const res = await fetch(`/api/admin/blog?id=${post.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3 font-medium">
        {post.title}
        {post.linkUrl && <span className="ml-2 text-xs text-ink/40">🔗 link</span>}
      </td>
      <td className="px-4 py-3 text-ink/60">{new Date(post.createdAt).toLocaleDateString("en-IN")}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${published ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
          {published ? "Published" : "Draft"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={toggle} disabled={busy} className="text-xs font-semibold text-brand hover:underline">
            {published ? "Unpublish" : "Publish"}
          </button>
          <button onClick={remove} className="text-xs font-semibold text-ink/40 hover:text-red-600">Delete</button>
        </div>
      </td>
    </tr>
  );
}
