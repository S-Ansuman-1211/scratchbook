"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookRow = { id: string; title: string; copiesSold: number; royaltyRupees: number };
type Available = { id: string; title: string };

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
  const [rows, setRows] = useState<BookRow[]>(linkedBooks);
  const [available, setAvailable] = useState<Available[]>(availableBooks);
  const [addId, setAddId] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function setRow(id: string, patch: Partial<BookRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addBook() {
    const b = available.find((a) => a.id === addId);
    if (!b) return;
    setRows((rs) => [...rs, { id: b.id, title: b.title, copiesSold: 0, royaltyRupees: 0 }]);
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
          copiesSold: Math.max(0, Math.round(Number(r.copiesSold) || 0)),
          royaltyRupees: Math.max(0, Number(r.royaltyRupees) || 0),
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink">{authorName}</h3>
          {authorEmail && <p className="text-xs text-ink/50">{authorEmail}</p>}
        </div>
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

      {/* Per-book figures */}
      <div>
        <p className="label">Books &amp; sales</p>
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-sm text-ink/45">
            No books linked to this author yet. Add one below.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase text-ink/55">
                <tr>
                  <th className="px-3 py-2">Book</th>
                  <th className="px-3 py-2 w-32">Copies sold</th>
                  <th className="px-3 py-2 w-36">Royalty (₹)</th>
                  <th className="px-3 py-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-line">
                    <td className="px-3 py-2 font-medium">{r.title}</td>
                    <td className="px-3 py-2">
                      <input
                        className="input py-1.5"
                        inputMode="numeric"
                        value={r.copiesSold}
                        onChange={(e) => setRow(r.id, { copiesSold: Number(e.target.value.replace(/\D/g, "")) || 0 })}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        className="input py-1.5"
                        inputMode="decimal"
                        value={r.royaltyRupees}
                        onChange={(e) => setRow(r.id, { royaltyRupees: Number(e.target.value) || 0 })}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => removeBook(r.id)} className="text-xs text-red-500 hover:underline">Unlink</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
