"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { formatINR } from "@/lib/money";
import { computeTotals, DEFAULT_SHIPPING, type ShippingConfig, type PricedItem } from "@/lib/pricing";

type CartItem = {
  id: string;
  title: string;
  unitPrice: number;
  quantity: number;
  kind: "BOOK" | "SERVICE" | "MAGAZINE";
  meta?: { format?: string } | null;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const emptyShip = {
  name: "", phone: "", house: "", area: "", city: "", state: "", pincode: "", landmark: "", mapUrl: "",
};

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState<ShippingConfig>(DEFAULT_SHIPPING);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [ship, setShip] = useState(emptyShip);

  const loadCart = useCallback(async () => {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
      if (data.shipping) setShipping(data.shipping);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadCart();
    else if (status === "unauthenticated") setLoading(false);
  }, [status, loadCart]);

  useEffect(() => {
    if (session?.user?.name) setShip((s) => (s.name ? s : { ...s, name: session.user.name! }));
  }, [session?.user?.name]);

  const priced: PricedItem[] = items.map((i) => ({ kind: i.kind, unitPrice: i.unitPrice, quantity: i.quantity, meta: i.meta }));
  const totals = computeTotals(priced, shipping);

  async function removeItem(id: string) {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    loadCart();
  }

  function validShip() {
    return (
      ship.name.trim().length >= 2 && ship.phone.trim().length >= 7 && ship.house.trim().length >= 1 &&
      ship.area.trim().length >= 2 && ship.city.trim().length >= 2 && ship.state.trim().length >= 2 &&
      ship.pincode.trim().length >= 4
    );
  }

  async function handleCheckout() {
    if (!validShip()) {
      setMessage("Please fill in all required delivery fields (marked *) before paying.");
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
        shippingHouse: ship.house.trim(),
        shippingArea: ship.area.trim(),
        shippingCity: ship.city.trim(),
        shippingState: ship.state.trim(),
        shippingPincode: ship.pincode.trim(),
        shippingLandmark: ship.landmark.trim(),
        shippingMapUrl: ship.mapUrl.trim(),
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
      prefill: { name: data.customer?.name, email: data.customer?.email, contact: data.customer?.contact },
      theme: { color: "#4f46e5" },
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
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
          router.push(`/account/orders?success=${data.orderId}`);
        } else {
          setMessage("⚠️ Payment could not be verified. Contact support.");
          setPaying(false);
        }
      },
    });
    rzp.open();
    setPaying(false);
  }

  const field = (k: keyof typeof ship) => ({ value: ship[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setShip({ ...ship, [k]: e.target.value }) });

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="container-x max-w-3xl py-16">
        <h1 className="font-serif text-3xl font-bold">Your Cart</h1>

        {status === "unauthenticated" ? (
          <p className="mt-8 card text-center text-sm">
            Please <Link href="/login?callbackUrl=/cart" className="font-semibold text-brand">sign in</Link> to view your cart and check out.
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
                  <p className="text-sm text-ink/60">{formatINR(item.unitPrice)} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatINR(item.unitPrice * item.quantity)}</span>
                  <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                </div>
              </div>
            ))}

            {/* Price breakdown */}
            <div className="card space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
              {totals.tax > 0 && <div className="flex justify-between"><span className="text-ink/60">GST (18% on services)</span><span>{formatINR(totals.tax)}</span></div>}
              <div className="flex justify-between">
                <span className="text-ink/60">Shipping</span>
                <span>{totals.shippingCost === 0 ? <span className="text-emerald-600">Free</span> : formatINR(totals.shippingCost)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-2 text-lg font-bold">
                <span>Total</span><span className="text-brand">{formatINR(totals.total)}</span>
              </div>
            </div>

            {/* Delivery details */}
            <div className="card space-y-4">
              <h2 className="font-serif text-lg font-bold text-ink">Delivery details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Full name *</label><input className="input" placeholder="Recipient's name" {...field("name")} /></div>
                <div><label className="label">Phone number *</label><input className="input" placeholder="10-digit mobile" {...field("phone")} /></div>
              </div>
              <div><label className="label">Flat / House no., Building *</label><input className="input" {...field("house")} /></div>
              <div><label className="label">Street / Area / Locality *</label><input className="input" {...field("area")} /></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="label">City *</label><input className="input" {...field("city")} /></div>
                <div><label className="label">State *</label><input className="input" {...field("state")} /></div>
                <div><label className="label">PIN code *</label><input className="input" {...field("pincode")} /></div>
              </div>
              <div><label className="label">Landmark</label><input className="input" placeholder="Optional" {...field("landmark")} /></div>
              <div>
                <label className="label">Google Maps link (optional)</label>
                <input className="input" placeholder="Paste a Google Maps link to your address for accurate delivery" {...field("mapUrl")} />
                <p className="mt-1 text-xs text-ink/45">Open Google Maps → drop a pin on your location → Share → copy link.</p>
              </div>
            </div>

            {message && <p className="rounded-lg bg-cream px-4 py-3 text-sm">{message}</p>}

            <button onClick={handleCheckout} disabled={paying} className="btn-primary w-full">
              {paying ? "Processing…" : `Proceed to Pay ${formatINR(totals.total)}`}
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
