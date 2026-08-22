"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { id: string; name: string; email: string; mobile: string | null; requestedAt: string };

export default function AuthorRequestRow({ user }: { user: Row }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "done">("idle");

  async function act(action: "approve" | "reject") {
    setState("working");
    const res = await fetch("/api/admin/authors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, action }),
    });
    if (res.ok) {
      setState("done");
      router.refresh();
    } else {
      setState("idle");
    }
  }

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3 text-ink/60">{new Date(user.requestedAt).toLocaleDateString("en-IN")}</td>
      <td className="px-4 py-3 font-medium">{user.name}</td>
      <td className="px-4 py-3 text-ink/70">{user.email}</td>
      <td className="px-4 py-3 text-ink/70">{user.mobile ?? "-"}</td>
      <td className="px-4 py-3">
        {state === "done" ? (
          <span className="text-sm text-emerald-600">Done</span>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => act("approve")}
              disabled={state === "working"}
              className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {state === "working" ? "…" : "Approve"}
            </button>
            <button
              onClick={() => act("reject")}
              disabled={state === "working"}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink/60 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
