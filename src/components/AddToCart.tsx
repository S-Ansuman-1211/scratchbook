"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  kind: "BOOK" | "SERVICE" | "MAGAZINE";
  refId: string;
  title: string;
  unitPrice: number | null; // paise
  meta?: Record<string, unknown>;
  className?: string;
  label?: string;
};

/**
 * Adds a product to the cart via /api/cart. If the user isn't signed in it
 * sends them to login (returning to the current page afterwards).
 */
export default function AddToCart({ kind, refId, title, unitPrice, meta, className = "", label = "Add to cart" }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");

  const disabled = unitPrice == null;

  async function add() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setState("adding");
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, refId, title, unitPrice, quantity: 1, meta }),
    });
    if (res.ok) {
      setState("added");
      setTimeout(() => setState("idle"), 1800);
    } else {
      setState("idle");
    }
  }

  if (disabled) {
    return (
      <button disabled className={`btn-outline w-full cursor-not-allowed opacity-50 ${className}`}>
        Coming soon
      </button>
    );
  }

  return (
    <button onClick={add} disabled={state === "adding"} className={`btn-primary w-full ${className}`}>
      {state === "adding" ? "Adding…" : state === "added" ? "✓ Added" : label}
    </button>
  );
}
