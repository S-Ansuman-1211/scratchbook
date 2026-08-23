import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(5, "Please add a short note"),
  bookTitle: z.string().optional(),
});

// A signed-in user/author requests a discount; goes to the admin queue.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Please sign in to request a discount" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  await prisma.discountRequest.create({
    data: {
      userId: session.user.id,
      message: parsed.data.message,
      bookTitle: parsed.data.bookTitle || null,
    },
  });

  return NextResponse.json({ ok: true });
}
