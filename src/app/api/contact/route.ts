import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  message: z.string().min(2),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, email, phone, message } = parsed.data;
  await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, message },
  });

  // Notify the business inbox (best-effort).
  const inbox = process.env.CONTACT_INBOX;
  if (inbox) {
    sendEmail({
      to: inbox,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      html: emailLayout(
        "New contact enquiry",
        `<p><strong>Name:</strong> ${name}</p>
         <p><strong>Email:</strong> ${email}</p>
         ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
         <p style="margin-top:12px;white-space:pre-wrap">${message}</p>`
      ),
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
