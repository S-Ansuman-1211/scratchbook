"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Heart toggle to add/remove a book from the wishlist.
export default function WishlistButton({ bookId, className = "" }: { bookId: string; className?: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [wished, setWished] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => setWished(Array.isArray(d.bookIds) && d.bookIds.includes(bookId)))
      .catch(() => {});
  }, [status, bookId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setBusy(true);
    const next = !wished;
    setWished(next);
    await fetch(`/api/wishlist${next ? "" : `?bookId=${bookId}`}`, {
      method: next ? "POST" : "DELETE",
      headers: next ? { "Content-Type": "application/json" } : undefined,
      body: next ? JSON.stringify({ bookId }) : undefined,
    }).catch(() => setWished(!next));
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      title={wished ? "In your wishlist" : "Add to wishlist"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line bg-white/90 shadow-soft backdrop-blur transition hover:border-brand ${className}`}
    >
      <span className={wished ? "text-red-500" : "text-ink/40"}>{wished ? "❤" : "🤍"}</span>
    </button>
  );
}
