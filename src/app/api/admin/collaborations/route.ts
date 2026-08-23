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
  name: z.string().min(1, "Name is required"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().optional(),
  status: z.enum(["ACTIVE", "COMING_SOON"]).default("ACTIVE"),
  published: z.boolean().default(true),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;
  let slug = slugify(d.name) || "collab";
  if (await prisma.collaboration.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  const collaboration = await prisma.collaboration.create({
    data: {
      name: d.name,
      slug,
      tagline: d.tagline || null,
      description: d.description || null,
      imageUrl: d.imageUrl ? d.imageUrl : null,
      linkUrl: d.linkUrl || null,
      status: d.status,
      published: d.published,
    },
  });
  return NextResponse.json({ collaboration }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  linkUrl: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "COMING_SOON"]).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;
  const collaboration = await prisma.collaboration.update({
    where: { id: d.id },
    data: {
      ...(d.name !== undefined ? { name: d.name } : {}),
      ...(d.tagline !== undefined ? { tagline: d.tagline } : {}),
      ...(d.description !== undefined ? { description: d.description } : {}),
      ...(d.imageUrl !== undefined ? { imageUrl: d.imageUrl === "" ? null : d.imageUrl } : {}),
      ...(d.linkUrl !== undefined ? { linkUrl: d.linkUrl } : {}),
      ...(d.status !== undefined ? { status: d.status } : {}),
      ...(d.published !== undefined ? { published: d.published } : {}),
    },
  });
  return NextResponse.json({ collaboration });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.collaboration.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
