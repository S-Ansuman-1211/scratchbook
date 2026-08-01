import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendEmail, emailLayout } from "@/lib/email";
import { formatINR } from "@/lib/money";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(), // our internal order id
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

// Called by the client after Razorpay Checkout succeeds. Verifies the signature,
// marks the order PAID, and clears the cart. NEVER trust the client without this.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

  const valid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!valid) {
    await prisma.order.update({ where: { id: orderId }, data: { status: "FAILED" } }).catch(() => {});
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  // Mark paid and clear the user's cart atomically.
  const [order] = await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        razorpayPaymentId,
        razorpaySignature,
      },
      include: { items: true },
    }),
    prisma.cartItem.deleteMany({ where: { userId: session.user.id } }),
  ]);

  // Send an order-confirmation email (best-effort; never blocks the response).
  if (session.user.email) {
    const rows = order.items
      .map(
        (it) =>
          `<tr><td style="padding:6px 0">${it.title} × ${it.quantity}</td><td style="padding:6px 0;text-align:right">${formatINR(it.unitPrice * it.quantity)}</td></tr>`
      )
      .join("");
    sendEmail({
      to: session.user.email,
      subject: `Order confirmed · ${formatINR(order.totalAmount)}`,
      html: emailLayout(
        "Thank you for your order! 🎉",
        `<p>Hi ${order.shippingName ?? session.user.name ?? "there"}, your payment was successful and your order is confirmed.</p>
         <table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px">
           ${rows}
           <tr><td style="padding:10px 0 0;border-top:1px solid #e8e7f0;font-weight:700">Total</td>
           <td style="padding:10px 0 0;border-top:1px solid #e8e7f0;text-align:right;font-weight:700">${formatINR(order.totalAmount)}</td></tr>
         </table>
         ${order.shippingAddress ? `<p style="margin-top:16px"><strong>Delivering to:</strong><br/>${order.shippingName}, ${order.shippingPhone}<br/>${order.shippingAddress}</p>` : ""}
         <p style="margin-top:16px">Order reference: <strong>${order.id}</strong></p>`
      ),
    });
  }

  return NextResponse.json({ ok: true, orderId });
}
