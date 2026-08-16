import Link from "next/link";
import AdminBookForm from "@/components/AdminBookForm";

export default function NewBookPage() {
  return (
    <div>
      <nav className="text-sm text-ink/50">
        <Link href="/admin/books" className="hover:text-brand">← Books &amp; Prices</Link>
      </nav>
      <h2 className="mt-4 font-serif text-2xl font-bold text-ink">Add a new book</h2>
      <p className="mt-1 text-sm text-ink/55">
        Fill in the details and upload a cover. It appears in the catalog immediately (unless set to Draft).
      </p>
      <div className="mt-6">
        <AdminBookForm />
      </div>
    </div>
  );
}
