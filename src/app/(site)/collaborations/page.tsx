import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Collaborations | ScratchBook Publications" };
export const revalidate = 60;

export default async function CollaborationsPage() {
  const collabs = await prisma.collaboration
    .findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
    .catch(() => []);

  return (
    <div className="container-x py-14">
      <span className="eyebrow">Beyond publishing</span>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Our Collaborations</h1>
      <p className="mt-3 max-w-2xl text-ink/60">
        ScratchBook is a 360° creative platform. Explore our magazine and media ventures.
      </p>

      {collabs.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center text-sm text-ink/45">
          Collaborations will be listed here soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {collabs.map((c) => {
            const comingSoon = c.status === "COMING_SOON";
            const inner = (
              <div className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all ${comingSoon ? "opacity-90" : "hover:-translate-y-1 hover:shadow-lift"}`}>
                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-[#4c1d95] to-brand">
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-serif text-3xl font-bold text-white">{c.name}</span>
                  )}
                  {comingSoon && (
                    <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">Coming soon</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-serif text-2xl font-bold text-ink">{c.name}</h2>
                  {c.tagline && <p className="mt-1 text-sm font-semibold text-brand">{c.tagline}</p>}
                  {c.description && <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{c.description}</p>}
                  {!comingSoon && c.linkUrl && <span className="mt-4 text-sm font-semibold text-brand">Explore →</span>}
                </div>
              </div>
            );
            return !comingSoon && c.linkUrl ? (
              c.linkUrl.startsWith("http") ? (
                <a key={c.id} href={c.linkUrl} target="_blank" rel="noreferrer" className="block">{inner}</a>
              ) : (
                <Link key={c.id} href={c.linkUrl} className="block">{inner}</Link>
              )
            ) : (
              <div key={c.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
