"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatINR } from "@/lib/money";

type CartItem = {
  id: string;
  title: string;
  unitPrice: number;
  quantity: number;
};

export default function CartPage() {
  const { status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  const loadCart = useCallback(async () => {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadCart();
    else if (status === "unauthenticated") setLoading(false);
  }, [status, loadCart]);

  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  async function removeItem(id: string) {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    loadCart();
  }

  // PhonePe uses a redirect flow: create the order, then send the buyer to the
  // PhonePe-hosted checkout page. They return to /payment-status afterwards.
  async function handleCheckout() {
    setPaying(true);
    setMessage("");

    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();

    if (!res.ok || !data.redirectUrl) {
      setMessage(data.error || "Could not start checkout.");
      setPaying(false);
      return;
    }

    // Hand off to PhonePe.
    window.location.href = data.redirectUrl;
  }

  return (
    <div className="container-x max-w-3xl py-16">
      <h1 className="font-serif text-3xl font-bold">Your Cart</h1>

      {status === "unauthenticated" ? (
        <p className="mt-8 card text-center text-sm">
          Please{" "}
          <Link href="/login?callbackUrl=/cart" className="font-semibold text-brand">log in</Link>{" "}
          to view your cart and check out.
        </p>
      ) : loading ? (
        <p className="mt-8 text-sm text-ink/50">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 card text-center text-sm text-ink/50">
          Your cart is empty. Browse our{" "}
          <Link href="/services" className="font-semibold text-brand">services</Link> or{" "}
          <Link href="/books" className="font-semibold text-brand">books</Link>.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-ink/60">
                  {formatINR(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">{formatINR(item.unitPrice * item.quantity)}</span>
                <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="card flex items-center justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-brand">{formatINR(total)}</span>
          </div>

          {message && <p className="rounded-lg bg-cream px-4 py-3 text-sm">{message}</p>}

          <button onClick={handleCheckout} disabled={paying} className="btn-primary w-full">
            {paying ? "Redirecting to PhonePe…" : "Pay with PhonePe"}
          </button>
          <p className="text-center text-xs text-ink/50">
            You&apos;ll be redirected to PhonePe to pay securely via UPI, card or netbanking.
          </p>
        </div>
      )}
    </div>
  );
}
