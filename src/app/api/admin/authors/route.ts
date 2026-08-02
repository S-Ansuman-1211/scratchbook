import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  action: z.enum(["approve", "reject"]),
});

// Admin approves or rejects a pending author application.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { userId, action } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "approve") {
    // Promote to AUTHOR, create the author profile (if missing), clear the request.
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "AUTHOR",
        authorRequestedAt: null,
        authorProfile: {
          connectOrCreate: {
            where: { userId },
            create: {},
          },
        },
      },
    });

    sendEmail({
      to: user.email,
      subject: "You're now a ScratchBook Author 🎉",
      html: emailLayout(
        "Your author account is approved!",
        `<p>Hi ${user.name}, great news — your author application has been approved.</p>
         <p>Log in and head to your <strong>Author Dashboard</strong> to start publishing, track sales and manage your books.</p>`
      ),
    });
  } else {
    // Reject: just clear the pending request (they remain a customer).
    await prisma.user.update({
      where: { id: userId },
      data: { authorRequestedAt: null },
    });
  }

  return NextResponse.json({ ok: true });
}
