import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "News | ScratchBook Publications" };
export const revalidate = 60;

export default async function NewsPage() {
  const items = await prisma.news
    .findMany({ where: { published: true }, orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div className="container-x py-14">
      <span className="eyebrow">Latest</span>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">News &amp; Updates</h1>

      {items.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center text-sm text-ink/45">
          News will appear here once published.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => {
            const card = (
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-ink to-[#2a2740]">
                  {n.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.imageUrl} alt={n.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-ink/45">{n.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <h2 className="mt-1 font-serif text-lg font-bold text-ink">{n.title}</h2>
                  {n.summary && <p className="mt-2 flex-1 text-sm text-ink/60">{n.summary}</p>}
                  {n.linkUrl && <span className="mt-3 text-xs font-semibold text-brand">Read more →</span>}
                </div>
              </div>
            );
            return n.linkUrl ? (
              n.linkUrl.startsWith("http") ? (
                <a key={n.id} href={n.linkUrl} target="_blank" rel="noreferrer" className="block">{card}</a>
              ) : (
                <Link key={n.id} href={n.linkUrl} className="block">{card}</Link>
              )
            ) : (
              <div key={n.id}>{card}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
