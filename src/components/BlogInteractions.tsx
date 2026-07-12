"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type Comment = { id: string; authorName: string; body: string; createdAt: string };

export function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  async function like() {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    await fetch("/api/blog/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    }).catch(() => setLikes((n) => n - 1));
  }

  return (
    <button
      onClick={like}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        liked ? "border-brand bg-brand-tint text-brand" : "border-line bg-white text-ink/70 hover:border-brand/40"
      }`}
    >
      {liked ? "❤" : "🤍"} {likes} {likes === 1 ? "like" : "likes"}
    </button>
  );
}

export function Comments({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: Comment[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      postId,
      authorName: session?.user?.name ?? String(data.get("authorName") ?? ""),
      body: String(data.get("body") ?? ""),
    };

    const res = await fetch("/api/blog/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const { comment } = await res.json();
      setComments((c) => [{ ...comment, createdAt: comment.createdAt }, ...c]);
      form.reset();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Could not post comment.");
    }
    setSaving(false);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-ink">
        Comments <span className="text-ink/40">({comments.length})</span>
      </h2>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {!session?.user && (
          <input name="authorName" required placeholder="Your name" className="input" />
        )}
        <textarea name="body" required rows={3} placeholder="Share your thoughts…" className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Posting…" : "Post comment"}
        </button>
      </form>

      <ul className="mt-8 space-y-5">
        {comments.length === 0 && <li className="text-sm text-ink/50">Be the first to comment.</li>}
        {comments.map((c) => (
          <li key={c.id} className="border-b border-line pb-5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-tint text-xs font-bold text-brand">
                {c.authorName[0]?.toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-ink">{c.authorName}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
