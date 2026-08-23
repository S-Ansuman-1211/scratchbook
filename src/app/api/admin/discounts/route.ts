import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";
import { z } from "zod";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

// Grant/reject a discount request, or directly set a user's discount %.
const schema = z.union([
  z.object({ requestId: z.string(), action: z.literal("grant"), percent: z.number().min(1).max(100) }),
  z.object({ requestId: z.string(), action: z.literal("reject") }),
  z.object({ userId: z.string(), percent: z.number().min(0).max(100) }), // direct set / remove
]);

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;

  // Direct set/remove a user's discount.
  if ("userId" in d) {
    await prisma.user.update({ where: { id: d.userId }, data: { discountPercent: d.percent } });
    return NextResponse.json({ ok: true });
  }

  const request = await prisma.discountRequest.findUnique({ where: { id: d.requestId }, include: { user: true } });
  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  if (d.action === "grant") {
    await prisma.$transaction([
      prisma.discountRequest.update({ where: { id: d.requestId }, data: { status: "APPROVED", grantedPercent: d.percent } }),
      prisma.user.update({ where: { id: request.userId }, data: { discountPercent: d.percent } }),
    ]);
    sendEmail({
      to: request.user.email,
      subject: `Your ${d.percent}% discount is active 🎉`,
      html: emailLayout(
        "Discount granted!",
        `<p>Hi ${request.user.name}, we've applied a <strong>${d.percent}% discount</strong> to your account. It will be applied automatically at checkout.</p>`
      ),
    });
  } else {
    await prisma.discountRequest.update({ where: { id: d.requestId }, data: { status: "REJECTED" } });
  }

  return NextResponse.json({ ok: true });
}
