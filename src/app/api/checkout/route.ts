import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { z } from "zod";

// Delivery details collected on the cart page before payment.
const schema = z.object({
  shippingName: z.string().min(2, "Please enter the delivery name"),
  shippingPhone: z.string().min(7, "Please enter a valid phone number"),
  shippingAddress: z.string().min(10, "Please enter the full delivery address"),
});

// Creates a Razorpay order from the signed-in user's cart, and a matching
// pending Order in our DB. Returns the data the client needs to open Checkout.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please fill in your delivery details" },
      { status: 400 }
    );
  }
  const { shippingName, shippingPhone, shippingAddress } = parsed.data;

  const cart = await prisma.cartItem.findMany({ where: { userId: session.user.id } });
  if (cart.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payment gateway not configured. Add Razorpay keys to .env." },
      { status: 503 }
    );
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Create the Razorpay order (amount in paise).
  const rzpOrder = await razorpay.orders.create({
    amount: totalAmount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  // Persist a pending order with its items snapshot and delivery details.
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      totalAmount,
      currency: "INR",
      razorpayOrderId: rzpOrder.id,
      shippingName,
      shippingPhone,
      shippingAddress,
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

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: rzpOrder.id,
    amount: totalAmount,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    customer: {
      name: shippingName,
      email: session.user.email,
      contact: shippingPhone,
    },
  });
}
