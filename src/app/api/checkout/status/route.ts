import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { finalizeOrder } from "@/lib/finalizeOrder";

// Called by the /payment-status page after PhonePe redirects the buyer back.
// Confirms the payment with PhonePe and returns the final state.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const orderId = new URL(req.url).searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  // Ensure the order belongs to the requesting user.
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    const result = await finalizeOrder(orderId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("PhonePe status error:", err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 502 });
  }
}
