import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminMagazineRow from "@/components/AdminMagazineRow";

export default async function AdminMagazines() {
  const magazines = await prisma.magazine.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Magazines</h2>
          <p className="mt-1 text-sm text-ink/55">Add editions with a cover, PDF link and details.</p>
        </div>
        <Link href="/admin/magazines/new" className="btn-primary px-5 py-2.5">＋ Add magazine</Link>
      </div>

      {magazines.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No magazines yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Edition</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {magazines.map((m) => (
                <AdminMagazineRow key={m.id} magazine={{ id: m.id, title: m.title, type: m.type, edition: m.edition }} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
