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

// Compact, mostly-text sliding news strip (small thumbnail + headline).
export default function NewsCarousel({ items }: { items: NewsItem[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    track.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => scrollBy(-1)} aria-label="Previous" className="hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-white text-ink/60 hover:border-brand hover:text-brand sm:grid">‹</button>

      <div
        ref={track}
        className="flex flex-1 snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((n) => {
          const inner = (
            <div className="flex h-14 w-[300px] shrink-0 snap-start items-center gap-3 rounded-full border border-line bg-white pr-4 shadow-soft transition hover:border-brand/40 hover:shadow-lift">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-ink to-[#2a2740]">
                {n.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.imageUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{n.title}</p>
            </div>
          );
          return n.linkUrl ? (
            n.linkUrl.startsWith("http") ? (
              <a key={n.id} href={n.linkUrl} target="_blank" rel="noreferrer">{inner}</a>
            ) : (
              <Link key={n.id} href={n.linkUrl}>{inner}</Link>
            )
          ) : (
            <div key={n.id}>{inner}</div>
          );
        })}
      </div>

      <button onClick={() => scrollBy(1)} aria-label="Next" className="hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-white text-ink/60 hover:border-brand hover:text-brand sm:grid">›</button>
    </div>
  );
}
