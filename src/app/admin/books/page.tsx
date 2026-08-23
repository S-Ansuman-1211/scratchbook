import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminBookRow from "@/components/AdminBookRow";

export default async function AdminBooks() {
  const books = await prisma.book
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Books &amp; Prices</h2>
          <p className="mt-1 text-sm text-ink/55">
            Edit status, prices (in ₹) and cover image. Upload a cover per row, then Save.
          </p>
        </div>
        <Link href="/admin/books/new" className="btn-primary px-5 py-2.5">＋ Add book</Link>
      </div>

      {books.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No books yet. Seed the database or add books.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Paperback ₹</th>
                <th className="px-4 py-3">Hardcase ₹</th>
                <th className="px-4 py-3">eBook ₹</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <AdminBookRow
                  key={b.id}
                  book={{
                    id: b.id,
                    title: b.title,
                    status: b.status,
                    paperbackPrice: b.paperbackPrice,
                    hardcasePrice: b.hardcasePrice,
                    ebookPrice: b.ebookPrice,
                    discountPercent: b.discountPercent,
                    coverUrl: b.coverUrl,
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
