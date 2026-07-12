import Image from "next/image";

/**
 * Renders a book cover.
 *  - If `coverUrl` is set, shows the real image (via next/image).
 *  - Otherwise shows a tasteful, on-brand *typeset* placeholder (title + author
 *    on a paper-like card) instead of a random coloured block.
 *
 * This keeps the catalog looking finished even before real cover art is
 * uploaded — just set `coverUrl` on the Book and the image takes over.
 */
export default function BookCover({
  title,
  author,
  coverUrl,
  className = "",
}: {
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-xl border border-line shadow-soft ${className}`}
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={`Cover of ${title}`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      ) : (
        <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-ink to-[#2a2740] p-4 text-white">
          {/* faint book spine line */}
          <span className="pointer-events-none absolute inset-y-0 left-3 w-px bg-white/10" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-light">
            ScratchBook
          </span>
          <div className="flex flex-1 items-center pl-2">
            <h3 className="font-serif text-[15px] font-semibold leading-snug text-white/95 line-clamp-4">
              {title}
            </h3>
          </div>
          <div className="pl-2">
            <span className="block h-px w-8 bg-gold/70" />
            <span className="mt-2 block text-[11px] italic text-white/60">
              {author ?? "ScratchBook Publications"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
