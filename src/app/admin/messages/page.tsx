import { prisma } from "@/lib/prisma";

export default async function AdminMessages() {
  const rows = await prisma.contactMessage
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Contact Messages</h2>
      <p className="mt-1 text-sm text-ink/55">{rows.length} total enquiries.</p>

      {rows.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((m) => (
            <div key={m.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-ink">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="ml-2 text-sm text-brand hover:underline">{m.email}</a>
                  {m.phone && <span className="ml-2 text-sm text-ink/55">· {m.phone}</span>}
                </div>
                <span className="text-xs text-ink/45">{m.createdAt.toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
