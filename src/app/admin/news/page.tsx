import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminNewsRow from "@/components/AdminNewsRow";

export default async function AdminNews() {
  const items = await prisma.news.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">News</h2>
          <p className="mt-1 text-sm text-ink/55">Published news appears in the homepage slider and the News page.</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary px-5 py-2.5">＋ Add news</Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No news yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <AdminNewsRow key={n.id} item={{ id: n.id, title: n.title, published: n.published, createdAt: n.createdAt.toISOString() }} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
