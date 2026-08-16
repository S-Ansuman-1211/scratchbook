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
  excerpt: z.string().optional(),
  body: z.string().optional(),
  coverUrl: z.string().url().optional().or(z.literal("")),
  linkUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(true),
});

// Create a blog post (or an external-link feature if only linkUrl is given).
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;

  let slug = slugify(d.title) || "post";
  if (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      title: d.title,
      slug,
      excerpt: d.excerpt || null,
      body: d.body || "",
      coverUrl: d.coverUrl ? d.coverUrl : null,
      linkUrl: d.linkUrl ? d.linkUrl : null,
      published: d.published,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  excerpt: z.string().nullable().optional(),
  body: z.string().optional(),
  coverUrl: z.string().url().nullable().optional().or(z.literal("")),
  linkUrl: z.string().url().nullable().optional().or(z.literal("")),
  published: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;

  const post = await prisma.blogPost.update({
    where: { id: d.id },
    data: {
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.excerpt !== undefined ? { excerpt: d.excerpt } : {}),
      ...(d.body !== undefined ? { body: d.body } : {}),
      ...(d.coverUrl !== undefined ? { coverUrl: d.coverUrl === "" ? null : d.coverUrl } : {}),
      ...(d.linkUrl !== undefined ? { linkUrl: d.linkUrl === "" ? null : d.linkUrl } : {}),
      ...(d.published !== undefined ? { published: d.published } : {}),
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.blogPost.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
