import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

async function getMagazine(slug: string) {
  return prisma.magazine.findUnique({ where: { slug } }).catch(() => null);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMagazine(slug);
  return { title: m ? `${m.title} | ScratchBook Magazine` : "Magazine | ScratchBook" };
}

export default async function MagazineReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getMagazine(slug);
  if (!m) notFound();

  return (
    <div className="container-x py-10 md:py-14">
      <nav className="text-sm text-ink/50">
        <Link href="/magazine" className="hover:text-brand">← Back to magazines</Link>
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-[320px_1fr]">
        {/* Cover + meta */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line shadow-lift">
            <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-gold to-[#a15c07] p-5 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">ScratchBook</span>
              <h2 className="font-serif text-2xl font-bold leading-tight">{m.title}</h2>
              <span className="text-sm text-white/80">{m.edition}</span>
            </div>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between border-b border-line pb-2">
              <dt className="text-ink/50">Type</dt><dd className="font-medium">{m.type.replace("_", " / ")}</dd>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <dt className="text-ink/50">Pages</dt><dd className="font-medium">{m.pages}</dd>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <dt className="text-ink/50">Paper</dt><dd className="font-medium">{m.gsm} GSM</dd>
            </div>
            <div className="flex justify-between border-b border-line pb-2">
              <dt className="text-ink/50">Price</dt>
              <dd className="font-semibold text-gold">{formatINR(m.pages * m.pricePerPage)}</dd>
            </div>
          </dl>

          {m.pdfUrl && (
            <a href={m.pdfUrl} download className="btn-outline mt-5 w-full">Download PDF</a>
          )}
        </div>

        {/* Reader */}
        <div>
          <span className="badge">{m.edition ?? "Latest edition"}</span>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">{m.title}</h1>
          {m.description && <p className="mt-4 leading-relaxed text-ink/70">{m.description}</p>}

          <div className="mt-8">
            <h2 className="font-serif text-xl font-bold text-ink">Read online</h2>
            {m.readOnline && m.pdfUrl ? (
              <iframe
                src={m.pdfUrl}
                title={m.title}
                className="mt-4 h-[80vh] w-full rounded-xl border border-line"
              />
            ) : (
              <div className="mt-4 flex aspect-[16/10] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-cream text-center">
                <p className="text-4xl">📖</p>
                <p className="mt-3 max-w-sm text-sm text-ink/55">
                  {m.readOnline
                    ? "The online reader for this edition will be available here once the PDF is uploaded."
                    : "This edition is available in print only. Contact us to order a copy."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
