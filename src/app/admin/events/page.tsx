import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminEventRow from "@/components/AdminEventRow";

export default async function AdminEvents() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Events &amp; Competitions</h2>
          <p className="mt-1 text-sm text-ink/55">Create contests, open/close submissions, and delete.</p>
        </div>
        <Link href="/admin/events/new" className="btn-primary px-5 py-2.5">＋ Add event</Link>
      </div>

      {events.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">
          No events yet. The public page shows sample contests until you add real ones.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <AdminEventRow key={e.id} event={{ id: e.id, title: e.title, type: e.type, isOpen: e.isOpen }} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
