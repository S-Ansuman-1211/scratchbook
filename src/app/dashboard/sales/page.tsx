import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

// Sales Insight - Sales & Distribution Summary + per-book Detailed Report.
export default async function SalesPage() {
  const session = await getServerSession(authOptions);
  const profile = await prisma.authorProfile
    .findUnique({
      where: { userId: session!.user.id },
      include: { books: { include: { sales: true }, orderBy: { title: "asc" } } },
    })
    .catch(() => null);

  // One row per book: total copies sold + royalty earned.
  const byBook = (profile?.books ?? []).map((b) => ({
    title: b.title,
    copies: b.sales.reduce((s, r) => s + r.copiesSold, 0),
    profit: b.sales.reduce((s, r) => s + r.profitEarned, 0),
  }));

  const totalCopies = byBook.reduce((s, r) => s + r.copies, 0);
  const totalProfit = byBook.reduce((s, r) => s + r.profit, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold">Sales Insight</h1>
        <p className="text-sm text-ink/60">Sales &amp; Distribution Summary</p>
      </div>

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="card">
          <p className="text-xs uppercase text-ink/50">Quantity Sold</p>
          <p className="mt-1 font-serif text-3xl font-bold">{totalCopies}</p>
        </div>
        <div className="card bg-gradient-to-br from-brand to-brand-dark text-white">
          <p className="text-xs uppercase text-white/70">Profit</p>
          <p className="mt-1 font-serif text-3xl font-bold">{formatINR(totalProfit)}</p>
        </div>
      </div>

      {/* Detailed report - per book */}
      <section>
        <h2 className="mb-4 font-serif text-xl font-bold">Detailed Report</h2>
        {byBook.length === 0 ? (
          <p className="card text-center text-sm text-ink/50">
            No sales recorded yet. Figures appear here once your publisher updates them.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase text-ink/60">
                <tr>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Copies Sold</th>
                  <th className="px-4 py-3">Royalty Earned</th>
                </tr>
              </thead>
              <tbody>
                {byBook.map((r) => (
                  <tr key={r.title} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium">{r.title}</td>
                    <td className="px-4 py-3">{r.copies}</td>
                    <td className="px-4 py-3">{formatINR(r.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
