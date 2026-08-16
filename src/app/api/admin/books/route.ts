import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Prices arrive in rupees from the admin UI; store as paise. null clears a price.
function toPaise(rupees: number | null | undefined) {
  if (rupees == null) return rupees;
  return Math.round(rupees * 100);
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

// ── Update an existing book ───────────────────────────────────────────
const patchSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  authorName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  genre: z.string().nullable().optional(),
  type: z.enum(["ANTHOLOGY", "SOLO", "BIOGRAPHY", "AUTOBIOGRAPHY"]).optional(),
  status: z.enum(["UPCOMING", "PUBLISHED", "DRAFT"]).optional(),
  paperbackPrice: z.number().nonnegative().nullable().optional(),
  hardcasePrice: z.number().nonnegative().nullable().optional(),
  ebookPrice: z.number().nonnegative().nullable().optional(),
  coverUrl: z.string().url().nullable().optional().or(z.literal("")),
});

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;

  const book = await prisma.book.update({
    where: { id: d.id },
    data: {
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.authorName !== undefined ? { authorName: d.authorName } : {}),
      ...(d.description !== undefined ? { description: d.description } : {}),
      ...(d.language !== undefined ? { language: d.language } : {}),
      ...(d.genre !== undefined ? { genre: d.genre } : {}),
      ...(d.type !== undefined ? { type: d.type } : {}),
      ...(d.status !== undefined ? { status: d.status } : {}),
      ...(d.paperbackPrice !== undefined ? { paperbackPrice: toPaise(d.paperbackPrice) } : {}),
      ...(d.hardcasePrice !== undefined ? { hardcasePrice: toPaise(d.hardcasePrice) } : {}),
      ...(d.ebookPrice !== undefined ? { ebookPrice: toPaise(d.ebookPrice) } : {}),
      ...(d.coverUrl !== undefined ? { coverUrl: d.coverUrl === "" ? null : d.coverUrl } : {}),
      ...(d.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
    },
  });

  return NextResponse.json({ book });
}

// ── Create a new book ─────────────────────────────────────────────────
const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authorName: z.string().optional(),
  description: z.string().optional(),
  language: z.string().optional(),
  genre: z.string().optional(),
  type: z.enum(["ANTHOLOGY", "SOLO", "BIOGRAPHY", "AUTOBIOGRAPHY"]).default("SOLO"),
  status: z.enum(["UPCOMING", "PUBLISHED", "DRAFT"]).default("PUBLISHED"),
  coverUrl: z.string().url().optional().or(z.literal("")),
  paperbackPrice: z.number().nonnegative().nullable().optional(),
  hardcasePrice: z.number().nonnegative().nullable().optional(),
  ebookPrice: z.number().nonnegative().nullable().optional(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;

  // Unique slug from the title.
  let slug = slugify(d.title) || "book";
  if (await prisma.book.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const book = await prisma.book.create({
    data: {
      title: d.title,
      slug,
      authorName: d.authorName || null,
      description: d.description || null,
      language: d.language || null,
      genre: d.genre || null,
      type: d.type,
      status: d.status,
      coverUrl: d.coverUrl ? d.coverUrl : null,
      paperbackPrice: toPaise(d.paperbackPrice) ?? null,
      hardcasePrice: toPaise(d.hardcasePrice) ?? null,
      ebookPrice: toPaise(d.ebookPrice) ?? null,
      publishedAt: d.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json({ book }, { status: 201 });
}

// ── Delete a book ─────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.book.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
