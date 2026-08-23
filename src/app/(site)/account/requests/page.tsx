import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "My Requests | ScratchBook Publications" };

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

function Badge({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account/requests");

  const [authorApps, discountReqs] = await Promise.all([
    prisma.authorApplication.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.discountRequest.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } }).catch(() => []),
  ]);

  return (
    <div className="container-x max-w-3xl py-14">
      <h1 className="font-serif text-3xl font-semibold text-ink">My Requests</h1>

      <section className="mt-8">
        <h2 className="font-serif text-lg font-bold text-ink">Author applications</h2>
        {authorApps.length === 0 ? (
          <p className="mt-3 card text-sm text-ink/55">
            No author applications. Want to publish?{" "}
            <Link href="/become-author" className="font-semibold text-brand">Become an author</Link>.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {authorApps.map((a) => (
              <div key={a.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">Author application</p>
                  <p className="text-xs text-ink/45">{a.createdAt.toLocaleDateString("en-IN")}{a.genre ? ` · ${a.genre}` : ""}</p>
                </div>
                <Badge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-lg font-bold text-ink">Discount requests</h2>
        {discountReqs.length === 0 ? (
          <p className="mt-3 card text-sm text-ink/55">
            No discount requests.{" "}
            <Link href="/request-discount" className="font-semibold text-brand">Request a discount</Link>.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {discountReqs.map((r) => (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink">{r.bookTitle || "Discount request"}</p>
                  <Badge status={r.status} />
                </div>
                <p className="mt-1 text-sm text-ink/60">{r.message}</p>
                {r.status === "APPROVED" && r.grantedPercent != null && (
                  <p className="mt-2 text-sm font-semibold text-emerald-600">{r.grantedPercent}% discount active on your account 🎉</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
