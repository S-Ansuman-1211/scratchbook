import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET -> the user's wishlist (book ids)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const items = await prisma.wishlistItem.findMany({ where: { userId: session.user.id }, select: { bookId: true } });
  return NextResponse.json({ bookIds: items.map((i) => i.bookId) });
}

const schema = z.object({ bookId: z.string() });

// POST -> add to wishlist (idempotent)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await prisma.wishlistItem
    .upsert({
      where: { userId_bookId: { userId: session.user.id, bookId: parsed.data.bookId } },
      update: {},
      create: { userId: session.user.id, bookId: parsed.data.bookId },
    })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}

// DELETE ?bookId=... -> remove
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const bookId = new URL(req.url).searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
  await prisma.wishlistItem.deleteMany({ where: { userId: session.user.id, bookId } });
  return NextResponse.json({ ok: true });
}
