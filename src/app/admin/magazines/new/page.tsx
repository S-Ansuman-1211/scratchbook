import Link from "next/link";
import AdminMagazineForm from "@/components/AdminMagazineForm";

export default function NewMagazinePage() {
  return (
    <div>
      <nav className="text-sm text-ink/50">
        <Link href="/admin/magazines" className="hover:text-brand">← Magazines</Link>
      </nav>
      <h2 className="mt-4 font-serif text-2xl font-bold text-ink">Add a magazine edition</h2>
      <p className="mt-1 text-sm text-ink/55">It appears on the public Magazine page immediately.</p>
      <div className="mt-6">
        <AdminMagazineForm />
      </div>
    </div>
  );
}
