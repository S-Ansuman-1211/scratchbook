import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Magazine | ScratchBook Publications" };

export default async function MagazinePage() {
  const magazines = await prisma.magazine
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div className="container-x py-16">
      <span className="eyebrow">Read &amp; collaborate</span>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Magazines</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/60">
        Rs. 8 per page · 190 GSM · multiples of four pages. Movie, Personal and Group/Diva editions.
        Submit content for the ongoing edition, request a collab, read online or download the PDF.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="btn-outline">Submit content for the ongoing edition</button>
        <button className="btn-outline">Request for Collab</button>
      </div>

      {magazines.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center text-sm text-ink/45">
          Magazine editions will be listed here once published.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {magazines.map((m) => (
            <article key={m.id} className="group card transition-all hover:-translate-y-1 hover:shadow-lift">
              <Link href={`/magazine/${m.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  {m.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.coverUrl} alt={m.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-gold to-[#a15c07] p-4 text-white">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">ScratchBook</span>
                      <h2 className="font-serif text-lg font-bold leading-tight">{m.title}</h2>
                      <span className="text-xs text-white/80">{m.edition}</span>
                    </div>
                  )}
                </div>
              </Link>
              <span className="badge mt-3">{m.type.replace("_", " / ")}</span>
              <h2 className="mt-2 font-serif text-lg font-bold text-ink">{m.title}</h2>
              <p className="text-sm text-ink/60">{m.pages} pages · {m.gsm} GSM</p>
              <p className="mt-1 text-sm font-bold text-gold">{formatINR(m.pages * m.pricePerPage)}</p>
              <Link href={`/magazine/${m.slug}`} className="btn-primary mt-3 w-full py-2 text-xs">
                {m.readOnline ? "Read online" : "View edition"}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
