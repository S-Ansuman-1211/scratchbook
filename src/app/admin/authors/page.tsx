import { prisma } from "@/lib/prisma";
import AuthorApplicationCard from "@/components/AuthorApplicationCard";

export default async function AdminAuthors() {
  const applications = await prisma.authorApplication
    .findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" } })
    .catch(() => []);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-ink">Author Requests</h2>
      <p className="mt-1 text-sm text-ink/55">
        {applications.length} pending application{applications.length === 1 ? "" : "s"}. Review the details and
        manuscript, then approve (promotes to Author + unlocks the dashboard) or reject.
      </p>

      {applications.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No pending author applications.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {applications.map((a) => (
            <AuthorApplicationCard
              key={a.id}
              app={{
                id: a.id,
                name: a.name,
                email: a.email,
                phone: a.phone,
                aadhaar: a.aadhaar,
                bio: a.bio,
                genre: a.genre,
                manuscriptUrl: a.manuscriptUrl,
                createdAt: a.createdAt.toISOString(),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
