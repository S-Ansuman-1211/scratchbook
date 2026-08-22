import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Published Books - Book Details (Size, Pages, ISBN, Language, Genre, Book Type),
// latest files, and management links (Author Dashboard doc).
export default async function DashboardBooksPage() {
  const session = await getServerSession(authOptions);
  const profile = await prisma.authorProfile
    .findUnique({ where: { userId: session!.user.id }, include: { books: true } })
    .catch(() => null);

  const books = profile?.books ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Published Books</h1>

      {books.length === 0 ? (
        <p className="card text-center text-sm text-ink/50">
          No books yet. Books published with ScratchBook will appear here with full details.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {books.map((b) => (
            <div key={b.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold">{b.title}</h2>
                  <span className="text-xs uppercase text-ink/50">{b.type} · {b.status}</span>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Detail label="Size" value={b.sizeLabel} />
                <Detail label="Pages" value={b.pages?.toString()} />
                <Detail label="ISBN" value={b.isbn} />
                <Detail label="Language" value={b.language} />
                <Detail label="Genre" value={b.genre} />
                <Detail label="Book Type" value={b.type} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-outline px-3 py-1.5 text-xs">Latest Files (PDF)</button>
                <button className="btn-outline px-3 py-1.5 text-xs">Contact Support</button>
                <a href="/dashboard/order-copies" className="btn-primary px-3 py-1.5 text-xs">Order Copies</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-ink/50">{label}</dt>
      <dd className="font-medium">{value || "-"}</dd>
    </div>
  );
}
