import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

const CHANNEL_LABEL: Record<string, string> = {
  DIRECT: "Direct Sales (Author copies)",
  AMAZON: "Amazon",
  BOOKSTORE: "Book Store",
  EBOOK_STORE: "Online E-Book Store",
};

// Sales Insight — Sales & Distribution Summary + Detailed Report (per Author Dashboard doc).
export default async function SalesPage() {
  const session = await getServerSession(authOptions);
  const profile = await prisma.authorProfile
    .findUnique({
      where: { userId: session!.user.id },
      include: { books: { include: { sales: true } } },
    })
    .catch(() => null);

  const sales = profile?.books.flatMap((b) => b.sales.map((s) => ({ ...s, bookTitle: b.title }))) ?? [];

  const totalCopies = sales.reduce((s, r) => s + r.copiesSold, 0);
  const totalProfit = sales.reduce((s, r) => s + r.profitEarned, 0);

  // Aggregate by channel for the detailed report
  const byChannel = sales.reduce<Record<string, { copies: number; profit: number }>>((acc, r) => {
    acc[r.channel] ??= { copies: 0, profit: 0 };
    acc[r.channel].copies += r.copiesSold;
    acc[r.channel].profit += r.profitEarned;
    return acc;
  }, {});

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

      {/* Detailed report */}
      <section>
        <h2 className="mb-4 font-serif text-xl font-bold">Detailed Report</h2>
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/60">
              <tr>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Copies Sold</th>
                <th className="px-4 py-3">Profit Earned</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(CHANNEL_LABEL).map((channel) => (
                <tr key={channel} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium">{CHANNEL_LABEL[channel]}</td>
                  <td className="px-4 py-3">{byChannel[channel]?.copies ?? 0}</td>
                  <td className="px-4 py-3">{formatINR(byChannel[channel]?.profit ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
