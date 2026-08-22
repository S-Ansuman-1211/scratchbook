"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/magazine", label: "Magazine" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-md">
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-xl font-bold text-ink">
          <Image src="/brand/sbp-logo.png" alt="ScratchBook Publications" width={40} height={40} className="h-10 w-auto" priority />
          <span>Scratch<span className="text-brand">Book</span></span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-ink/65 transition hover:text-brand"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-ink/70 transition hover:text-brand"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </Link>
          {session?.user ? (
            <>
              {session.user.role === "AUTHOR" && (
                <Link href="/dashboard" className="text-sm font-semibold text-brand">
                  Dashboard
                </Link>
              )}
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="text-sm font-semibold text-brand">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-outline px-4 py-1.5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink/70 hover:text-brand">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary px-4 py-1.5">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="my-1.5 block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <ul className="container-x flex flex-col py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-medium text-ink/80"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-3">
              {session?.user ? (
                <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-outline">
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/login" className="btn-outline flex-1">Sign In</Link>
                  <Link href="/signup" className="btn-primary flex-1">Sign Up</Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
