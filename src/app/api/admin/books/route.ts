import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Prices arrive in rupees from the admin UI; store as paise. null clears a price.
const schema = z.object({
  id: z.string(),
  status: z.enum(["UPCOMING", "PUBLISHED", "DRAFT"]).optional(),
  paperbackPrice: z.number().nonnegative().nullable().optional(),
  hardcasePrice: z.number().nonnegative().nullable().optional(),
  ebookPrice: z.number().nonnegative().nullable().optional(),
  coverUrl: z.string().url().nullable().optional().or(z.literal("")),
});

function toPaise(rupees: number | null | undefined) {
  if (rupees == null) return rupees;
  return Math.round(rupees * 100);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { id, status, paperbackPrice, hardcasePrice, ebookPrice, coverUrl } = parsed.data;

  const book = await prisma.book.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(paperbackPrice !== undefined ? { paperbackPrice: toPaise(paperbackPrice) } : {}),
      ...(hardcasePrice !== undefined ? { hardcasePrice: toPaise(hardcasePrice) } : {}),
      ...(ebookPrice !== undefined ? { ebookPrice: toPaise(ebookPrice) } : {}),
      ...(coverUrl !== undefined ? { coverUrl: coverUrl === "" ? null : coverUrl } : {}),
      ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
    },
  });

  return NextResponse.json({ book });
}
