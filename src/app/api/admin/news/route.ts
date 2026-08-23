import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(true),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;
  const news = await prisma.news.create({
    data: {
      title: d.title,
      summary: d.summary || null,
      imageUrl: d.imageUrl ? d.imageUrl : null,
      linkUrl: d.linkUrl ? d.linkUrl : null,
      published: d.published,
    },
  });
  return NextResponse.json({ news }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  published: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;
  const news = await prisma.news.update({
    where: { id: d.id },
    data: { ...(d.published !== undefined ? { published: d.published } : {}) },
  });
  return NextResponse.json({ news });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.news.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
