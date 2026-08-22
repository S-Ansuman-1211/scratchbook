import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-200 text-slate-700",
  FULFILLED: "bg-brand-tint text-brand",
};

export default async function AdminOrders() {
  const orders = await prisma.order
    .findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: true },
    })
    .catch(() => []);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Orders</h2>
      <p className="mt-1 text-sm text-ink/55">{orders.length} total orders.</p>

      {orders.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-line align-top">
                  <td className="px-4 py-3 text-ink/60">{o.createdAt.toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.user?.name ?? "-"}</div>
                    <div className="text-xs text-ink/50">{o.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {o.items.map((it) => `${it.title} ×${it.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatINR(o.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[o.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
