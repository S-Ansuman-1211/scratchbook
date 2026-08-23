"use client";

import { useRef } from "react";
import Link from "next/link";

export type NewsItem = {
  id: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
};

// Horizontally sliding news cards with prev/next controls.
export default function NewsCarousel({ items }: { items: NewsItem[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    track.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute -top-14 right-0 hidden gap-2 sm:flex">
        <button onClick={() => scrollBy(-1)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink/60 hover:border-brand hover:text-brand">‹</button>
        <button onClick={() => scrollBy(1)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink/60 hover:border-brand hover:text-brand">›</button>
      </div>

      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((n) => {
          const card = (
            <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
              <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-ink to-[#2a2740]">
                {n.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.imageUrl} alt={n.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif font-bold text-ink">{n.title}</h3>
                {n.summary && <p className="mt-1 line-clamp-3 text-sm text-ink/60">{n.summary}</p>}
                {n.linkUrl && <span className="mt-3 text-xs font-semibold text-brand">Read more →</span>}
              </div>
            </div>
          );
          return (
            <div key={n.id} className="w-[300px] shrink-0 snap-start">
              {n.linkUrl ? (
                n.linkUrl.startsWith("http") ? (
                  <a href={n.linkUrl} target="_blank" rel="noreferrer" className="block h-full">{card}</a>
                ) : (
                  <Link href={n.linkUrl} className="block h-full">{card}</Link>
                )
              ) : (
                card
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
