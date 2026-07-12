import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/books", label: "Published Books" },
  { href: "/dashboard/sales", label: "Sales Insight" },
  { href: "/dashboard/order-copies", label: "Order Author Copies" },
  { href: "/dashboard/premium", label: "Premium Services" },
  { href: "/dashboard/marketing", label: "Marketing Tools" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Only authors (and admins) may access the dashboard.
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  if (session.user.role === "CUSTOMER") redirect("/");

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/5 bg-white md:flex">
        <div className="border-b border-black/5 p-6">
          <Link href="/" className="font-serif text-xl font-bold text-brand">
            Scratch<span className="text-ink">Book</span>
          </Link>
          <p className="mt-1 text-xs text-ink/50">Author Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-brand/10 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-black/5 p-4">
          <Link href="/" className="text-sm text-ink/50 hover:text-brand">← Back to site</Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-6">
          <h1 className="font-serif text-lg font-bold">Welcome, {session.user.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/books" className="text-ink/60 hover:text-brand">Discover Books</Link>
            <Link href="/cart" className="text-ink/60 hover:text-brand">Cart</Link>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">
              {session.user.name?.[0]?.toUpperCase()}
            </span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
