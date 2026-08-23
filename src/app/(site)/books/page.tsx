import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";
import BookCover from "@/components/BookCover";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";

export const metadata = { title: "Books | ScratchBook Publications" };
export const revalidate = 60;

export default async function BooksPage() {
  const books = await prisma.book
    .findMany({ where: { status: { in: ["PUBLISHED", "UPCOMING"] } }, orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div className="container-x py-14">
      <div className="max-w-2xl">
        <span className="eyebrow">Discover</span>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">The Bookshelf</h1>
        <p className="mt-3 text-ink/60">
          Paperbacks, hardcases and ebooks from ScratchBook authors. Buy now or pre-order upcoming
          titles.
        </p>
      </div>

      {books.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-line p-12 text-center text-sm text-ink/45">
          Books will be listed here once added.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {books.map((b) => {
            const price = b.paperbackPrice ?? b.ebookPrice;
            const isUpcoming = b.status === "UPCOMING";
            return (
              <div key={b.id} className="group flex flex-col">
                <div className="relative">
                  <Link href={`/books/${b.slug}`}>
                    <BookCover title={b.title} author={b.authorName} coverUrl={b.coverUrl} className="transition-all group-hover:-translate-y-1.5 group-hover:shadow-lift" />
                    {isUpcoming && (
                      <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                        Pre-order
                      </span>
                    )}
                  </Link>
                  <div className="absolute right-2 top-2"><WishlistButton bookId={b.id} /></div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="badge">{b.type}</span>
                  {b.language && <span className="text-[11px] text-ink/40">{b.language}</span>}
                </div>
                <h3 className="mt-1.5 font-serif font-semibold text-ink line-clamp-1">{b.title}</h3>
                {b.authorName && <p className="text-xs text-ink/50">by {b.authorName}</p>}
                <p className="mt-0.5 text-sm font-bold text-gold">{formatINR(price)}</p>
                <div className="mt-auto pt-3">
                  <AddToCart
                    kind="BOOK"
                    refId={b.id}
                    title={b.title}
                    unitPrice={price}
                    meta={{ format: "paperback" }}
                    label={isUpcoming ? "Pre-order" : "Add to cart"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
