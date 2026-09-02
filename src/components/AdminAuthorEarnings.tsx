"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CHANNELS = [
  { key: "DIRECT", label: "Direct (Author copies)" },
  { key: "AMAZON", label: "Amazon" },
  { key: "BOOKSTORE", label: "Book Store" },
  { key: "EBOOK_STORE", label: "Online E-Book Store" },
] as const;

type ChannelKey = (typeof CHANNELS)[number]["key"];
type ChannelFig = { copiesSold: number; royaltyRupees: number };
type BookRow = { id: string; title: string; byChannel: Partial<Record<ChannelKey, ChannelFig>> };
type Available = { id: string; title: string };

const emptyChannels = (src?: Partial<Record<ChannelKey, ChannelFig>>) =>
  Object.fromEntries(
    CHANNELS.map((c) => [c.key, { copiesSold: src?.[c.key]?.copiesSold ?? 0, royaltyRupees: src?.[c.key]?.royaltyRupees ?? 0 }])
  ) as Record<ChannelKey, ChannelFig>;

export default function AdminAuthorEarnings({
  profileId,
  authorName,
  authorEmail,
  totalEarningsRupees,
  walletBalanceRupees,
  linkedBooks,
  availableBooks,
}: {
  profileId: string;
  authorName: string;
  authorEmail: string;
  totalEarningsRupees: number;
  walletBalanceRupees: number;
  linkedBooks: BookRow[];
  availableBooks: Available[];
}) {
  const router = useRouter();
  const [earnings, setEarnings] = useState(String(totalEarningsRupees));
  const [wallet, setWallet] = useState(String(walletBalanceRupees));
  const [rows, setRows] = useState(linkedBooks.map((b) => ({ id: b.id, title: b.title, channels: emptyChannels(b.byChannel) })));
  const [available, setAvailable] = useState<Available[]>(availableBooks);
  const [addId, setAddId] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function setCell(bookId: string, ch: ChannelKey, patch: Partial<ChannelFig>) {
    setRows((rs) => rs.map((r) => (r.id === bookId ? { ...r, channels: { ...r.channels, [ch]: { ...r.channels[ch], ...patch } } } : r)));
  }

  function addBook() {
    const b = available.find((a) => a.id === addId);
    if (!b) return;
    setRows((rs) => [...rs, { id: b.id, title: b.title, channels: emptyChannels() }]);
    setAvailable((av) => av.filter((a) => a.id !== b.id));
    setAddId("");
  }

  function removeBook(id: string) {
    const row = rows.find((r) => r.id === id);
    setRows((rs) => rs.filter((r) => r.id !== id));
    if (row) setAvailable((av) => [...av, { id: row.id, title: row.title }]);
  }

  async function save() {
    setState("saving");
    const res = await fetch("/api/admin/author-earnings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId,
        totalEarningsRupees: Number(earnings) || 0,
        walletBalanceRupees: Number(wallet) || 0,
        books: rows.map((r) => ({
          bookId: r.id,
          sales: CHANNELS.map((c) => ({
            channel: c.key,
            copiesSold: Math.max(0, Math.round(Number(r.channels[c.key].copiesSold) || 0)),
            royaltyRupees: Math.max(0, Number(r.channels[c.key].royaltyRupees) || 0),
          })),
        })),
      }),
    });
    if (res.ok) {
      setState("saved");
      router.refresh();
      setTimeout(() => setState("idle"), 1500);
    } else {
      setState("error");
    }
  }

  return (
    <div className="card space-y-5">
      <div>
        <h3 className="font-serif text-lg font-bold text-ink">{authorName}</h3>
        {authorEmail && <p className="text-xs text-ink/50">{authorEmail}</p>}
      </div>

      {/* Author-level figures */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Total earnings / royalty (₹)</label>
          <input className="input" inputMode="decimal" value={earnings} onChange={(e) => setEarnings(e.target.value)} />
        </div>
        <div>
          <label className="label">Wallet balance / payable (₹)</label>
          <input className="input" inputMode="decimal" value={wallet} onChange={(e) => setWallet(e.target.value)} />
        </div>
      </div>

      {/* Per-book, per-channel figures */}
      <div>
        <p className="label">Books &amp; sales (by channel)</p>
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-sm text-ink/45">
            No books linked to this author yet. Add one below.
          </p>
        ) : (
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.id} className="rounded-lg border border-line">
                <div className="flex items-center justify-between border-b border-line bg-cream px-3 py-2">
                  <span className="text-sm font-semibold text-ink">{r.title}</span>
                  <button onClick={() => removeBook(r.id)} className="text-xs text-red-500 hover:underline">Unlink</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase text-ink/55">
                      <tr>
                        <th className="px-3 py-2">Channel</th>
                        <th className="px-3 py-2 w-32">Copies sold</th>
                        <th className="px-3 py-2 w-36">Royalty (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHANNELS.map((c) => (
                        <tr key={c.key} className="border-t border-line">
                          <td className="px-3 py-2 text-ink/70">{c.label}</td>
                          <td className="px-3 py-2">
                            <input
                              className="input py-1.5"
                              inputMode="numeric"
                              value={r.channels[c.key].copiesSold}
                              onChange={(e) => setCell(r.id, c.key, { copiesSold: Number(e.target.value.replace(/\D/g, "")) || 0 })}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className="input py-1.5"
                              inputMode="decimal"
                              value={r.channels[c.key].royaltyRupees}
                              onChange={(e) => setCell(r.id, c.key, { royaltyRupees: Number(e.target.value) || 0 })}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {available.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <select className="input py-1.5" value={addId} onChange={(e) => setAddId(e.target.value)}>
              <option value="">Add a book to this author…</option>
              {available.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <button onClick={addBook} disabled={!addId} className="btn-outline shrink-0 px-4 py-1.5 text-sm">Add</button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={state === "saving"} className="btn-primary px-6 py-2">
          {state === "saving" ? "Saving…" : state === "saved" ? "✓ Saved" : state === "error" ? "Retry" : "Save"}
        </button>
        {state === "error" && <span className="text-sm text-red-600">Could not save. Try again.</span>}
      </div>
    </div>
  );
}
