import { prisma } from "@/lib/prisma";
import { DiscountRequestRow, DiscountUserRow } from "@/components/AdminDiscountRow";

export default async function AdminDiscounts() {
  const [requests, discounted] = await Promise.all([
    prisma.discountRequest.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, include: { user: true } }).catch(() => []),
    prisma.user.findMany({ where: { discountPercent: { gt: 0 } }, orderBy: { name: "asc" } }).catch(() => []),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-serif text-2xl font-bold text-ink">Discounts</h2>
        <p className="mt-1 text-sm text-ink/55">Grant discount requests and manage which users get a personal discount.</p>
      </div>

      <section>
        <h3 className="mb-3 font-serif text-lg font-bold text-ink">Pending requests ({requests.length})</h3>
        {requests.length === 0 ? (
          <p className="card text-center text-sm text-ink/50">No pending discount requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <DiscountRequestRow
                key={r.id}
                req={{ id: r.id, message: r.message, bookTitle: r.bookTitle, userName: r.user.name, userEmail: r.user.email, createdAt: r.createdAt.toISOString() }}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 font-serif text-lg font-bold text-ink">Users with a discount ({discounted.length})</h3>
        {discounted.length === 0 ? (
          <p className="card text-center text-sm text-ink/50">No users currently have a personal discount.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase text-ink/55">
                <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Actions</th></tr>
              </thead>
              <tbody>
                {discounted.map((u) => (
                  <DiscountUserRow key={u.id} user={{ id: u.id, name: u.name, email: u.email, discountPercent: u.discountPercent }} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
