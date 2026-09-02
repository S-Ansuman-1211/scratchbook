import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Admin edits an author's dashboard figures: total royalty/earnings, wallet
// balance, and per-book, per-channel copies sold + royalty. Linking a book here
// makes it appear on that author's dashboard.
const CHANNELS = ["DIRECT", "AMAZON", "BOOKSTORE", "EBOOK_STORE"] as const;

const schema = z.object({
  profileId: z.string(),
  totalEarningsRupees: z.number().nonnegative(),
  walletBalanceRupees: z.number().nonnegative(),
  books: z
    .array(
      z.object({
        bookId: z.string(),
        sales: z
          .array(
            z.object({
              channel: z.enum(CHANNELS),
              copiesSold: z.number().int().nonnegative(),
              royaltyRupees: z.number().nonnegative(),
            })
          )
          .default([]),
      })
    )
    .default([]),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;

  const profile = await prisma.authorProfile.findUnique({ where: { id: d.profileId } });
  if (!profile) return NextResponse.json({ error: "Author not found" }, { status: 404 });

  // Sale records cover the current month.
  const now = new Date();
  const periodMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const keepIds = d.books.map((b) => b.bookId);

  await prisma.$transaction([
    // 1. Author-level figures.
    prisma.authorProfile.update({
      where: { id: d.profileId },
      data: {
        totalEarnings: Math.round(d.totalEarningsRupees * 100),
        walletBalance: Math.round(d.walletBalanceRupees * 100),
      },
    }),
    // 2. Unlink books that were this author's but are no longer in the list.
    prisma.book.updateMany({
      where: { authorProfileId: d.profileId, id: { notIn: keepIds } },
      data: { authorProfileId: null },
    }),
    // 3. Clear existing sale records for this author's books and for any book
    //    we're about to (re)write, so figures stay idempotent.
    prisma.saleRecord.deleteMany({ where: { book: { authorProfileId: d.profileId } } }),
    prisma.saleRecord.deleteMany({ where: { bookId: { in: keepIds } } }),
    // 4. Link + write fresh per-channel figures for each listed book. Only
    //    channels with any copies or royalty are stored.
    ...d.books.flatMap((b) => [
      prisma.book.update({ where: { id: b.bookId }, data: { authorProfileId: d.profileId } }),
      ...b.sales
        .filter((s) => s.copiesSold > 0 || s.royaltyRupees > 0)
        .map((s) =>
          prisma.saleRecord.create({
            data: {
              bookId: b.bookId,
              channel: s.channel,
              copiesSold: s.copiesSold,
              profitEarned: Math.round(s.royaltyRupees * 100),
              periodMonth,
            },
          })
        ),
    ]),
  ]);

  return NextResponse.json({ ok: true });
}
