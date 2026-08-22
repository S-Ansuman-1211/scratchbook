import { LAUNCHES } from "@/data/launches";
import LaunchCard from "@/components/LaunchCard";

export const metadata = { title: "Gallery | ScratchBook Publications" };

export default function GalleryPage() {
  return (
    <div className="container-x py-14">
      <div className="max-w-2xl">
        <span className="eyebrow">Moments &amp; milestones</span>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink md:text-5xl">Our Gallery</h1>
        <p className="mt-3 text-ink/60">
          Celebrity-led book launches, book fairs and events from across the ScratchBook journey -
          from Hyderabad to Doha.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LAUNCHES.map((l) => (
          <LaunchCard key={l.title} launch={l} />
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-dashed border-line bg-cream p-6 text-center text-sm text-ink/55">
        More event photographs from our book launches and fairs are added here regularly.
      </p>
    </div>
  );
}
