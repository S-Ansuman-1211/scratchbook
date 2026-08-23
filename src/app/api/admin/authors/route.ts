import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  applicationId: z.string(),
  action: z.enum(["approve", "reject"]),
});

// Admin approves or rejects an author application.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { applicationId, action } = parsed.data;

  const app = await prisma.authorApplication.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  if (action === "approve") {
    await prisma.$transaction([
      prisma.authorApplication.update({ where: { id: applicationId }, data: { status: "APPROVED" } }),
      prisma.user.update({
        where: { id: app.userId },
        data: {
          role: "AUTHOR",
          authorRequestedAt: null,
          authorProfile: { connectOrCreate: { where: { userId: app.userId }, create: { bio: app.bio ?? undefined } } },
        },
      }),
    ]);

    sendEmail({
      to: app.user.email,
      subject: "You're now a ScratchBook Author 🎉",
      html: emailLayout(
        "Your author application is approved!",
        `<p>Hi ${app.name}, great news - your author application has been approved.</p>
         <p>Sign in and head to your <strong>Author Dashboard</strong> to start publishing, track sales and manage your books.</p>`
      ),
    });
  } else {
    await prisma.$transaction([
      prisma.authorApplication.update({ where: { id: applicationId }, data: { status: "REJECTED" } }),
      prisma.user.update({ where: { id: app.userId }, data: { authorRequestedAt: null } }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
