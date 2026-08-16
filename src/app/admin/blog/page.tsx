import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminBlogRow from "@/components/AdminBlogRow";

export default async function AdminBlog() {
  const posts = await prisma.blogPost
    .findMany({ orderBy: { publishedAt: "desc" } })
    .catch(() => []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Blog</h2>
          <p className="mt-1 text-sm text-ink/55">Write posts, add external article links, publish or hide them.</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary px-5 py-2.5">＋ New post</Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 card text-center text-sm text-ink/50">No blog posts yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase text-ink/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <AdminBlogRow
                  key={p.id}
                  post={{ id: p.id, title: p.title, published: p.published, linkUrl: p.linkUrl, createdAt: p.publishedAt.toISOString() }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
