import Link from "next/link";
import AdminBlogForm from "@/components/AdminBlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <nav className="text-sm text-ink/50">
        <Link href="/admin/blog" className="hover:text-brand">← Blog</Link>
      </nav>
      <h2 className="mt-4 font-serif text-2xl font-bold text-ink">New blog post</h2>
      <p className="mt-1 text-sm text-ink/55">Write an article, add an external link, and upload a cover image.</p>
      <div className="mt-6">
        <AdminBlogForm />
      </div>
    </div>
  );
}
