import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

// Author Dashboard overview - Author Details, Earnings, Quick actions, Published books.
export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);

  const profile = await prisma.authorProfile
    .findUnique({
      where: { userId: session!.user.id },
      include: {
        books: {
          include: { sales: true },
          orderBy: { createdAt: "desc" },
        },
      },
    })
    .catch(() => null);

  const titlesPublished = profile?.books.filter((b) => b.status === "PUBLISHED").length ?? 0;

  return (
    <div className="space-y-8">
      {/* Author details + earnings cards */}
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Author Name" value={session!.user.name ?? "-"} />
        <StatCard label="Titles Published" value={String(titlesPublished)} />
        <StatCard label="Total Earnings" value={formatINR(profile?.totalEarnings ?? 0)} highlight />
        <StatCard label="Wallet Balance" value={formatINR(profile?.walletBalance ?? 0)} highlight />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 font-serif text-xl font-bold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction href="/dashboard/order-copies" title="Order Author Copies" desc="Print extra copies for yourself." />
          <QuickAction href="/dashboard/premium" title="Premium Services" desc="Digital, promotional & recognition packages." />
          <QuickAction href="/dashboard/marketing" title="Marketing Tools" desc="Giveaways, reviews, trailers & more." />
          <QuickAction href="/dashboard/sales" title="Sales Insight" desc="Channel-wise sales & profit reports." />
        </div>
      </section>

      {/* Published books table */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">Published Books</h2>
          <Link href="/dashboard/books" className="text-sm font-semibold text-brand hover:underline">
            Manage all →
          </Link>
        </div>

        {!profile || profile.books.length === 0 ? (
          <p className="card text-center text-sm text-ink/50">
            No books yet. Once your book is published it will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase text-ink/60">
                <tr>
                  <th className="px-4 py-3">Book Name</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Copies Sold</th>
                  <th className="px-4 py-3">Royalty</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {profile.books.map((b) => {
                  const copies = b.sales.reduce((s, r) => s + r.copiesSold, 0);
                  const royalty = b.sales.reduce((s, r) => s + r.profitEarned, 0);
                  return (
                    <tr key={b.id} className="border-t border-black/5">
                      <td className="px-4 py-3 font-medium">{b.title}</td>
                      <td className="px-4 py-3 text-ink/60">
                        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-IN") : "-"}
                      </td>
                      <td className="px-4 py-3">{copies}</td>
                      <td className="px-4 py-3">{formatINR(royalty)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/books/${b.id}`} className="text-brand hover:underline">
                          View &amp; Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`card ${highlight ? "bg-gradient-to-br from-brand to-brand-dark text-white" : ""}`}>
      <p className={`text-xs uppercase ${highlight ? "text-white/70" : "text-ink/50"}`}>{label}</p>
      <p className="mt-1 font-serif text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickAction({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card transition hover:border-brand hover:shadow-md">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink/60">{desc}</p>
    </Link>
  );
}
