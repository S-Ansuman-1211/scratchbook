import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPhonePeClient, isPhonePeConfigured } from "@/lib/phonepe";
import { StandardCheckoutPayRequest } from "pg-sdk-node";

// Creates a pending Order from the signed-in user's cart, then asks PhonePe for a
// hosted checkout URL. The client redirects the buyer to `redirectUrl`.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const cart = await prisma.cartItem.findMany({ where: { userId: session.user.id } });
  if (cart.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  if (!isPhonePeConfigured()) {
    return NextResponse.json(
      { error: "Payment gateway not configured. Add PhonePe credentials to .env." },
      { status: 503 }
    );
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Persist a pending order with its items snapshot. We use this order's own id as
  // the merchantOrderId that PhonePe echoes back to us.
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      totalAmount,
      currency: "INR",
      items: {
        create: cart.map((c) => ({
          kind: c.kind,
          refId: c.refId,
          bookId: c.kind === "BOOK" ? c.refId : null,
          title: c.title,
          unitPrice: c.unitPrice,
          quantity: c.quantity,
          meta: c.meta ?? undefined,
        })),
      },
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { merchantOrderId: order.id },
  });

  const baseUrl = process.env.APP_BASE_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const redirectUrl = `${baseUrl}/payment-status?orderId=${order.id}`;

  try {
    const client = getPhonePeClient();
    const payRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(order.id)
      .amount(totalAmount) // amount in paise
      .redirectUrl(redirectUrl)
      .build();

    const response = await client.pay(payRequest);

    await prisma.order.update({
      where: { id: order.id },
      data: { phonepeOrderId: response.orderId ?? null, phonepeState: "PENDING" },
    });

    return NextResponse.json({
      orderId: order.id,
      redirectUrl: response.redirectUrl, // PhonePe-hosted checkout page
    });
  } catch (err) {
    console.error("PhonePe pay error:", err);
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED", phonepeState: "FAILED" },
    }).catch(() => {});
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
