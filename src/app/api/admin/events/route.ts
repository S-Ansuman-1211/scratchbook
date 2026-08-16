import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}
function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["EVENT", "COMPETITION", "COLLABORATION", "AWARD", "RECORD"]).default("COMPETITION"),
  description: z.string().optional(),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  isOpen: z.boolean().default(true),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;

  let slug = slugify(d.title) || "event";
  if (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const event = await prisma.event.create({
    data: {
      title: d.title,
      slug,
      type: d.type,
      description: d.description || null,
      bannerUrl: d.bannerUrl ? d.bannerUrl : null,
      isOpen: d.isOpen,
    },
  });
  return NextResponse.json({ event }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  type: z.enum(["EVENT", "COMPETITION", "COLLABORATION", "AWARD", "RECORD"]).optional(),
  description: z.string().nullable().optional(),
  bannerUrl: z.string().url().nullable().optional().or(z.literal("")),
  isOpen: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;

  const event = await prisma.event.update({
    where: { id: d.id },
    data: {
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.type !== undefined ? { type: d.type } : {}),
      ...(d.description !== undefined ? { description: d.description } : {}),
      ...(d.bannerUrl !== undefined ? { bannerUrl: d.bannerUrl === "" ? null : d.bannerUrl } : {}),
      ...(d.isOpen !== undefined ? { isOpen: d.isOpen } : {}),
    },
  });
  return NextResponse.json({ event });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.event.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
