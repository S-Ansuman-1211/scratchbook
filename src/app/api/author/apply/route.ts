import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAuthorAppConfig } from "@/lib/settings";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  aadhaar: z.string().optional(),
  bio: z.string().min(10, "Tell us a little about yourself"),
  genre: z.string().optional(),
  manuscriptUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Please sign in to apply" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;

  // Enforce admin-configured required fields.
  const cfg = await getAuthorAppConfig();
  if (cfg.requireAadhaar && !d.aadhaar?.trim()) {
    return NextResponse.json({ error: "Aadhaar / ID is required." }, { status: 400 });
  }
  if (cfg.requireManuscript && !d.manuscriptUrl) {
    return NextResponse.json({ error: "Please upload your manuscript." }, { status: 400 });
  }

  // Already an author?
  if (session.user.role === "AUTHOR") {
    return NextResponse.json({ error: "You are already an author." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.authorApplication.create({
      data: {
        userId: session.user.id,
        name: d.name,
        phone: d.phone,
        email: d.email,
        aadhaar: d.aadhaar || null,
        bio: d.bio,
        genre: d.genre || null,
        manuscriptUrl: d.manuscriptUrl ? d.manuscriptUrl : null,
      },
    }),
    prisma.user.update({ where: { id: session.user.id }, data: { authorRequestedAt: new Date() } }),
  ]);

  return NextResponse.json({ ok: true });
}
