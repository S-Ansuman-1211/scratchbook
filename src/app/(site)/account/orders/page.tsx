import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";
import ReorderButton from "@/components/ReorderButton";

export const metadata = { title: "My Orders | ScratchBook Publications" };

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-200 text-slate-700",
  FULFILLED: "bg-brand-tint text-brand",
};

export default async function MyOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const { success } = await searchParams;

  const orders = await prisma.order
    .findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    })
    .catch(() => []);

  return (
    <div className="container-x max-w-3xl py-14">
      <h1 className="font-serif text-3xl font-semibold text-ink">My Orders</h1>

      {success && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="font-serif text-lg font-bold text-emerald-800">✅ Payment successful - your order is confirmed!</p>
          <p className="mt-1 text-sm text-emerald-700">
            Order reference <strong>{success}</strong>. A confirmation email is on its way. Thank you for your order!
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="mt-8 card text-center text-sm text-ink/50">
          You haven&apos;t placed any orders yet. Browse{" "}
          <Link href="/books" className="font-semibold text-brand">books</Link>.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((o) => (
            <div key={o.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-ink/45">{o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · #{o.id.slice(-6)}</p>
                  <p className="mt-0.5 font-serif text-lg font-bold text-ink">{formatINR(o.totalAmount)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[o.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {o.status}
                </span>
              </div>

              <ul className="mt-3 space-y-1 border-t border-line pt-3 text-sm text-ink/70">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.title} × {it.quantity}</span>
                    <span>{formatINR(it.unitPrice * it.quantity)}</span>
                  </li>
                ))}
              </ul>

              {(o.discountAmount > 0 || o.taxAmount > 0 || o.shippingCost > 0) && (
                <div className="mt-2 space-y-0.5 text-xs text-ink/50">
                  {o.discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>- {formatINR(o.discountAmount)}</span></div>}
                  {o.taxAmount > 0 && <div className="flex justify-between"><span>GST</span><span>{formatINR(o.taxAmount)}</span></div>}
                  <div className="flex justify-between"><span>Shipping</span><span>{o.shippingCost === 0 ? "Free" : formatINR(o.shippingCost)}</span></div>
                </div>
              )}

              {o.shippingAddress && (
                <p className="mt-3 text-xs text-ink/50">Delivering to: {o.shippingName}, {o.shippingAddress}</p>
              )}

              <div className="mt-4 flex justify-end">
                <ReorderButton orderId={o.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
