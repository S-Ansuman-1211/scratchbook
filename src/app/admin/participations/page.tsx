import { prisma } from "@/lib/prisma";

export default async function AdminParticipations() {
  const rows = await prisma.eventParticipation
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Event Entries</h2>
      <p className="mt-1 text-sm text-ink/55">{rows.length} total registrations.</p>

      {rows.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No entries yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Entry</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="px-4 py-3 text-ink/60">{r.createdAt.toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 font-medium">{r.eventTitle}</td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3 text-ink/70">{r.email}</td>
                  <td className="px-4 py-3 text-ink/70">{r.category ?? "-"}</td>
                  <td className="px-4 py-3">
                    {r.entryUrl ? (
                      <a href={r.entryUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">Link ↗</a>
                    ) : "-"}
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
