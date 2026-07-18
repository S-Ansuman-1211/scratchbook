import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";
import BookCover from "@/components/BookCover";
import AddToCart from "@/components/AddToCart";

// Home page — premium e-commerce storefront for ScratchBook Publications.
export default async function HomePage() {
  const upcoming = await prisma.book
    .findMany({ where: { status: "UPCOMING" }, take: 4, orderBy: { createdAt: "desc" } })
    .catch(() => []);
  const published = await prisma.book
    .findMany({ where: { status: "PUBLISHED" }, take: 4, orderBy: { publishedAt: "desc" } })
    .catch(() => []);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-center text-xs font-medium text-white/85">
        <p className="container-x py-2">
          ✦ Free author mentorship consultation this month —{" "}
          <Link href="/signup?role=AUTHOR" className="font-semibold text-gold-light underline-offset-2 hover:underline">
            claim your slot
          </Link>
        </p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-paper">
        {/* soft decorative glows — indigo, purple & orange */}
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-purple/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-orange/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />

        <div className="container-x relative grid items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div className="flex flex-col justify-center">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              An independent unit under Inkzoid Publication
            </span>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
              Turn your manuscript into a{" "}
              <span className="bg-gradient-to-r from-purple via-brand to-orange bg-clip-text italic text-transparent">
                best-seller.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/65">
              Mentorship, publishing, branding and promotions — everything an author needs, in one
              place. Buy books, book workshops, and grow your readership.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/books" className="btn-primary px-7 py-3 text-base">
                Shop books
              </Link>
              <Link href="/signup?role=AUTHOR" className="btn-outline px-7 py-3 text-base">
                Start publishing →
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                ["500+", "Authors mentored"],
                ["1,200+", "Titles published"],
                ["4.9★", "Author rating"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-serif text-2xl font-bold text-ink">{n}</dt>
                  <dd className="mt-1 text-xs text-ink/55">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Layered covers */}
          <div className="relative hidden justify-center md:flex">
            <div className="grid grid-cols-2 gap-5">
              {[
                "The Weight of Quiet Mornings",
                "Letters I Never Sent",
                "Ink & Other Small Rebellions",
                "A Field Guide to Beginnings",
              ].map((t, i) => (
                <BookCover
                  key={t}
                  title={t}
                  className={`w-40 shadow-lift ${i % 2 ? "translate-y-8" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-t border-line bg-white/60">
          <div className="container-x grid grid-cols-2 gap-4 py-5 text-sm md:grid-cols-4">
            {[
              ["🔒", "Secure UPI & card checkout"],
              ["🚚", "Pan-India shipping"],
              ["✍️", "End-to-end publishing"],
              ["★", "Rated 4.9 by authors"],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2.5 text-ink/70">
                <span className="text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { t: "Books", d: "Buy & pre-order", href: "/books", emoji: "📚", tint: "bg-brand-tint" },
            { t: "Services", d: "Publish & promote", href: "/services", emoji: "🚀", tint: "bg-purple-tint" },
            { t: "Magazine", d: "Read editions", href: "/magazine", emoji: "📰", tint: "bg-orange-tint" },
            { t: "Events", d: "Contests & awards", href: "/events", emoji: "🏆", tint: "bg-gold/15" },
          ].map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="group card flex items-center gap-4 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.tint} text-2xl`}>
                {c.emoji}
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">{c.t}</h3>
                <p className="text-sm text-ink/55">{c.d}</p>
              </div>
              <span className="ml-auto text-ink/30 transition group-hover:translate-x-1 group-hover:text-brand">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Published books — buy now */}
      <BookRow
        title="Bestsellers"
        subtitle="Buy now"
        books={published}
        emptyText="Our catalog is being added."
        cta="buy"
      />

      {/* Upcoming — pre-order */}
      <BookRow
        title="Coming soon"
        subtitle="Pre-order now"
        books={upcoming}
        emptyText="New titles dropping soon."
        cta="preorder"
        muted
      />

      {/* Value props */}
      <section className="container-x py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">Why ScratchBook</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-4xl">
            Everything a book needs, under one roof
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { t: "Mentorship", d: "Personal mentorship for solo books and anthologies — learn the craft from professionals.", n: "01", color: "text-brand" },
            { t: "Publishing", d: "Editing, proofreading, cover design, listing and distribution — end to end.", n: "02", color: "text-purple" },
            { t: "Branding & Promotion", d: "Build a personal brand, run digital promotions, reach readers of your niche.", n: "03", color: "text-orange" },
          ].map((c) => (
            <div key={c.t} className="card transition-all hover:-translate-y-1 hover:shadow-lift">
              <span className={`font-serif text-3xl font-bold ${c.color}`}>{c.n}</span>
              <h3 className="mt-3 font-serif text-xl font-bold text-ink">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-line bg-cream py-16">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">In their words</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Loved by our authors</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Their mentorship turned my manuscript into a published book in months.", "Priya · Solo Author"],
              ["The promotion packages got my anthology real readers, not just numbers.", "Arjun · Anthology Compiler"],
              ["Transparent earnings and a dashboard that actually shows my sales.", "Neha · Best-seller"],
            ].map(([quote, who], i) => (
              <figure key={i} className="card flex flex-col justify-between">
                <div className="text-gold">{"★★★★★"}</div>
                <blockquote className="mt-3 font-serif text-lg leading-relaxed text-ink/85">
                  “{quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-ink/60">{who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Events CTA */}
      <section className="container-x py-16">
        <div className="relative overflow-hidden rounded-2xl bg-ink p-10 text-white md:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-orange/25 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
                Showcase your talent
              </span>
              <h2 className="mt-3 font-serif text-3xl font-semibold">Events &amp; Competitions</h2>
              <p className="mt-2 max-w-xl text-white/70">
                Photography, painting, poetry, illustration and story contests — win awards, get
                published, and even apply for records.
              </p>
            </div>
            <Link href="/events" className="btn-primary shrink-0 px-7 py-3 text-base">
              Participate now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function BookRow({
  title,
  subtitle,
  books,
  emptyText,
  cta,
  muted,
}: {
  title: string;
  subtitle: string;
  books: { id: string; title: string; slug: string; coverUrl: string | null; paperbackPrice: number | null; ebookPrice: number | null }[];
  emptyText: string;
  cta: "buy" | "preorder";
  muted?: boolean;
}) {
  return (
    <section className={muted ? "bg-white py-16" : "py-16"}>
      <div className="container-x">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="eyebrow">{subtitle}</span>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">{title}</h2>
          </div>
          <Link href="/books" className="text-sm font-semibold text-brand hover:text-brand-dark">
            View all →
          </Link>
        </div>

        {books.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-12 text-center text-sm text-ink/45">
            {emptyText}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {books.map((b) => {
              const price = b.paperbackPrice ?? b.ebookPrice;
              return (
                <div key={b.id} className="group flex flex-col">
                  <Link href={`/books/${b.slug}`}>
                    <BookCover title={b.title} coverUrl={b.coverUrl} className="transition-all group-hover:-translate-y-1.5 group-hover:shadow-lift" />
                  </Link>
                  <h3 className="mt-3 font-serif font-semibold text-ink line-clamp-1">{b.title}</h3>
                  <p className="text-sm font-bold text-gold">{formatINR(price)}</p>
                  <div className="mt-auto pt-3">
                    <AddToCart
                      kind="BOOK"
                      refId={b.id}
                      title={b.title}
                      unitPrice={price}
                      meta={{ format: "paperback" }}
                      label={cta === "buy" ? "Add to cart" : "Pre-order"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
