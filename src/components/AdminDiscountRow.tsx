"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Req = { id: string; message: string; bookTitle: string | null; userName: string; userEmail: string; createdAt: string };

export function DiscountRequestRow({ req }: { req: Req }) {
  const router = useRouter();
  const [percent, setPercent] = useState("10");
  const [busy, setBusy] = useState(false);

  async function act(action: "grant" | "reject") {
    setBusy(true);
    const body = action === "grant" ? { requestId: req.id, action, percent: Number(percent) || 0 } : { requestId: req.id, action };
    const res = await fetch("/api/admin/discounts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) router.refresh();
    else setBusy(false);
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{req.userName} <span className="font-normal text-ink/50">· {req.userEmail}</span></h3>
          {req.bookTitle && <p className="text-sm text-ink/60">Book: {req.bookTitle}</p>}
          <p className="mt-1 text-xs text-ink/40">{new Date(req.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
        <div className="flex items-center gap-2">
          <input value={percent} onChange={(e) => setPercent(e.target.value)} className="w-16 rounded-lg border border-line px-2 py-1.5 text-sm" />
          <span className="text-sm text-ink/50">%</span>
          <button onClick={() => act("grant")} disabled={busy} className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60">Grant</button>
          <button onClick={() => act("reject")} disabled={busy} className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink/60 hover:border-red-300 hover:text-red-600 disabled:opacity-60">Reject</button>
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-3 text-sm text-ink/70">{req.message}</p>
    </div>
  );
}

export function DiscountUserRow({ user }: { user: { id: string; name: string; email: string; discountPercent: number } }) {
  const router = useRouter();
  const [percent, setPercent] = useState(String(user.discountPercent));
  const [busy, setBusy] = useState(false);

  async function save(newPercent: number) {
    setBusy(true);
    const res = await fetch("/api/admin/discounts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, percent: newPercent }) });
    if (res.ok) router.refresh();
    else setBusy(false);
  }

  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3 font-medium">{user.name}</td>
      <td className="px-4 py-3 text-ink/60">{user.email}</td>
      <td className="px-4 py-3">
        <input value={percent} onChange={(e) => setPercent(e.target.value)} className="w-16 rounded-lg border border-line px-2 py-1.5 text-sm" />%
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button onClick={() => save(Number(percent) || 0)} disabled={busy} className="text-xs font-semibold text-brand hover:underline">Save</button>
          <button onClick={() => save(0)} disabled={busy} className="text-xs font-semibold text-ink/40 hover:text-red-600">Remove</button>
        </div>
      </td>
    </tr>
  );
}
