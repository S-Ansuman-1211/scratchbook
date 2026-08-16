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
  type: z.enum(["MOVIE", "PERSONAL", "GROUP_DIVA"]).default("PERSONAL"),
  edition: z.string().optional(),
  description: z.string().optional(),
  pages: z.number().int().positive().default(4),
  gsm: z.number().int().positive().default(190),
  pricePerPage: z.number().nonnegative().default(800), // paise
  coverUrl: z.string().url().optional().or(z.literal("")),
  pdfUrl: z.string().url().optional().or(z.literal("")),
  readOnline: z.boolean().default(true),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;

  let slug = slugify(d.title) || "magazine";
  if (await prisma.magazine.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const magazine = await prisma.magazine.create({
    data: {
      title: d.title,
      slug,
      type: d.type,
      edition: d.edition || null,
      description: d.description || null,
      pages: d.pages,
      gsm: d.gsm,
      pricePerPage: d.pricePerPage,
      coverUrl: d.coverUrl ? d.coverUrl : null,
      pdfUrl: d.pdfUrl ? d.pdfUrl : null,
      readOnline: d.readOnline,
      publishedAt: new Date(),
    },
  });
  return NextResponse.json({ magazine }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  type: z.enum(["MOVIE", "PERSONAL", "GROUP_DIVA"]).optional(),
  edition: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  pages: z.number().int().positive().optional(),
  gsm: z.number().int().positive().optional(),
  pricePerPage: z.number().nonnegative().optional(),
  coverUrl: z.string().url().nullable().optional().or(z.literal("")),
  pdfUrl: z.string().url().nullable().optional().or(z.literal("")),
  readOnline: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;

  const magazine = await prisma.magazine.update({
    where: { id: d.id },
    data: {
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.type !== undefined ? { type: d.type } : {}),
      ...(d.edition !== undefined ? { edition: d.edition } : {}),
      ...(d.description !== undefined ? { description: d.description } : {}),
      ...(d.pages !== undefined ? { pages: d.pages } : {}),
      ...(d.gsm !== undefined ? { gsm: d.gsm } : {}),
      ...(d.pricePerPage !== undefined ? { pricePerPage: d.pricePerPage } : {}),
      ...(d.coverUrl !== undefined ? { coverUrl: d.coverUrl === "" ? null : d.coverUrl } : {}),
      ...(d.pdfUrl !== undefined ? { pdfUrl: d.pdfUrl === "" ? null : d.pdfUrl } : {}),
      ...(d.readOnline !== undefined ? { readOnline: d.readOnline } : {}),
    },
  });
  return NextResponse.json({ magazine });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.magazine.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
