"use client";

import { useMemo, useState } from "react";

// Order Author Copies — Print Cost per Book × No. of Copies + Shipping (per dashboard doc).
const PRINT_COST_PER_BOOK = 120; // rupees — placeholder; comes from the book's printCost in production
const SHIPPING_FLAT = 60; // rupees — placeholder shipping

export default function OrderCopiesPage() {
  const [copies, setCopies] = useState(10);

  const { subtotal, total } = useMemo(() => {
    const subtotal = copies * PRINT_COST_PER_BOOK;
    return { subtotal, total: subtotal + SHIPPING_FLAT };
  }, [copies]);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Order Author Copies</h1>
        <p className="text-sm text-ink/60">Print extra copies of your book at cost.</p>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink/70">Print Cost per Book</span>
          <span className="font-semibold">₹{PRINT_COST_PER_BOOK}</span>
        </div>

        <div>
          <label className="label">No. of Copies</label>
          <input
            type="number"
            min={1}
            className="input"
            value={copies}
            onChange={(e) => setCopies(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>

        <hr className="border-black/5" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/70">Cost</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/70">Shipping</span>
          <span>₹{SHIPPING_FLAT}</span>
        </div>
        <div className="flex items-center justify-between border-t border-black/5 pt-3 text-base font-bold">
          <span>Cost with Shipping</span>
          <span className="text-brand">₹{total.toLocaleString("en-IN")}</span>
        </div>

        <button className="btn-primary w-full">Proceed to Payment</button>
        <p className="text-center text-xs text-ink/50">
          Checkout uses Razorpay. Print cost &amp; shipping are configured per book/region.
        </p>
      </div>
    </div>
  );
}
