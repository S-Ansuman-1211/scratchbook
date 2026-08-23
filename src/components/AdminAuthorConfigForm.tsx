"use client";

import { useState } from "react";

export default function AdminAuthorConfigForm({
  requireAadhaar,
  requireManuscript,
}: {
  requireAadhaar: boolean;
  requireManuscript: boolean;
}) {
  const [aadhaar, setAadhaar] = useState(requireAadhaar);
  const [manuscript, setManuscript] = useState(requireManuscript);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: { requireAadhaar: aadhaar, requireManuscript: manuscript } }),
    });
    setState(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 1500);
  }

  return (
    <div className="card max-w-md space-y-3">
      <label className="flex items-center gap-2 text-sm text-ink/75">
        <input type="checkbox" checked={aadhaar} onChange={(e) => setAadhaar(e.target.checked)} />
        Require Aadhaar / ID on the author application
      </label>
      <label className="flex items-center gap-2 text-sm text-ink/75">
        <input type="checkbox" checked={manuscript} onChange={(e) => setManuscript(e.target.checked)} />
        Require a manuscript upload
      </label>
      <button onClick={save} disabled={state === "saving"} className="btn-primary">
        {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : state === "error" ? "Retry" : "Save"}
      </button>
    </div>
  );
}
