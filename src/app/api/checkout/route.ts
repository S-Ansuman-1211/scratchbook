import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { getShippingConfig } from "@/lib/settings";
import { computeTotals, type PricedItem } from "@/lib/pricing";
import { z } from "zod";

// Structured delivery details collected on the cart page before payment.
const schema = z.object({
  shippingName: z.string().min(2, "Please enter the delivery name"),
  shippingPhone: z.string().min(7, "Please enter a valid phone number"),
  shippingHouse: z.string().min(1, "Please enter your flat / house number"),
  shippingArea: z.string().min(2, "Please enter the street / area"),
  shippingCity: z.string().min(2, "Please enter the city"),
  shippingState: z.string().min(2, "Please enter the state"),
  shippingPincode: z.string().min(4, "Please enter a valid PIN code"),
  shippingLandmark: z.string().optional(),
  shippingMapUrl: z.string().url("Enter a valid link").optional().or(z.literal("")),
});

function composeAddress(d: z.infer<typeof schema>): string {
  return [d.shippingHouse, d.shippingArea, d.shippingLandmark, `${d.shippingCity}, ${d.shippingState} ${d.shippingPincode}`]
    .filter(Boolean)
    .join(", ");
}

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
  const d = parsed.data;

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

  // Server-authoritative totals (GST on services + shipping rules).
  const shippingCfg = await getShippingConfig();
  const priced: PricedItem[] = cart.map((c) => ({
    kind: c.kind,
    unitPrice: c.unitPrice,
    quantity: c.quantity,
    meta: (c.meta as { format?: string } | null) ?? undefined,
  }));
  const { subtotal, tax, shippingCost, total } = computeTotals(priced, shippingCfg);

  // Create the Razorpay order (amount in paise, incl. tax + shipping).
  const rzpOrder = await razorpay.orders.create({
    amount: total,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      subtotal,
      taxAmount: tax,
      shippingCost,
      totalAmount: total,
      currency: "INR",
      razorpayOrderId: rzpOrder.id,
      shippingName: d.shippingName,
      shippingPhone: d.shippingPhone,
      shippingHouse: d.shippingHouse,
      shippingArea: d.shippingArea,
      shippingCity: d.shippingCity,
      shippingState: d.shippingState,
      shippingPincode: d.shippingPincode,
      shippingLandmark: d.shippingLandmark || null,
      shippingMapUrl: d.shippingMapUrl ? d.shippingMapUrl : null,
      shippingAddress: composeAddress(d),
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
    amount: total,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    customer: { name: d.shippingName, email: session.user.email, contact: d.shippingPhone },
  });
}
