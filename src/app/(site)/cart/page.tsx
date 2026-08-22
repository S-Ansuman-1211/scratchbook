"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Script from "next/script";
import { formatINR } from "@/lib/money";

type CartItem = {
  id: string;
  title: string;
  unitPrice: number;
  quantity: number;
};

// Minimal typing for the Razorpay checkout global injected by the SDK script.
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  // Delivery details for physical book orders.
  const [ship, setShip] = useState({ name: "", phone: "", address: "" });

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

  // Prefill the delivery name from the account once loaded.
  useEffect(() => {
    if (session?.user?.name) setShip((s) => (s.name ? s : { ...s, name: session.user.name! }));
  }, [session?.user?.name]);

  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  async function removeItem(id: string) {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    loadCart();
  }

  async function handleCheckout() {
    // Basic client-side validation before hitting the server.
    if (ship.name.trim().length < 2 || ship.phone.trim().length < 7 || ship.address.trim().length < 10) {
      setMessage("Please fill in your delivery name, phone and full address before paying.");
      return;
    }

    setPaying(true);
    setMessage("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingName: ship.name.trim(),
        shippingPhone: ship.phone.trim(),
        shippingAddress: ship.address.trim(),
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Could not start checkout.");
      setPaying(false);
      return;
    }

    if (!window.Razorpay) {
      setMessage("Payment SDK still loading - please try again in a moment.");
      setPaying(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "ScratchBook Publications",
      description: "Order payment",
      order_id: data.razorpayOrderId,
      prefill: {
        name: data.customer?.name,
        email: data.customer?.email,
        contact: data.customer?.contact,
      },
      theme: { color: "#4f46e5" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verify = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        if (verify.ok) {
          setMessage("✅ Payment successful! Your order is confirmed.");
          setItems([]);
        } else {
          setMessage("⚠️ Payment could not be verified. Contact support.");
        }
        setPaying(false);
      },
    });
    rzp.open();
    setPaying(false);
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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

            {/* Delivery details - required for shipping physical books */}
            <div className="card space-y-4">
              <h2 className="font-serif text-lg font-bold text-ink">Delivery details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="ship-name">Full name *</label>
                  <input
                    id="ship-name" className="input" placeholder="Recipient's name"
                    value={ship.name} onChange={(e) => setShip({ ...ship, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="ship-phone">Phone number *</label>
                  <input
                    id="ship-phone" className="input" placeholder="10-digit mobile"
                    value={ship.phone} onChange={(e) => setShip({ ...ship, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="ship-address">Delivery address *</label>
                <textarea
                  id="ship-address" rows={3} className="input"
                  placeholder="Flat / house no., street, area, city, state, PIN code"
                  value={ship.address} onChange={(e) => setShip({ ...ship, address: e.target.value })}
                />
              </div>
            </div>

            {message && <p className="rounded-lg bg-cream px-4 py-3 text-sm">{message}</p>}

            <button onClick={handleCheckout} disabled={paying} className="btn-primary w-full">
              {paying ? "Processing…" : "Proceed to Pay"}
            </button>
            <p className="text-center text-xs text-ink/50">
              🔒 Secure payment via Razorpay - UPI, Google Pay, PhonePe, cards &amp; netbanking.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
