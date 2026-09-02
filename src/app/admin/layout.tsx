import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/books", label: "Books & Prices" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/collaborations", label: "Collaborations" },
  { href: "/admin/magazines", label: "Magazines" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/authors", label: "Author Requests" },
  { href: "/admin/author-earnings", label: "Author Earnings" },
  { href: "/admin/participations", label: "Event Entries" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Admins only.
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white md:flex">
        <div className="border-b border-line p-6">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-xs font-black text-white">S</span>
            ScratchBook
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-brand-tint hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <Link href="/" className="text-sm text-ink/50 hover:text-brand">← Back to site</Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-6">
          <h1 className="font-serif text-lg font-bold text-ink">Admin Panel</h1>
          <span className="text-sm text-ink/60">{session.user.name}</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
