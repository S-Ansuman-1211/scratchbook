import { prisma } from "@/lib/prisma";
import ParticipateForm from "@/components/ParticipateForm";
import EventCollaboration from "@/components/EventCollaboration";

export const metadata = { title: "Events & Competitions | ScratchBook Publications" };
export const revalidate = 60;

type EventCard = { id?: string; title: string; type: string; description: string | null; bannerUrl?: string | null };

const FALLBACK: EventCard[] = [
  { title: "Photography Contest", type: "COMPETITION", description: "Capture a story in a single frame. Open to all skill levels." },
  { title: "Painting Contest", type: "COMPETITION", description: "Any medium, any theme - show us your imagination on canvas." },
  { title: "Poetry Contest", type: "COMPETITION", description: "Free verse or form - submit an original poem and get published." },
  { title: "Illustration Contest", type: "COMPETITION", description: "Illustrate a prompt and win a spot in our next anthology." },
  { title: "Story Contest", type: "COMPETITION", description: "A short story under 2000 words. Best entries get a book deal." },
];

export default async function EventsPage() {
  const events = await prisma.event
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  const list: EventCard[] =
    events.length > 0
      ? events.map((e) => ({ id: e.id, title: e.title, type: e.type, description: e.description, bannerUrl: e.bannerUrl }))
      : FALLBACK;

  return (
    <div className="container-x py-16">
      <span className="eyebrow">Showcase your talent</span>
      <h1 className="mt-2 font-serif text-4xl font-bold text-ink">
        Events, Competitions &amp; Collaborations
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">
        Events, competitions, collaborations, awards and records - opportunities to win and be
        recognised. Pick one below and register in seconds.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e, i) => (
          <div key={e.id ?? i} className="card flex flex-col">
            {e.bannerUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.bannerUrl} alt={e.title} className="mb-3 aspect-video w-full rounded-lg object-cover" />
            )}
            <span className="badge">{e.type}</span>
            <h2 className="mt-3 font-serif text-lg font-bold text-ink">{e.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">
              {e.description ?? "Open for submissions. Details to be announced."}
            </p>
            <ParticipateForm event={{ id: e.id, title: e.title, type: e.type }} />
          </div>
        ))}
      </div>

      {/* Collaboration CTA - lets anyone propose co-organising an event. */}
      <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-brand-tint/40 p-8 sm:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Partner with us</span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink">
              Want to organise an event with us?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              Colleges, communities, brands and fellow organisers - if you have an idea for a
              contest, book launch, workshop or festival, propose a collaboration. Share your
              details and our team will reach out to you by email to plan it together.
            </p>
          </div>
          <EventCollaboration />
        </div>
      </div>
    </div>
  );
}
