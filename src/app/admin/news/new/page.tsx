import Link from "next/link";
import AdminNewsForm from "@/components/AdminNewsForm";

export default function NewNewsPage() {
  return (
    <div>
      <nav className="text-sm text-ink/50">
        <Link href="/admin/news" className="hover:text-brand">← News</Link>
      </nav>
      <h2 className="mt-4 font-serif text-2xl font-bold text-ink">Add news</h2>
      <p className="mt-1 text-sm text-ink/55">It appears in the homepage slider and News page immediately.</p>
      <div className="mt-6">
        <AdminNewsForm />
      </div>
    </div>
  );
}
