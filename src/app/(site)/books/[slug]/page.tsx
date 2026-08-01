import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import BookCover from "@/components/BookCover";
import BookPurchase from "@/components/BookPurchase";

async function getBook(slug: string) {
  return prisma.book
    .findUnique({ where: { slug }, include: { author: true } })
    .catch(() => null);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  return { title: book ? `${book.title} | ScratchBook` : "Book | ScratchBook" };
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  const isUpcoming = book.status === "UPCOMING";
  const authorName = book.authorName ?? book.author?.penName ?? "ScratchBook Author";

  // A few more titles to show underneath.
  const related = await prisma.book
    .findMany({
      where: { slug: { not: slug }, status: { in: ["PUBLISHED", "UPCOMING"] } },
      take: 4,
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  const details: [string, string | number | null | undefined][] = [
    ["Type", book.type],
    ["Genre", book.genre],
    ["Language", book.language],
    ["Pages", book.pages],
    ["Size", book.sizeLabel],
    ["ISBN", book.isbn],
  ];

  return (
    <div className="container-x py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="text-sm text-ink/50">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/books" className="hover:text-brand">Books</Link>
        <span className="mx-2">/</span>
        <span className="text-ink/70">{book.title}</span>
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-[380px_1fr]">
        {/* Cover */}
        <div className="md:sticky md:top-24 md:self-start">
          <BookCover title={book.title} author={authorName} coverUrl={book.coverUrl} className="mx-auto w-64 shadow-lift md:w-full" />
        </div>

        {/* Info + purchase */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{book.type}</span>
            {isUpcoming && (
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                Pre-order
              </span>
            )}
          </div>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink">{book.title}</h1>
          <p className="mt-2 text-ink/60">
            by <span className="font-semibold text-ink/80">{authorName}</span>
          </p>

          {book.description && (
            <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">{book.description}</p>
          )}

          <BookPurchase
            bookId={book.id}
            title={book.title}
            paperbackPrice={book.paperbackPrice}
            hardcasePrice={book.hardcasePrice}
            ebookPrice={book.ebookPrice}
            isUpcoming={isUpcoming}
          />

          {/* Details table */}
          <div className="mt-10">
            <h2 className="font-serif text-xl font-bold text-ink">Product details</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {details
                .filter(([, v]) => v != null && v !== "")
                .map(([k, v]) => (
                  <div key={k} className="border-b border-line pb-2">
                    <dt className="text-xs uppercase tracking-wide text-ink/45">{k}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink/80">{String(v)}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-serif text-2xl font-semibold text-ink">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((b) => (
              <Link key={b.id} href={`/books/${b.slug}`} className="group">
                <BookCover title={b.title} coverUrl={b.coverUrl} className="transition-all group-hover:-translate-y-1.5 group-hover:shadow-lift" />
                <h3 className="mt-3 font-serif font-semibold text-ink line-clamp-1">{b.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
