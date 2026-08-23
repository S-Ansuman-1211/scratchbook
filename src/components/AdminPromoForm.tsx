"use client";

import { useState } from "react";

export default function AdminPromoForm({
  enabled: initEnabled,
  thresholdRupees,
  percent: initPercent,
  stack: initStack,
}: {
  enabled: boolean;
  thresholdRupees: number;
  percent: number;
  stack: boolean;
}) {
  const [enabled, setEnabled] = useState(initEnabled);
  const [threshold, setThreshold] = useState(String(thresholdRupees));
  const [percent, setPercent] = useState(String(initPercent));
  const [stack, setStack] = useState(initStack);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promo: { enabled, thresholdRupees: Number(threshold) || 0, percent: Number(percent) || 0, stack },
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
      <label className="flex items-start gap-2 text-sm text-ink/75">
        <input type="checkbox" className="mt-1" checked={stack} onChange={(e) => setStack(e.target.checked)} />
        <span>
          Stack discounts
          <span className="block text-xs text-ink/50">
            When off, a customer gets only the single best discount (per-book, this promo, or their
            personal discount). When on, all applicable discounts are combined.
          </span>
        </span>
      </label>
      <button onClick={save} disabled={state === "saving"} className="btn-primary">
        {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : state === "error" ? "Retry" : "Save"}
      </button>
    </div>
  );
}
