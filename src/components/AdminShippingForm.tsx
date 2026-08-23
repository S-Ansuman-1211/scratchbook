"use client";

import { useState } from "react";

export default function AdminShippingForm({
  standardChargeRupees,
  freeAboveRupees,
}: {
  standardChargeRupees: number;
  freeAboveRupees: number;
}) {
  const [standard, setStandard] = useState(String(standardChargeRupees));
  const [freeAbove, setFreeAbove] = useState(String(freeAboveRupees));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipping: {
          standardChargeRupees: Number(standard) || 0,
          freeAboveRupees: Number(freeAbove) || 0,
        },
      }),
    });
    setState(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setState("idle"), 1500);
  }

  return (
    <div className="card max-w-md space-y-4">
      <div>
        <label className="label">Standard shipping charge (₹)</label>
        <input className="input" value={standard} onChange={(e) => setStandard(e.target.value)} />
        <p className="mt-1 text-xs text-ink/45">Charged on orders with physical items below the free-shipping threshold.</p>
      </div>
      <div>
        <label className="label">Free shipping on orders at/above (₹)</label>
        <input className="input" value={freeAbove} onChange={(e) => setFreeAbove(e.target.value)} />
      </div>
      <button onClick={save} disabled={state === "saving"} className="btn-primary">
        {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : state === "error" ? "Retry" : "Save settings"}
      </button>
    </div>
  );
}
