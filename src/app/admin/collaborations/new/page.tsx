import Link from "next/link";
import AdminCollaborationForm from "@/components/AdminCollaborationForm";

export default function NewCollaborationPage() {
  return (
    <div>
      <nav className="text-sm text-ink/50">
        <Link href="/admin/collaborations" className="hover:text-brand">← Collaborations</Link>
      </nav>
      <h2 className="mt-4 font-serif text-2xl font-bold text-ink">Add a collaboration</h2>
      <p className="mt-1 text-sm text-ink/55">Appears on the public Collaborations page (mark "Coming soon" if not live yet).</p>
      <div className="mt-6">
        <AdminCollaborationForm />
      </div>
    </div>
  );
}
