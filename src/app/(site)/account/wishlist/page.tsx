import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";
import BookCover from "@/components/BookCover";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";

export const metadata = { title: "My Wishlist | ScratchBook Publications" };

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account/wishlist");

  const items = await prisma.wishlistItem
    .findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, include: { book: true } })
    .catch(() => []);

  return (
    <div className="container-x py-14">
      <h1 className="font-serif text-3xl font-semibold text-ink">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="mt-8 card text-center text-sm text-ink/50">
          Your wishlist is empty. Browse <Link href="/books" className="font-semibold text-brand">books</Link> and tap the ❤ to save them here.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map(({ book: b }) => {
            const price = b.paperbackPrice ?? b.ebookPrice;
            return (
              <div key={b.id} className="group flex flex-col">
                <div className="relative">
                  <Link href={`/books/${b.slug}`}>
                    <BookCover title={b.title} author={b.authorName} coverUrl={b.coverUrl} className="transition-all group-hover:-translate-y-1.5 group-hover:shadow-lift" />
                  </Link>
                  <div className="absolute right-2 top-2"><WishlistButton bookId={b.id} /></div>
                </div>
                <h3 className="mt-3 font-serif font-semibold text-ink line-clamp-1">{b.title}</h3>
                <p className="text-sm font-bold text-gold">{formatINR(price)}</p>
                <div className="mt-auto pt-3">
                  <AddToCart kind="BOOK" refId={b.id} title={b.title} unitPrice={price} meta={{ format: "paperback" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
