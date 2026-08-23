import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Blog | ScratchBook Publications" };

export default async function BlogPage() {
  const posts = await prisma.blogPost
    .findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } })
    .catch(() => []);

  return (
    <div className="container-x py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Stories &amp; insights</span>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">The ScratchBook Blog</h1>
        </div>
        <Link href="/blog/submit" className="btn-primary px-5 py-2.5">Write a blog</Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center text-sm text-ink/45">
          Blog posts will appear here once published from the admin panel.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group card flex flex-col transition-all hover:-translate-y-1 hover:shadow-lift">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-ink to-[#2a2740]" />
              <h2 className="mt-4 font-serif text-lg font-bold text-ink group-hover:text-brand">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-ink/60">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink/50">
                <span>❤ {p.likes} likes</span>
                <span className="font-semibold text-brand">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
