"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReorderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function reorder() {
    setBusy(true);
    const res = await fetch("/api/orders/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    if (res.ok) router.push("/cart");
    else setBusy(false);
  }

  return (
    <button onClick={reorder} disabled={busy} className="btn-outline px-4 py-1.5 text-xs">
      {busy ? "Adding…" : "Reorder"}
    </button>
  );
}
