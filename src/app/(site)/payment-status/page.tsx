"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type State = "checking" | "PAID" | "FAILED" | "PENDING" | "error";

function PaymentStatusInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    if (!orderId) {
      setState("error");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    // PhonePe may still be settling when the buyer is redirected back, so we poll
    // a few times before giving up on a PENDING state.
    async function check() {
      attempts += 1;
      try {
        const res = await fetch(`/api/checkout/status?orderId=${orderId}`);
        const data = await res.json();
        if (cancelled) return;

        if (data.status === "PAID") return setState("PAID");
        if (data.status === "FAILED") return setState("FAILED");

        if (attempts < 5) {
          setTimeout(check, 2000);
        } else {
          setState("PENDING");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="container-x flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-16 text-center">
      {state === "checking" && (
        <>
          <Spinner />
          <h1 className="mt-6 font-serif text-2xl font-bold">Confirming your payment…</h1>
          <p className="mt-2 text-sm text-ink/60">Please don&apos;t close this window.</p>
        </>
      )}

      {state === "PAID" && (
        <>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">✅</div>
          <h1 className="mt-6 font-serif text-2xl font-bold text-green-700">Payment successful!</h1>
          <p className="mt-2 text-sm text-ink/60">Your order is confirmed. Thank you.</p>
          <Link href="/" className="btn-primary mt-6">Back to home</Link>
        </>
      )}

      {state === "FAILED" && (
        <>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl">❌</div>
          <h1 className="mt-6 font-serif text-2xl font-bold text-red-700">Payment failed</h1>
          <p className="mt-2 text-sm text-ink/60">You were not charged. Please try again.</p>
          <Link href="/cart" className="btn-primary mt-6">Return to cart</Link>
        </>
      )}

      {state === "PENDING" && (
        <>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-3xl">⏳</div>
          <h1 className="mt-6 font-serif text-2xl font-bold text-amber-700">Payment pending</h1>
          <p className="mt-2 text-sm text-ink/60">
            Your payment is being processed. We&apos;ll update your order once PhonePe confirms it.
          </p>
          <Link href="/" className="btn-outline mt-6">Back to home</Link>
        </>
      )}

      {state === "error" && (
        <>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-red-100 text-3xl">⚠️</div>
          <h1 className="mt-6 font-serif text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink/60">We couldn&apos;t verify this payment. Please contact support.</p>
          <Link href="/contact" className="btn-outline mt-6">Contact support</Link>
        </>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense>
      <PaymentStatusInner />
    </Suspense>
  );
}
