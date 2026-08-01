import Image from "next/image";
import type { Launch } from "@/data/launches";

const TAG_STYLE: Record<Launch["tag"], string> = {
  "CELEBRITY LAUNCH": "bg-purple text-white",
  "BOOK LAUNCH": "bg-brand text-white",
  "BOOK FAIR": "bg-orange text-white",
  EVENT: "bg-gold text-white",
};

export default function LaunchCard({ launch }: { launch: Launch }) {
  return (
    <figure className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        {launch.cover ? (
          <Image
            src={launch.cover}
            alt={launch.title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-[#2a2740] p-6 text-center">
            <span className="font-serif text-lg font-semibold text-white/90">{launch.title}</span>
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_STYLE[launch.tag]}`}>
          {launch.tag}
        </span>
      </div>
      <figcaption className="p-4">
        <h3 className="font-serif font-semibold text-ink line-clamp-1">{launch.title}</h3>
        <p className="mt-1 text-sm text-ink/60">{launch.by}</p>
      </figcaption>
    </figure>
  );
}
