import { prisma } from "@/lib/prisma";
import { getPhonePeClient } from "@/lib/phonepe";

type FinalizeResult = { status: "PAID" | "FAILED" | "PENDING"; orderId: string };

// Confirms an order's real state with PhonePe (source of truth), updates our DB,
// and clears the buyer's cart on success. Safe to call multiple times (idempotent):
// once an order is PAID we don't touch it again.
export async function finalizeOrder(orderId: string): Promise<FinalizeResult> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { status: "FAILED", orderId };

  // Already settled — don't re-process.
  if (order.status === "PAID" || order.status === "FULFILLED") {
    return { status: "PAID", orderId };
  }
  if (order.status === "FAILED") {
    return { status: "FAILED", orderId };
  }

  const client = getPhonePeClient();
  const statusResponse = await client.getOrderStatus(order.merchantOrderId ?? order.id);
  const state = statusResponse.state; // COMPLETED | FAILED | PENDING

  if (state === "COMPLETED") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", phonepeState: "COMPLETED" },
      }),
      prisma.cartItem.deleteMany({ where: { userId: order.userId } }),
    ]);
    return { status: "PAID", orderId };
  }

  if (state === "FAILED") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED", phonepeState: "FAILED" },
    });
    return { status: "FAILED", orderId };
  }

  // Still pending at PhonePe.
  await prisma.order.update({
    where: { id: order.id },
    data: { phonepeState: "PENDING" },
  });
  return { status: "PENDING", orderId };
}
