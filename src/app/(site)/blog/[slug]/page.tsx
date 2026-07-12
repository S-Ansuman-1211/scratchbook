import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LikeButton, Comments } from "@/components/BlogInteractions";

async function getPost(slug: string) {
  return prisma.blogPost
    .findUnique({
      where: { slug },
      include: { comments: { orderBy: { createdAt: "desc" } } },
    })
    .catch(() => null);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post ? `${post.title} | ScratchBook Blog` : "Article | ScratchBook" };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const comments = post.comments.map((c) => ({
    id: c.id,
    authorName: c.authorName,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <article className="py-10 md:py-14">
      <div className="container-x max-w-3xl">
        <nav className="text-sm text-ink/50">
          <Link href="/blog" className="hover:text-brand">← Back to blog</Link>
        </nav>

        <p className="mt-6 text-xs font-medium text-ink/50">
          {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-ink md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-4 text-lg text-ink/60">{post.excerpt}</p>}
      </div>

      {/* Cover */}
      <div className="container-x mt-8 max-w-4xl">
        <div className="aspect-[16/7] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-[#2a2740]" />
      </div>

      {/* Body */}
      <div className="container-x mt-10 max-w-3xl">
        <div className="prose-scratchbook space-y-4 text-[17px] leading-relaxed text-ink/80">
          {post.body.split("\n").filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 border-y border-line py-6">
          <LikeButton postId={post.id} initialLikes={post.likes} />
          <span className="text-sm text-ink/50">Enjoyed this? Give it a like.</span>
        </div>

        <div className="mt-10">
          <Comments postId={post.id} initialComments={comments} />
        </div>
      </div>
    </article>
  );
}
