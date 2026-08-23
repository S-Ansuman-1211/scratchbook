import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminCollaborationRow from "@/components/AdminCollaborationRow";

export default async function AdminCollaborations() {
  const items = await prisma.collaboration.findMany({ orderBy: { createdAt: "asc" } }).catch(() => []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Collaborations</h2>
          <p className="mt-1 text-sm text-ink/55">Magazine & media ventures (DAA, Pixcorto, …) shown on the Collaborations page.</p>
        </div>
        <Link href="/admin/collaborations/new" className="btn-primary px-5 py-2.5">＋ Add collaboration</Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No collaborations yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <AdminCollaborationRow key={c.id} item={{ id: c.id, name: c.name, status: c.status, published: c.published }} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
