import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getShippingConfig } from "@/lib/settings";
import { z } from "zod";

// GET  /api/cart  -> current user's cart + the shipping config (for totals)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const [items, shipping] = await Promise.all([
    prisma.cartItem.findMany({ where: { userId: session.user.id } }),
    getShippingConfig(),
  ]);
  return NextResponse.json({ items, shipping });
}

const addSchema = z.object({
  kind: z.enum(["BOOK", "SERVICE", "MAGAZINE"]),
  refId: z.string(),
  title: z.string(),
  unitPrice: z.number().int().nonnegative(), // paise
  quantity: z.number().int().positive().default(1),
  meta: z.record(z.any()).optional(),
});

// POST /api/cart  -> add an item
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = addSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid item" }, { status: 400 });

  const item = await prisma.cartItem.create({
    data: { ...parsed.data, userId: session.user.id, meta: parsed.data.meta ?? undefined },
  });
  return NextResponse.json({ item }, { status: 201 });
}

// DELETE /api/cart?id=...  -> remove an item
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.cartItem.deleteMany({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
