import { prisma } from "@/lib/prisma";
import AdminAuthorEarnings from "@/components/AdminAuthorEarnings";

// Admin edits each author's dashboard figures - copies sold + royalty per book,
// plus total earnings and wallet balance. These feed the Author Dashboard.
export default async function AdminAuthorEarningsPage() {
  const [profiles, books] = await Promise.all([
    prisma.authorProfile
      .findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          books: { include: { sales: true }, orderBy: { title: "asc" } },
        },
      })
      .catch(() => []),
    prisma.book.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, authorProfileId: true } }).catch(() => []),
  ]);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Author Earnings</h2>
      <p className="mt-1 max-w-3xl text-sm text-ink/55">
        Set the figures shown on each author&apos;s dashboard - number of copies sold and royalty
        per book, plus total earnings and wallet balance. Link a book to an author here to make it
        appear in their dashboard.
      </p>

      {profiles.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">
          No authors yet. Approve an author application under{" "}
          <span className="font-semibold">Author Requests</span> first.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {profiles.map((p) => {
            const linkedBooks = p.books.map((b) => {
              // Collapse this book's records into a figure per channel.
              const byChannel: Record<string, { copiesSold: number; royaltyRupees: number }> = {};
              for (const r of b.sales) {
                byChannel[r.channel] ??= { copiesSold: 0, royaltyRupees: 0 };
                byChannel[r.channel].copiesSold += r.copiesSold;
                byChannel[r.channel].royaltyRupees += r.profitEarned / 100;
              }
              return { id: b.id, title: b.title, byChannel };
            });
            // Books available to add: not linked to any author yet.
            const availableBooks = books
              .filter((b) => !b.authorProfileId)
              .map((b) => ({ id: b.id, title: b.title }));

            return (
              <AdminAuthorEarnings
                key={p.id}
                profileId={p.id}
                authorName={p.user?.name ?? p.penName ?? "Author"}
                authorEmail={p.user?.email ?? ""}
                totalEarningsRupees={p.totalEarnings / 100}
                walletBalanceRupees={p.walletBalance / 100}
                linkedBooks={linkedBooks}
                availableBooks={availableBooks}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
