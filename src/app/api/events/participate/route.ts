import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  eventId: z.string().optional(),
  eventTitle: z.string().min(1, "Event is required"),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  category: z.string().optional(),
  message: z.string().max(2000).optional(),
  entryUrl: z.string().url("Enter a valid link").optional().or(z.literal("")),
});

// Records a participation entry when someone signs up for an event/competition.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid entry" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  await prisma.eventParticipation.create({
    data: {
      // Only link a real event row; fallback events have no DB id.
      eventId: d.eventId && d.eventId.length > 0 ? d.eventId : null,
      eventTitle: d.eventTitle,
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      category: d.category || null,
      message: d.message || null,
      entryUrl: d.entryUrl ? d.entryUrl : null,
    },
  });

  // Confirmation email to the participant (best-effort).
  sendEmail({
    to: d.email,
    subject: `You're registered · ${d.eventTitle}`,
    html: emailLayout(
      "You're in! 🎉",
      `<p>Hi ${d.name}, thanks for registering for <strong>${d.eventTitle}</strong>.</p>
       <p>We'll email you the submission details and next steps shortly. Best of luck!</p>`
    ),
  });

  return NextResponse.json({ ok: true });
}
