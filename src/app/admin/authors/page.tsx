import { prisma } from "@/lib/prisma";
import AuthorRequestRow from "@/components/AuthorRequestRow";

export default async function AdminAuthors() {
  // Pending applications: users who asked to be authors but aren't yet.
  const pending = await prisma.user
    .findMany({
      where: { authorRequestedAt: { not: null }, role: "CUSTOMER" },
      orderBy: { authorRequestedAt: "asc" },
    })
    .catch(() => []);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Author Requests</h2>
      <p className="mt-1 text-sm text-ink/55">
        {pending.length} pending application{pending.length === 1 ? "" : "s"}. Approving promotes the
        member to an author and unlocks their dashboard.
      </p>

      {pending.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No pending author requests.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((u) => (
                <AuthorRequestRow
                  key={u.id}
                  user={{
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    mobile: u.mobile,
                    requestedAt: u.authorRequestedAt!.toISOString(),
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
