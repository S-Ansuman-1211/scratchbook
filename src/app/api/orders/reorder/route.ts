import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ orderId: z.string() });

// Re-adds all items from a past order back into the user's cart.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  // Only the owner can reorder their order.
  const order = await prisma.order.findFirst({
    where: { id: parsed.data.orderId, userId: session.user.id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  await prisma.cartItem.createMany({
    data: order.items.map((it) => ({
      userId: session.user.id,
      kind: it.kind,
      refId: it.refId,
      title: it.title,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      meta: it.meta ?? undefined,
    })),
  });

  return NextResponse.json({ ok: true, count: order.items.length });
}
