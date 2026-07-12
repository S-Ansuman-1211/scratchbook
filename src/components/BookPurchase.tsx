"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/money";

type Format = { key: "paperback" | "hardcase" | "ebook"; label: string; price: number };

/**
 * Format selector + quantity + add-to-cart for a single book. Only formats
 * that have a price are shown. Adds the chosen format to /api/cart.
 */
export default function BookPurchase({
  bookId,
  title,
  paperbackPrice,
  hardcasePrice,
  ebookPrice,
  isUpcoming,
}: {
  bookId: string;
  title: string;
  paperbackPrice: number | null;
  hardcasePrice: number | null;
  ebookPrice: number | null;
  isUpcoming: boolean;
}) {
  const formats = useMemo<Format[]>(() => {
    const f: Format[] = [];
    if (paperbackPrice != null) f.push({ key: "paperback", label: "Paperback", price: paperbackPrice });
    if (hardcasePrice != null) f.push({ key: "hardcase", label: "Hardcase", price: hardcasePrice });
    if (ebookPrice != null) f.push({ key: "ebook", label: "eBook", price: ebookPrice });
    return f;
  }, [paperbackPrice, hardcasePrice, ebookPrice]);

  const { status } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");

  if (formats.length === 0) {
    return <p className="mt-6 text-sm text-ink/50">Pricing to be announced.</p>;
  }

  const active = formats[selected];

  async function add(goToCart: boolean) {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setState("adding");
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "BOOK",
        refId: bookId,
        title: `${title} (${active.label})`,
        unitPrice: active.price,
        quantity: qty,
        meta: { format: active.key },
      }),
    });
    if (res.ok) {
      setState("added");
      if (goToCart) router.push("/cart");
      else setTimeout(() => setState("idle"), 1800);
    } else {
      setState("idle");
    }
  }

  return (
    <div className="mt-6">
      {/* Format pills */}
      <p className="label">Format</p>
      <div className="flex flex-wrap gap-2">
        {formats.map((f, i) => (
          <button
            key={f.key}
            onClick={() => setSelected(i)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              i === selected
                ? "border-brand bg-brand-tint text-brand"
                : "border-line bg-white text-ink/70 hover:border-brand/40"
            }`}
          >
            {f.label}
            <span className="ml-2 text-xs opacity-70">{formatINR(f.price)}</span>
          </button>
        ))}
      </div>

      {/* Price + quantity */}
      <div className="mt-6 flex items-end gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">Price</p>
          <p className="font-serif text-3xl font-bold text-ink">{formatINR(active.price)}</p>
        </div>
        <div>
          <p className="label">Qty</p>
          <div className="flex items-center rounded-full border border-line bg-white">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5 text-lg text-ink/60 hover:text-brand" aria-label="Decrease">−</button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5 text-lg text-ink/60 hover:text-brand" aria-label="Increase">+</button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button onClick={() => add(false)} disabled={state === "adding"} className="btn-outline flex-1 py-3">
          {state === "added" ? "✓ Added to cart" : "Add to cart"}
        </button>
        <button onClick={() => add(true)} disabled={state === "adding"} className="btn-primary flex-1 py-3">
          {isUpcoming ? "Pre-order now" : "Buy now"}
        </button>
      </div>
      <p className="mt-3 text-xs text-ink/50">🔒 Secure checkout via UPI, Google Pay, PhonePe & cards.</p>
    </div>
  );
}
