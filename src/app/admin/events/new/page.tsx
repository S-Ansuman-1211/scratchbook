import Link from "next/link";
import AdminEventForm from "@/components/AdminEventForm";

export default function NewEventPage() {
  return (
    <div>
      <nav className="text-sm text-ink/50">
        <Link href="/admin/events" className="hover:text-brand">← Events</Link>
      </nav>
      <h2 className="mt-4 font-serif text-2xl font-bold text-ink">Add an event / competition</h2>
      <p className="mt-1 text-sm text-ink/55">It appears on the public Events page immediately.</p>
      <div className="mt-6">
        <AdminEventForm />
      </div>
    </div>
  );
}
