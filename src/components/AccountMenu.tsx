"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// Amazon/Myntra-style account dropdown: avatar trigger + menu of links.
export default function AccountMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!session?.user) return null;
  const role = session.user.role;
  const initial = session.user.name?.[0]?.toUpperCase() ?? "U";

  const Item = ({ href, icon, label }: { href: string; icon: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink/75 transition hover:bg-cream hover:text-brand"
    >
      <span className="w-4 text-center">{icon}</span> {label}
    </Link>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white ring-2 ring-transparent transition hover:ring-brand/30"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-white shadow-lift">
          <div className="border-b border-line bg-cream px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{session.user.name}</p>
            <p className="truncate text-xs text-ink/50">{session.user.email}</p>
          </div>

          <div className="p-1.5">
            <Item href="/account/orders" icon="📦" label="My Orders" />
            <Item href="/account/wishlist" icon="❤" label="My Wishlist" />
            <Item href="/account/requests" icon="📝" label="My Requests" />

            {role === "AUTHOR" && (
              <>
                <div className="my-1.5 border-t border-line" />
                <Item href="/dashboard" icon="✍️" label="Author Dashboard" />
              </>
            )}
            {role === "ADMIN" && (
              <>
                <div className="my-1.5 border-t border-line" />
                <Item href="/admin" icon="🛠️" label="Admin Panel" />
              </>
            )}

            <div className="my-1.5 border-t border-line" />
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink/75 transition hover:bg-red-50 hover:text-red-600"
            >
              <span className="w-4 text-center">↩</span> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
