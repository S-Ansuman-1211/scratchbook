import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

export default async function AdminOverview() {
  const [books, orders, paidAgg, participations, messages, users] = await Promise.all([
    prisma.book.count().catch(() => 0),
    prisma.order.count().catch(() => 0),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalAmount: true } }).catch(() => ({ _sum: { totalAmount: 0 } })),
    prisma.eventParticipation.count().catch(() => 0),
    prisma.contactMessage.count().catch(() => 0),
    prisma.user.count().catch(() => 0),
  ]);

  const stats = [
    { label: "Revenue (paid)", value: formatINR(paidAgg._sum.totalAmount ?? 0), href: "/admin/orders", highlight: true },
    { label: "Orders", value: String(orders), href: "/admin/orders" },
    { label: "Books", value: String(books), href: "/admin/books" },
    { label: "Event entries", value: String(participations), href: "/admin/participations" },
    { label: "Messages", value: String(messages), href: "/admin/messages" },
    { label: "Users", value: String(users), href: "/admin" },
  ];

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Overview</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`card transition-all hover:-translate-y-1 hover:shadow-lift ${s.highlight ? "bg-ink text-white" : ""}`}
          >
            <p className={`text-xs uppercase tracking-wide ${s.highlight ? "text-white/60" : "text-ink/50"}`}>{s.label}</p>
            <p className="mt-1 font-serif text-3xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
