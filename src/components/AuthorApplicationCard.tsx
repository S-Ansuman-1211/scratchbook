"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type App = {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar: string | null;
  bio: string | null;
  genre: string | null;
  manuscriptUrl: string | null;
  createdAt: string;
};

export default function AuthorApplicationCard({ app }: { app: App }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "done">("idle");

  async function act(action: "approve" | "reject") {
    setState("working");
    const res = await fetch("/api/admin/authors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: app.id, action }),
    });
    if (res.ok) {
      setState("done");
      router.refresh();
    } else {
      setState("idle");
    }
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink">{app.name}</h3>
          <p className="text-sm text-ink/60">
            {app.email} · {app.phone}{app.genre ? ` · ${app.genre}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-ink/40">Applied {new Date(app.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
        {state === "done" ? (
          <span className="text-sm text-emerald-600">Done</span>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => act("approve")} disabled={state === "working"} className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
              {state === "working" ? "…" : "Approve"}
            </button>
            <button onClick={() => act("reject")} disabled={state === "working"} className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-ink/60 hover:border-red-300 hover:text-red-600 disabled:opacity-60">
              Reject
            </button>
          </div>
        )}
      </div>

      {app.bio && <p className="mt-3 border-t border-line pt-3 text-sm text-ink/70">{app.bio}</p>}

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        {app.aadhaar && <span className="text-ink/60">Aadhaar/ID: <strong className="text-ink/80">{app.aadhaar}</strong></span>}
        {app.manuscriptUrl && (
          <a href={app.manuscriptUrl} target="_blank" rel="noreferrer" className="font-semibold text-brand hover:underline">
            📄 View manuscript ↗
          </a>
        )}
      </div>
    </div>
  );
}
