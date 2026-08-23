"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type NewsItem = {
  id: string;
  title: string;
  summary: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
};

// Single-item news ticker on a dark bar. Auto-advances every few seconds,
// pauses on hover, with prev/next controls and dots.
export default function NewsCarousel({ items }: { items: NewsItem[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length, paused]);

  if (items.length === 0) return null;
  const n = items[Math.min(i, items.length - 1)];

  const content = (
    <div key={n.id} className="animate-newsin flex items-center gap-3">
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white/10">
        {n.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={n.imageUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      <p className="line-clamp-1 text-sm font-semibold text-white">{n.title}</p>
    </div>
  );

  const item = n.linkUrl ? (
    n.linkUrl.startsWith("http") ? (
      <a href={n.linkUrl} target="_blank" rel="noreferrer" className="block">{content}</a>
    ) : (
      <Link href={n.linkUrl} className="block">{content}</Link>
    )
  ) : (
    content
  );

  return (
    <div
      className="flex items-center gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.length > 1 && (
        <button onClick={() => setI((p) => (p - 1 + items.length) % items.length)} aria-label="Previous" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 text-white/60 hover:border-white/60 hover:text-white">‹</button>
      )}

      <div className="min-w-0 flex-1 overflow-hidden">{item}</div>

      {items.length > 1 && (
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to news ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-4 bg-white" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      )}

      {items.length > 1 && (
        <button onClick={() => setI((p) => (p + 1) % items.length)} aria-label="Next" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 text-white/60 hover:border-white/60 hover:text-white">›</button>
      )}
    </div>
  );
}
