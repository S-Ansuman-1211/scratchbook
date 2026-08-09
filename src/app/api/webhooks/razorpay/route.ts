import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { sendEmail, emailLayout } from "@/lib/email";
import { formatINR } from "@/lib/money";

// Razorpay server-to-server webhook. Acts as a reliable backstop to the
// browser-side verification: if a customer pays but closes the tab before
// returning, this still confirms the order.
//
// Set the same secret here (RAZORPAY_WEBHOOK_SECRET) and in the Razorpay
// dashboard (Settings → Webhooks) for the events: payment.captured, order.paid.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: { id?: string; order_id?: string } };
      order?: { entity?: { id?: string } };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const razorpayOrderId =
    event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id;
  const razorpayPaymentId = event.payload?.payment?.entity?.id ?? null;

  // Only act on successful-payment events. Always return 200 for others so
  // Razorpay doesn't keep retrying.
  const paidEvents = ["payment.captured", "order.paid"];
  if (!razorpayOrderId || !event.event || !paidEvents.includes(event.event)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId },
    include: { items: true, user: { select: { email: true, name: true } } },
  });

  // Unknown order, or already handled → idempotent no-op.
  if (!order || order.status === "PAID") {
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", razorpayPaymentId: razorpayPaymentId ?? order.razorpayPaymentId },
    }),
    prisma.cartItem.deleteMany({ where: { userId: order.userId } }),
  ]);

  // Confirmation email (best-effort). Safe from duplicates because we only get
  // here when the order was not already PAID.
  if (order.user?.email) {
    const rows = order.items
      .map(
        (it) =>
          `<tr><td style="padding:6px 0">${it.title} × ${it.quantity}</td><td style="padding:6px 0;text-align:right">${formatINR(it.unitPrice * it.quantity)}</td></tr>`
      )
      .join("");
    sendEmail({
      to: order.user.email,
      subject: `Order confirmed · ${formatINR(order.totalAmount)}`,
      html: emailLayout(
        "Thank you for your order! 🎉",
        `<p>Hi ${order.shippingName ?? order.user.name ?? "there"}, your payment was successful and your order is confirmed.</p>
         <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px">
           ${rows}
           <tr><td style="padding:10px 0 0;border-top:1px solid #e8e7f0;font-weight:700">Total</td>
           <td style="padding:10px 0 0;border-top:1px solid #e8e7f0;text-align:right;font-weight:700">${formatINR(order.totalAmount)}</td></tr>
         </table>
         <p style="margin-top:16px">Order reference: <strong>${order.id}</strong></p>`
      ),
    });
  }

  return NextResponse.json({ ok: true });
}
