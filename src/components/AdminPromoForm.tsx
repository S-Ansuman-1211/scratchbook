"use client";

import { useState } from "react";

export default function AdminPromoForm({
  enabled: initEnabled,
  thresholdRupees,
  percent: initPercent,
}: {
  enabled: boolean;
  thresholdRupees: number;
  percent: number;
}) {
  const [enabled, setEnabled] = useState(initEnabled);
  const [threshold, setThreshold] = useState(String(thresholdRupees));
  const [percent, setPercent] = useState(String(initPercent));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promo: { enabled, thresholdRupees: Number(threshold) || 0, percent: Number(percent) || 0 },
      }),
    });
    setState(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 1500);
  }

  return (
    <div className="card max-w-md space-y-4">
      <label className="flex items-center gap-2 text-sm text-ink/75">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Enable automatic order-value discount
      </label>
      <div>
        <label className="label">Applies when order value is at/above (₹)</label>
        <input className="input" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
      </div>
      <div>
        <label className="label">Discount percent (%)</label>
        <input className="input" value={percent} onChange={(e) => setPercent(e.target.value)} />
      </div>
      <button onClick={save} disabled={state === "saving"} className="btn-primary">
        {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : state === "error" ? "Retry" : "Save"}
      </button>
    </div>
  );
}
